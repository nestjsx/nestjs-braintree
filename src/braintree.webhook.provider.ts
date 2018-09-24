import {Injectable, Provider} from '@nestjs/common';
import { 
  BraintreeWebhookNotificationInterface,
} from './interfaces';
import { BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED, BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED } from './braintree.constants';

@Injectable()
export default class BraintreeWebhookProvider {

   private providers: {[k: string]: Provider} = {};
   private methods: {[k: string]: {
     provider: string,
     method: string,
   }[]} = {
     [BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED]: [],
     [BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED]: [],
   };

  handle(webhook: BraintreeWebhookNotificationInterface): boolean {
    
  console.log('providers', this.providers);
    

    if (Object.keys(this.methods).includes(webhook.kind)) {
      this.methods[webhook.kind].forEach(methodProto => {
        console.log('methodProto', methodProto);
        console.log('result', this.providers[methodProto.provider][methodProto.method](webhook));
      });
    }

    return true;
  }

  addProvider(provider: Provider) {
    console.log('addProvider', provider);
    this.providers[provider.constructor.name] = provider;
    console.log('this.providers', this.providers);
  }

  addMethod(hook: string, method: string, provider: string) {
    this.methods[hook] = [
      ...this.methods[hook],
      {
        provider,
        method,
      },
    ];
  }

}