import {Module} from '@nestjs/common';
import BraintreeWebhookController from './braintree.webhook.controller';
import BraintreeWebhookProvider from './braintree.webhook.provider';
import { ModulesContainer } from '@nestjs/core/injector';
import { metadata as NEST_METADATA_CONSTANTS } from '@nestjs/common/constants';
import BraintreeModule from './braintree.module';
import { ComponentMetatype } from '@nestjs/core/injector/module';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED, BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED, BRAINTREE_WEBHOOK_PROVIDER_HANDLERS, BRAINTREE_WEBHOOK_METHOD } from './braintree.constants';
import {BraintreeWebhookMethodTreeInterface} from './interfaces';

const methods: BraintreeWebhookMethodTreeInterface = { 
	[BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED]: [], 
	[BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED]: [],
};

@Module({
  imports: [BraintreeModule.forFeature()],
  providers: [
    {
      provide: BRAINTREE_WEBHOOK_PROVIDER_HANDLERS,
      useFactory: (moduleContainer: ModulesContainer) => {
        BraintreeWebhookModule.getBraintreeEventHandlers([...moduleContainer.values()]);
        return BraintreeWebhookModule.resolveMethods(methods);
      },
      inject: [ModulesContainer],
    },
    BraintreeWebhookProvider,
  ],
  controllers: [BraintreeWebhookController],
})
export default class BraintreeWebhookModule {
  public static getBraintreeEventHandlers(modules: any[]) {
    modules.forEach(({metatype}) => {
      const metadata: ComponentMetatype[] =
      Reflect.getMetadata(NEST_METADATA_CONSTANTS.PROVIDERS, metatype) || [];

      if (metadata.length >= 1) BraintreeWebhookModule.setupProviders([...metadata.filter(metatype => typeof metatype === 'function')]);
    });
  }

  private static setupProviders(providers: ComponentMetatype[]) {
    const metadataScanner = new MetadataScanner();

    providers.map(provider => {
    	metadataScanner.scanFromPrototype(null, provider['prototype'], method => {

				const descriptor = Reflect.getOwnPropertyDescriptor(
					provider['prototype'],
					method,
        );

        const hook = Reflect.getMetadata(BRAINTREE_WEBHOOK_METHOD, descriptor.value);

        if (hook && methods.hasOwnProperty(hook)) methods[hook].push(provider['prototype'][method].bind(provider));

      });

    });
  }

  public static resolveMethods(methods: BraintreeWebhookMethodTreeInterface): BraintreeWebhookMethodTreeInterface {
    const handlers = {};
    Object.keys(methods).forEach(hook => {
      handlers[hook] = new Set(methods[hook]);
    });

    return handlers;
  }
}
