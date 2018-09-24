import { BRAINTREE_WEBHOOK_PROVIDER } from './../braintree.constants';

export const BraintreeWebhookHandler = (): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(BRAINTREE_WEBHOOK_PROVIDER, true, target);
  };
};
