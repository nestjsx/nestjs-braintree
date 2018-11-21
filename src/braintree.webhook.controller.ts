import {Controller, Req, Logger, HttpException, RequestMethod} from '@nestjs/common';
import BraintreeProvider from './braintree.provider';
import BraintreeWebhookProvider from './braintree.webhook.provider';
import { BraintreeWebhookNotificationInterface } from './interfaces';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

@Controller()
export default class BraintreeWebhookController {

  constructor(
    private readonly braintree: BraintreeProvider, 
    private readonly webhookProvider: BraintreeWebhookProvider,
  ) {}

  public static forRoot(root: string = 'braintree', handle: string = 'webhook') {
    Reflect.defineMetadata(PATH_METADATA, root, BraintreeWebhookController);
    Reflect.defineMetadata(
      METHOD_METADATA, 
      RequestMethod.POST,
      Object.getOwnPropertyDescriptor(BraintreeWebhookController.prototype, 'handle').value,
    );
    Reflect.defineMetadata(
      PATH_METADATA,
      handle,
      Object.getOwnPropertyDescriptor(BraintreeWebhookController.prototype, 'handle').value,
    );
    return BraintreeWebhookController;
  }

  async handle(@Req() request) {
    let webhook: BraintreeWebhookNotificationInterface;
		try {
      webhook = await this.braintree.parseWebhook({
        bt_signature: request.body.bt_signature,
        bt_payload: request.body.bt_payload,
      });
      await this.webhookProvider.handle(webhook);
    } catch (e) {
      //TODO log something? see braintree for correct proceedure on signature failure
      Logger.warn('Failed to process webhook', this.constructor.name);
      throw new HttpException('Failed', 500);
    }
  }
}