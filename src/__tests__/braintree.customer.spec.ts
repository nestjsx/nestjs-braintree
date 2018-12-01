import { TestingModule, Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { BraintreeModule, BraintreeProvider } from './../../src';
import { BraintreeCustomerInterface } from '../interfaces';

describe('Braintree customer methods', () => {
  let module: TestingModule;
  let provider: BraintreeProvider;
  let customer: BraintreeCustomerInterface;

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

  it('Can create', async () => {
    const response = await provider.createCustomer({

    });

    customer = response.customer;

    expect(response).toHaveProperty('customer');
    expect(response).toHaveProperty('success');
  });

  // TODO figure out why this throws a 403
  // it('Can update', async () => {
  //   const response = await provider.updateCustomer(customer.id, {
  //     ...customer,
  //     firstName: 'jeff',
  //   });

  //   expect(response).toHaveProperty('customer');
  //   expect(response).toHaveProperty('success');
  //   expect(response.customer.firstName).toBe('jeff');
  // });

  it('Can delete', async () => {
    const response = await provider.deleteCustomer(customer.id);

    expect(response).toEqual({});
  });
});
