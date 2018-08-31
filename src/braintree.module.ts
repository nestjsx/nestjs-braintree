import {Module, DynamicModule, Global} from '@nestjs/common';
import { BraintreeAsyncOptions, BraintreeOptions } from './interfaces';
import BraintreeCoreModule from './braintree.core.module';

@Global()
@Module({})
export default class BraintreeModule {
    
    public static forRoot(options: BraintreeOptions): DynamicModule {
        return {
            module: BraintreeModule,
            imports: [BraintreeCoreModule.forRoot(options)],
        };
    }

    public static forRootAsync(options: BraintreeAsyncOptions): DynamicModule {
        return {
            module: BraintreeModule,
            imports: [BraintreeCoreModule.forRootAsync(options)],
        };
    }

    public static forFeature(): DynamicModule {
        return {
            module: BraintreeModule,
            imports: [BraintreeCoreModule.forFeature()],
        };
    }
}
