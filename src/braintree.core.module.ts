import {Module, DynamicModule, Provider, Global} from '@nestjs/common';
import { BRAINTREE_OPTIONS_PROVIDER} from './braintree.constants';
import BraintreeProvider from './braintree.provider';
import { BraintreeOptions, BraintreeAsyncOptions } from './interfaces';

@Global()
@Module({})
export default class BraintreeCoreModule {
    
  private static provider = {
    provide: BraintreeProvider,
    useFactory: (options: BraintreeOptions) => new BraintreeProvider(options),
    inject: [BRAINTREE_OPTIONS_PROVIDER],
  };

  public static forRoot(options: BraintreeOptions): DynamicModule {
    return {
      module: BraintreeCoreModule,
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
      module: BraintreeCoreModule,
      providers: [
        this.createOptionsProvider(options),
        this.provider,
      ],
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
