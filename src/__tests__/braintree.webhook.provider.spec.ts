import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import { ConfigModule, ConfigService } from 'nestjs-config';
import {
  BraintreeModule,
  BraintreeWebhookModule,
  BraintreeSubscriptionCanceled,
  BraintreeSubscriptionExpired,
  BraintreeProvider,
} from './..';
import * as braintree from 'braintree';
import BraintreeWebhookProvider from '../braintree.webhook.provider';

describe('BraintreeWebhookController', async () => {

  it('Decorator methods should be called from WebhookProvider', async () => {

    class SubscriptionProvider {
      public static called = false;

      @BraintreeSubscriptionCanceled()
      canceled(webhook) {
        //this is a work around the jest spyon reflect issue
        SubscriptionProvider.called = true;
      }

      @BraintreeSubscriptionExpired()
      expired(webhook) {
        
      }
    }

    const module: TestingModule = await Test.createTestingModule({
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
    
    const gateway = braintree.connect({
      environment: braintree.Environment.Sandbox,
      merchantId: 'merchantId',
      publicKey: 'publicKey',
      privateKey: 'privateKey',
    });

    const braintreeProvider = module.get<BraintreeProvider>(BraintreeProvider);
    const webhookProvider = module.get<BraintreeWebhookProvider>(
      BraintreeWebhookProvider,
    );

    const webhookNotification = await braintreeProvider.parseWebhook(
      gateway.webhookTesting.sampleNotification(
        braintree.WebhookNotification.Kind.SubscriptionCanceled,
      ),
    );

    webhookProvider.handle(webhookNotification);

    expect(SubscriptionProvider.called).toBeTruthy();
  });
});