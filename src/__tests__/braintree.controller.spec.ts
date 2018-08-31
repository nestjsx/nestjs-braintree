import { Test, TestingModule } from "@nestjs/testing";
import * as path from "path";
import { ConfigModule, ConfigService } from "nestjs-config";
import {
  BraintreeModule,
  BraintreeWebhookController,
  BraintreeWebhookModule
} from "./..";

describe("BraintreeWebhookController", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          path.resolve(__dirname, "__stubs__", "config", "*.ts")
        ),
        BraintreeModule.registerAsync({
          useFactory: async config => config.get("braintree"),
          inject: [ConfigService]
        }),
        BraintreeWebhookModule
      ]
    }).compile();
  });

  it("Webhook controller must instance", () => {
    const controller = module.get<BraintreeWebhookController>(
      BraintreeWebhookController
    );

    expect(controller).toBeInstanceOf(BraintreeWebhookController);
  });
});
