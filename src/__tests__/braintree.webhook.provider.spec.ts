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
import { Injectable } from '@nestjs/common';
import { BraintreeWebhookHandler } from '../decorators';

describe('BraintreeWebhookController', async () => {

  // it('Decorator methods should be called from WebhookProvider', async () => {

  //   @Injectable()
  //   class SubscriptionProvider {
  //     public static called = false;

  //     @BraintreeSubscriptionCanceled()
  //     canceled(webhook) {
  //       //this is a work around the jest spyon reflect issue
  //       SubscriptionProvider.called = true;
  //     }

  //     @BraintreeSubscriptionExpired()
  //     expired(webhook) {
        
  //     }
  //   }

  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       ConfigModule.load(
  //         path.resolve(__dirname, '__stubs__', 'config', '*.ts'),
  //       ),
  //       BraintreeModule.forRootAsync({
  //         useFactory: async config => config.get('braintree'),
  //         inject: [ConfigService],
  //       }),
  //       BraintreeWebhookModule,
  //     ],
  //     providers: [SubscriptionProvider],
  //   }).compile();
    
  //   const gateway = braintree.connect({
  //     environment: braintree.Environment.Sandbox,
  //     merchantId: 'merchantId',
  //     publicKey: 'publicKey',
  //     privateKey: 'privateKey',
  //   });

  //   const braintreeProvider = module.get<BraintreeProvider>(BraintreeProvider);
  //   const webhookProvider = module.get<BraintreeWebhookProvider>(
  //     BraintreeWebhookProvider,
  //   );

  //   const webhookNotification = await braintreeProvider.parseWebhook(
  //     gateway.webhookTesting.sampleNotification(
  //       braintree.WebhookNotification.Kind.SubscriptionCanceled,
  //     ),
  //   );

  //   webhookProvider.handle(webhookNotification);

  //   expect(SubscriptionProvider.called).toBeTruthy();
  // });

  it('Make sure providers are still instanced with DI', async () => {

    @Injectable()
    class UselessProvider {
      public static called = false;
      callMe() {
        UselessProvider.called = true;
      }
    }

    @BraintreeWebhookHandler()
    class SubscriptionProvider {
      constructor(private readonly uselessProvider: UselessProvider) {
        this.uselessProvider = uselessProvider;
      }

      @BraintreeSubscriptionCanceled()
      canceled() {
        console.log('this', this);
        this.uselessProvider.callMe();
        return 'called';
      }

    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BraintreeModule.forRoot({
          environment: braintree.Environment.Sandbox,
          merchantId: 'merchantId',
          publicKey: 'publicKey',
          privateKey: 'privateKey',
        }),
        BraintreeWebhookModule,
      ],
      providers: [UselessProvider, SubscriptionProvider],
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

    //TODO resolve the BraintreeWebhookProvider::handle method to use the method's contructor 
    //issue is `call(this, method)` from the handle method uses BraintreeWebhookProvider as constructor
    expect(UselessProvider.called).toBeTruthy();
  });
});