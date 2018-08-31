import {Module, DynamicModule} from '@nestjs/common';
import { BraintreeOptions, BraintreeAsyncOptions } from './interfaces';
import BraintreeCoreModule from './braintree.core.module';

@Module({
})
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
      imports: [BraintreeCoreModule],
    };
  }
}
