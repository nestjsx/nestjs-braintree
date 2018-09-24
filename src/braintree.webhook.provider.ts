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

  async handle(webhook: BraintreeWebhookNotificationInterface): Promise<void> {
  
    if (Object.keys(this.methods).includes(webhook.kind)) {
      this.methods[webhook.kind].forEach(async (methodProto: BraintreeWebhookMethodInterface) => {
        try {
          await this.providers[methodProto.provider][methodProto.method](webhook);
        } catch(e) {
          Logger.error(`There was an error calling ${methodProto.method} from ${methodProto.provider}`, e.stack, 'BraintreeWebhookProvider');
        }
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