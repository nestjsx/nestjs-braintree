import {Module, NestModule, Injectable, Component, Provider} from '@nestjs/common';
import BraintreeWebhookController from './braintree.webhook.controller';
import BraintreeWebhookProvider from './braintree.webhook.provider';
import { ModulesContainer } from '@nestjs/core/injector';
import { metadata as NEST_METADATA_CONSTANTS } from '@nestjs/common/constants';
import BraintreeModule from './braintree.module';
import { ComponentMetatype } from '@nestjs/core/injector/module';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED, BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED } from './braintree.constants';

const avaliableProviders: {[key: string]: Provider} = {};
const methods: {[key: string]: {
    provider: string,
    method: string,
}[]} = { [BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED]: [], [BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED]: []};


@Module({
    imports: [BraintreeModule],
    providers: [{
        provide: BraintreeWebhookProvider,
        useFactory: async (moduleContainer: ModulesContainer) => {
            BraintreeWebhookModule.getBraintreeEventHandlers([...moduleContainer.values()]);
            return new BraintreeWebhookProvider(avaliableProviders, methods);
        },
        inject: [ModulesContainer],
    }],
    controllers: [BraintreeWebhookController],
})
export default class BraintreeWebhookModule {
    public static getBraintreeEventHandlers(modules: any[]) /*: Promise<NestModule[]>*/ {
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

                [BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED, BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED].forEach(hook => {
                    if (Reflect.getMetadata(
                        hook,
                        descriptor.value,
                      )) {
                        if (!avaliableProviders.hasOwnProperty(provider['prototype'].constructor.name)) {
                            avaliableProviders[provider['prototype'].constructor.name] = provider;
                        }

                        methods[hook].push({
                            provider: provider['prototype'].constructor.name,
                            method,
                        });
                      }
                });
                
            });
        });
    }
}