import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import { ConfigModule, ConfigService } from 'nestjs-config';
import {
  BraintreeModule,
  BraintreeWebhookController,
  BraintreeWebhookModule,
  BraintreeSubscriptionCanceled,
  BraintreeSubscriptionExpired,
} from './..';
import BraintreeProvider from '../braintree.provider';
import BraintreeWebhookProvider from '../braintree.webhook.provider';

class SubscriptionProvider {
  @BraintreeSubscriptionCanceled()
  canceled() {}

  @BraintreeSubscriptionExpired()
  expired() {}
}

describe('BraintreeWebhookController', async () => {
  let module: TestingModule;

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
        BraintreeWebhookModule,
      ],
      providers: [SubscriptionProvider],
    }).compile();
  });

  it('Webhook controller must instance', () => {
    const controller = module.get<BraintreeWebhookController>(
      BraintreeWebhookController,
    );

    expect(controller).toBeInstanceOf(BraintreeWebhookController);
  });

  it('webhookmodule should instance subscription provider', () => {
    const provider = module.get<SubscriptionProvider>(SubscriptionProvider);

    expect(provider).toBeInstanceOf(SubscriptionProvider);
  });

  it('wehook controller instances', () => {
    const braintreeWebhookController = module.get<BraintreeWebhookController>(
      BraintreeWebhookController,
    );

    expect(braintreeWebhookController.braintree).toBeInstanceOf(
      BraintreeProvider,
    );
    expect(braintreeWebhookController.webhookProvider).toBeInstanceOf(
      BraintreeWebhookProvider,
    );
  });
});
