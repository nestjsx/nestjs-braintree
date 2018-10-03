import {Module, OnModuleInit,} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import BraintreeWebhookController from './braintree.webhook.controller';
import BraintreeWebhookProvider from './braintree.webhook.provider';
import BraintreeModule from './braintree.module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { metadata as NEST_METADATA_CONSTANTS } from '@nestjs/common/constants';
import { BRAINTREE_WEBHOOK_PROVIDER, BRAINTREE_WEBHOOK_METHOD } from './braintree.constants';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { Injectable, DynamicModule } from '@nestjs/common/interfaces';
import { BraintreeWebhookOptionsInterface } from './interfaces';

@Module({
  imports: [BraintreeModule],
  providers: [BraintreeWebhookProvider],
  controllers: [BraintreeWebhookController.forRoot('braintree', 'webhook')],
})
export default class BraintreeWebhookModule implements OnModuleInit {

  constructor(
    private readonly moduleRef: ModuleRef, 
    private readonly modulesContainer: ModulesContainer, 
    private readonly braintreeWebhookProvider: BraintreeWebhookProvider,
  ) {
    this.onModuleInit();
  }

  onModuleInit() {
    [...this.modulesContainer.values()].forEach(({metatype}) => {
      const metadata = Reflect.getMetadata(NEST_METADATA_CONSTANTS.PROVIDERS, metatype) || [];
      const providers = [...metadata.filter(metatype => typeof metatype === 'function')];
      providers.map(provider => {
        if (Reflect.getOwnMetadata(BRAINTREE_WEBHOOK_PROVIDER, provider)) {

          const realProvider = this.moduleRef.get(provider, {strict: false});

          this.braintreeWebhookProvider.addProvider(realProvider);

          const metadataScanner = new MetadataScanner();

          metadataScanner.scanFromPrototype<Injectable, any>(null, provider['prototype'], method => {
            const descriptor = Reflect.getOwnPropertyDescriptor(
              provider['prototype'],
              method,
            );

            const hook = Reflect.getMetadata(BRAINTREE_WEBHOOK_METHOD, descriptor.value);

            if (hook) {
              this.braintreeWebhookProvider.addMethod(hook, method, realProvider.constructor.name);
            }
          });

        }
      });
    });
  }

  public static forRoot(webhookOptions: BraintreeWebhookOptionsInterface): DynamicModule {
    return {
      module: BraintreeWebhookModule,
      imports: [BraintreeModule],
      providers: [BraintreeWebhookProvider],
      controllers: [BraintreeWebhookController.forRoot(webhookOptions.root, webhookOptions.handle)],
    };
  }
}
