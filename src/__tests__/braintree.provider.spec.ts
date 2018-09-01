import { TestingModule, Test } from '@nestjs/testing';
import { BraintreeModule, BraintreeProvider } from './..';
import * as braintree from 'braintree';

describe('BraintreeProvider', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        BraintreeModule.forRoot({
          environment: braintree.Environment.Sandbox,
          merchantId: 'merchantId',
          publicKey: 'publicKey',
          privateKey: 'privateKey',
        }),
      ],
    }).compile();
  });

  it('WebhookProvider shoud return BraintreeWebhookNotificationInterface with sample payload', async () => {
    const gateway = braintree.connect({
      environment: braintree.Environment.Sandbox,
      merchantId: 'merchantId',
      publicKey: 'publicKey',
      privateKey: 'privateKey',
    });
    const braintreeProvider = module.get<BraintreeProvider>(BraintreeProvider);

    const result = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionCanceled,
      ),
    );

    expect(result).toHaveProperty('kind');
    expect(result).toHaveProperty('subject');
    expect(result).toHaveProperty('timestamp');
  });
});
