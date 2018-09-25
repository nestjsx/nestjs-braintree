import {Test, TestingModule} from '@nestjs/testing';
import {BraintreeModule, BraintreeWebhookModule} from './../';
import * as braintree from 'braintree';
import { 
  BraintreeWebhookHandler, 
  BraintreeSubscriptionCanceled, 
  BraintreeSubscriptionExpired, 
  BraintreeSubscriptionChargedSuccessfully, 
  BraintreeSubscriptionChargedUnSuccessfully, 
  BraintreeSubscriptionTrialEnded, 
  BraintreeSubscriptionWentPastDue, 
  BraintreeSubscriptionWentActive,
} from '../decorators';
import BraintreeProvider from '../braintree.provider';
import BraintreeWebhookProvider from '../braintree.webhook.provider';

describe('Braintree Webhooks', async () => {
  let module: TestingModule;

  @BraintreeWebhookHandler()
  class TestProvider {

    public static called = null;

    @BraintreeSubscriptionCanceled()
    canceled() {
      TestProvider.called = 'canceled';
    }

    @BraintreeSubscriptionExpired()
    expired() {
      TestProvider.called = 'expired';
    }

    @BraintreeSubscriptionChargedSuccessfully()
    chargedSuccessFully() {
      TestProvider.called = 'chargedSuccessfully';
    }

    @BraintreeSubscriptionChargedUnSuccessfully()
    chargedUnsuccessfully() {
      TestProvider.called = 'chargedUnsuccessfully';
    }

    @BraintreeSubscriptionTrialEnded()
    trialEnded() {
      TestProvider.called = 'trialEnded';
    }

    @BraintreeSubscriptionWentPastDue()
    wentPastDue() {
      TestProvider.called = 'wentPastDue';
    }

    @BraintreeSubscriptionWentActive()
    wentActive() {
      TestProvider.called = 'wentActive';
    }
  }

  const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'merchantId',
    publicKey: 'publicKey',
    privateKey: 'privateKey',
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        BraintreeModule.forRoot({
          environment: braintree.Environment.Sandbox,
          merchantId: 'merchantId',
          publicKey: 'publicKey',
          privateKey: 'privateKey',
        }),
        BraintreeWebhookModule,
      ],
      providers: [TestProvider],
    }).compile();

    TestProvider.called = null;
  });

  it('Canceled', async () => {

    const braintreeProvider = module.get(BraintreeProvider);
    const braintreeWebhookProvider = module.get(BraintreeWebhookProvider);

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionCanceled,
      ),
    );

    braintreeWebhookProvider.handle(webhookNotification);

    expect(TestProvider.called).toBe('canceled');

  });

  it('Expired', async () => {

    const braintreeProvider = module.get(BraintreeProvider);
    const braintreeWebhookProvider = module.get(BraintreeWebhookProvider);

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionExpired,
      ),
    );

    braintreeWebhookProvider.handle(webhookNotification);

    expect(TestProvider.called).toBe('expired');

  });

  it('ChargedSuccessfully', async () => {

    const braintreeProvider = module.get(BraintreeProvider);
    const braintreeWebhookProvider = module.get(BraintreeWebhookProvider);

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionChargedSuccessfully,
      ),
    );

    braintreeWebhookProvider.handle(webhookNotification);

    expect(TestProvider.called).toBe('chargedSuccessfully');

  });

  it('ChargedUnSuccessfully', async () => {

    const braintreeProvider = module.get(BraintreeProvider);
    const braintreeWebhookProvider = module.get(BraintreeWebhookProvider);

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionChargedUnsuccessfully,
      ),
    );

    braintreeWebhookProvider.handle(webhookNotification);

    expect(TestProvider.called).toBe('chargedUnsuccessfully');

  });

  it('TrialEnded', async () => {

    const braintreeProvider = module.get(BraintreeProvider);
    const braintreeWebhookProvider = module.get(BraintreeWebhookProvider);

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionTrialEnded,
      ),
    );

    braintreeWebhookProvider.handle(webhookNotification);

    expect(TestProvider.called).toBe('trialEnded');

  });

  it('wentPastDue', async () => {

    const braintreeProvider = module.get(BraintreeProvider);
    const braintreeWebhookProvider = module.get(BraintreeWebhookProvider);

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionWentPastDue,
      ),
    );

    braintreeWebhookProvider.handle(webhookNotification);

    expect(TestProvider.called).toBe('wentPastDue');

  });

  it('wentActive', async () => {

    const braintreeProvider = module.get(BraintreeProvider);
    const braintreeWebhookProvider = module.get(BraintreeWebhookProvider);

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionWentActive,
      ),
    );

    braintreeWebhookProvider.handle(webhookNotification);

    expect(TestProvider.called).toBe('wentActive');

  });
});