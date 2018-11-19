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
  let transactionId: string;

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

    transactionId = result.transaction.id;

    expect(result.success).toBeTruthy();
    expect(result).toHaveProperty('transaction');
    expect(result.transaction).toHaveProperty('amount');
    expect(result.transaction.amount).toEqual('10.00');
  });

  it('Find Transaction', async () => {
    const transaction = await provider.find(transactionId);

    expect(transaction).toHaveProperty('id');
    expect(transaction).toHaveProperty('status');
    expect(transaction).toHaveProperty('type');
    expect(transaction).toHaveProperty('amount');
    expect(transaction).toHaveProperty('createdAt');
    expect(transaction).toHaveProperty('updatedAt');
  });

  //it('Refund Transaction', async () => {
    //const refundResult = await provider.refund(transactionId);

    //console.log('refund', refundResult);
  //});
});
