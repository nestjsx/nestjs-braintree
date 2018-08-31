import {Module, NestModule} from '@nestjs/common';
import BraintreeWebhookController from './braintree.webhook.controller';
import BraintreeWebhookProvider from './braintree.webhook.provider';
import { ModulesContainer } from '@nestjs/core/injector';
import { metadata as NEST_METADATA_CONSTANTS } from '@nestjs/common/constants';
import BraintreeModule from './braintree.module';

//TODO pass all methods with providers into webhook provider to call when action occurs in controller

@Module({
    imports: [BraintreeModule],
    providers: [{
        provide: BraintreeWebhookProvider,
        useFactory: async (moduleContainer: ModulesContainer) => {
            BraintreeWebhookModule.getBraintreeEventHandlers([...moduleContainer.values()]);
            return new BraintreeWebhookProvider();
        },
        inject: [ModulesContainer],
    }],
    controllers: [BraintreeWebhookController],
})
export default class BraintreeWebhookModule {
    public static getBraintreeEventHandlers(modules: NestModule[]): Promise<NestModule[]> {
        modules.forEach(({metatype}) => {
            console.log(metatype);
            const metadata: ComponentMetatype[] =
            Reflect.getMetadata(NEST_METADATA_CONSTANTS.PROVIDERS, metatype) || [];
            console.log('metadata', metadata);
        });
    }
}