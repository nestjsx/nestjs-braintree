import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { BraintreeWebhookModule } from "../..";
import { ConfigService, ConfigModule } from "nestjs-config";
import BraintreeModule from "../../braintree.module";
import * as path from 'path';
import * as request from 'supertest';
import * as braintree from 'braintree';

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
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, '../', '__stubs__', 'config', '*.ts'),
        ),
        BraintreeModule.forRootAsync({
          useFactory: async config => config.get('braintree'),
          inject: [ConfigService],
        }),
        BraintreeWebhookModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST webhook', () => {
    const webhook = gateway.webhookTesting.sampleNotification(
      braintree.WebhookNotification.Kind.SubscriptionCanceled,
    );
    return request(app.getHttpServer())
      .post('/braintree/webhook')
      .send(webhook)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});