import { TestingModule, Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { BraintreeModule, BraintreeProvider } from './../../src';

const nonces = {
  valid: 'fake-valid-nonce',
};

describe('Braintree transaction methods', () => {
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

  it('Create Transaction', async () => {
    const result = await provider.sale({
      payment_method_nonce: nonces.valid,
      amount: '10.00',
    });

    expect(result.success).toBeTruthy();
    expect(result).toHaveProperty('transaction');
    expect(result.transaction).toHaveProperty('amount');
    expect(result.transaction.amount).toEqual('10.00');
  });
});
