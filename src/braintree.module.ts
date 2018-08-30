import {Module, DynamicModule} from '@nestjs/common';
import { BraintreeAsyncOptions, BraintreeOptions } from './interfaces/braintree.options.interface';
import BraintreeCoreModule from './braintree.core.module';

@Module({})
export default class BraintreeModule {
    
    public static register(options: BraintreeOptions): DynamicModule {
        return {
            module: BraintreeModule,
            imports: [BraintreeCoreModule.register(options)],
        }
    }

    public static registerAsync(options: BraintreeAsyncOptions): DynamicModule {
        return {
            module: BraintreeModule,
            imports: [BraintreeCoreModule.registerAsync(options)],
        }
    }
}
