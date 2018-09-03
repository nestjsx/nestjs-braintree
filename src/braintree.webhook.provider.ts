import {Injectable, Inject} from '@nestjs/common';
import {
  BraintreeWebhookMethodTreeInterface, 
  BraintreeWebhookNotificationInterface,
} from './interfaces';
import { BRAINTREE_WEBHOOK_PROVIDER_HANDLERS } from './braintree.constants';

@Injectable()
export default class BraintreeWebhookProvider {

  constructor(
    @Inject(BRAINTREE_WEBHOOK_PROVIDER_HANDLERS) private readonly methods: BraintreeWebhookMethodTreeInterface,
  ) {}

  handle(webhook: BraintreeWebhookNotificationInterface): boolean {
    
    if (Object.keys(this.methods).includes(webhook.kind)) {
      this.methods[webhook.kind].forEach((method: Function) => {
        //TODO should I use Reflect to see what the injection is? Should I add a @Webhook() decorator? 
        console.log('method', method['prototype']);
        method.call(this, webhook);
      });
    }

    return true;
  }
}