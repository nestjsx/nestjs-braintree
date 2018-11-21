import { TestingModule, Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { BraintreeModule, BraintreeProvider } from './../../src';

describe('Braintree subscription methods', () => {
  let module: TestingModule;
  let provider: BraintreeProvider;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '__stubs__', 'config', '*.ts'),
        ),
        BraintreeModule.forRootAsync({
          useFactory: async config => config.get('braintree'),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    provider = module.get(BraintreeProvider);
  });

  it('', () => {});

  // it('Create Subscription', async () => {

  //   //TODO implement paymentMethodToken somehow. Try this https://developers.braintreepayments.com/reference/request/payment-method/create/node

  //   // const result = await provider.createSubscription({
  //   //   paymentMethodToken: '',
  //   //   planId: 'c8vr',
  //   // });
  // });
});
