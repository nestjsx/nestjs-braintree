import {Injectable, Inject} from '@nestjs/common';
import { BraintreeOptions, BraintreeWebhookPayloadInterface, BraintreeWebhookNotificationInterface } from './interfaces';
import * as braintree from 'braintree';
import { BRAINTREE_OPTIONS_PROVIDER } from './braintree.constants';

@Injectable()
export default class BraintreeProvider {

  protected readonly gateway;

  constructor(@Inject(BRAINTREE_OPTIONS_PROVIDER) options: BraintreeOptions) {
    this.gateway = braintree.connect(options);
  }

  async parseWebhook(payload: BraintreeWebhookPayloadInterface): Promise<BraintreeWebhookNotificationInterface> {
    return await this.gateway.webhookNotification.parse(payload.bt_signature, payload.bt_payload);
  }
}