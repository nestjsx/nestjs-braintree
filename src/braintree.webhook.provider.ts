import {Injectable, Provider, Logger} from '@nestjs/common';
import { 
  BraintreeWebhookNotificationInterface,
  BraintreeWebhookMethodInterface,
  BraintreeWebhookMethodTreeInterface,
} from './interfaces';
import { 
  BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED, 
  BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED,
} from './braintree.constants';

@Injectable()
export default class BraintreeWebhookProvider {

   private providers: {[k: string]: Provider} = {};
   private methods: BraintreeWebhookMethodTreeInterface = {
     [BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED]: [],
     [BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED]: [],
   };

  handle(webhook: BraintreeWebhookNotificationInterface): void {
  
    if (Object.keys(this.methods).includes(webhook.kind)) {
      this.methods[webhook.kind].forEach((methodProto: BraintreeWebhookMethodInterface) => {
        //TODO add try catch maybe?
        //TODO resolve promises? 
        this.providers[methodProto.provider][methodProto.method](webhook);
      });
    }
  }

  addProvider(provider: Provider) {
    this.providers[provider.constructor.name] = provider;
    Logger.log(`Added provider [${provider.constructor.name}]`, 'BraintreeWebhookProvider');
  }

  addMethod(hook: string, method: string, provider: string) {
    this.methods[hook] = [
      ...this.methods[hook],
      {
        provider,
        method,
      },
    ];
    Logger.log(`Added method [${method}]`, 'BraintreeWebhookProvider');
  }

}