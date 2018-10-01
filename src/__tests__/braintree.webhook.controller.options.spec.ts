import {Test, TestingModule} from '@nestjs/testing';
import BraintreeModule from '../braintree.module';
import BraintreeWebhookModule from '../braintree.webhook.module';
import * as braintree from 'braintree';
import { BraintreeWebhookController } from '..';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';

describe('BraintreeWebhookController', () => {
  it('Should instance with forRoot', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BraintreeModule.forRoot({
          environment: braintree.Environment.Sandbox,
          merchantId: 'merchantId',
          publicKey: 'publicKey',
          privateKey: 'privateKey',
        }),
        BraintreeWebhookModule.forRoot({
          root: 'testing',
          handle: 'this',
        }),
      ],
    }).compile();
    const controller = module.get(BraintreeWebhookController);

    expect(controller).toBeInstanceOf(BraintreeWebhookController);
    expect(Reflect.getMetadata(PATH_METADATA, BraintreeWebhookController)).toBe('testing');
    expect(Reflect.getMetadata(METHOD_METADATA, Object.getOwnPropertyDescriptor(BraintreeWebhookController.prototype, 'handle').value)).toBe(RequestMethod.POST);
    expect(Reflect.getMetadata(PATH_METADATA, Object.getOwnPropertyDescriptor(BraintreeWebhookController.prototype, 'handle').value)).toBe('this');
  });
});