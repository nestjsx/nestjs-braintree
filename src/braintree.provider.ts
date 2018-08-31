import {Injectable, Inject} from '@nestjs/common';
import { BraintreeOptions, BraintreeWebhookPayloadInterface } from './interfaces';
import * as braintree from 'braintree';
import { BRAINTREE_OPTIONS_PROVIDER } from './braintree.constants';

@Injectable()
export default class BraintreeProvider {

  protected readonly gateway;

  constructor(@Inject(BRAINTREE_OPTIONS_PROVIDER) options: BraintreeOptions) {
    this.gateway = braintree.connect(options);
  }

  //TODO return Promise<WebnotificationType> or whatever
  async parseWebhook(payload: BraintreeWebhookPayloadInterface) {
    return await this.gateway.webhookNotification.parse(payload.bt_signature, payload.bt_payload);
  }
}