import {Controller, Req, Logger, Post, HttpException} from '@nestjs/common';
import BraintreeProvider from './braintree.provider';
import BraintreeWebhookProvider from './braintree.webhook.provider';
import { BraintreeWebhookNotificationInterface } from './interfaces';

//TODO make path configurable
@Controller('braintree')
export default class BraintreeWebhookController {

  constructor(private readonly braintree: BraintreeProvider, private readonly webhookProvider: BraintreeWebhookProvider) {}

  @Post('webhook')
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