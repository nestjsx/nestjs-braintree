import {Module, DynamicModule, Provider} from '@nestjs/common';
import {BRAINTREE_PROVIDER, BRAINTREE_OPTIONS_PROVIDER} from './braintree.constants';
import BraintreeProvider from './braintree.provider';
import { BraintreeOptions, BraintreeAsyncOptions } from './interfaces/braintree.options.interface';

@Module({})
export default class BraintreeCoreModule {
    
    private static provider = {
        provide: BRAINTREE_PROVIDER,
        useClass: BraintreeProvider,
        inject: [BRAINTREE_OPTIONS_PROVIDER],
    };

    public static register(options: BraintreeOptions): DynamicModule {
        return {
            module: BraintreeCoreModule,
            providers: [
                {
                    provide: BRAINTREE_OPTIONS_PROVIDER,
                    useValue: options,
                },
                this.provider,
            ],
        };
    }

    public static registerAsync(options: BraintreeAsyncOptions): DynamicModule {
        return {
            module: BraintreeCoreModule,
            providers: [
                this.createOptionsProvider(options),
                this.provider,
            ],
        };
    }

    private static createOptionsProvider(options: BraintreeAsyncOptions): Provider {
        return {
            provide: BRAINTREE_OPTIONS_PROVIDER,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };
    }
}