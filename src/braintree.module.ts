import {Module, DynamicModule, Provider} from '@nestjs/common';
import { BRAINTREE_OPTIONS_PROVIDER} from './braintree.constants';
import BraintreeProvider from './braintree.provider';
import { BraintreeOptions, BraintreeAsyncOptions } from './interfaces';

@Module({})
export default class BraintreeModule {
    
    private static provider = {
        provide: BraintreeProvider,
        useFactory: async (options) => new BraintreeProvider(options),
        inject: [BRAINTREE_OPTIONS_PROVIDER],
    };

    public static forRoot(options: BraintreeOptions): DynamicModule {
        return {
            module: BraintreeModule,
            providers: [
                {
                    provide: BRAINTREE_OPTIONS_PROVIDER,
                    useValue: options,
                },
                this.provider,
            ],
            exports: [BraintreeProvider],
        };
    }

    public static forRootAsync(options: BraintreeAsyncOptions): DynamicModule {
        return {
            module: BraintreeModule,
            providers: [
                this.createOptionsProvider(options),
                this.provider,
            ],
            exports: [BraintreeProvider],
        };
    }

    public static forFeature(): DynamicModule {
        return {
            module: BraintreeModule,
            providers: [BraintreeProvider],
            exports: [BraintreeProvider],
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
