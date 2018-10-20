import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { BraintreeWebhookModule } from "../..";
import { ConfigService, ConfigModule } from "nestjs-config";
import BraintreeModule from "../../braintree.module";
import * as path from 'path';
import * as request from 'supertest';
import * as braintree from 'braintree';
import { BraintreeWebhookHandler, BraintreeSubscriptionCanceled, BraintreeSubscriptionChargedSuccessfully } from "../../decorators";

describe('BraintreeWebhookController', async () => {
  let app: INestApplication;
  let module: TestingModule;

  const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'merchantId',
    publicKey: 'publicKey',
    privateKey: 'privateKey',
  });

  beforeAll(async () => {

    @BraintreeWebhookHandler()
    class TestProvider {
      @BraintreeSubscriptionCanceled()
      canceled() {
        return true;
      }

      @BraintreeSubscriptionChargedSuccessfully()
      callMe() {
        throw new Error('hello I am errors');
      }
    }

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '../', '__stubs__', 'config', '*.ts'),
        ),
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

    app = module.createNestApplication();
    await app.init();
  });

  it('/braintree/webhook (POST) Canceled', async () => {
    const webhook = gateway.webhookTesting.sampleNotification(
      braintree.WebhookNotification.Kind.SubscriptionCanceled,
    );
    
    return await request(app.getHttpServer())
      .post('/braintree/webhook')
      .set('Content-Type', 'application/json')
      .send(webhook)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});