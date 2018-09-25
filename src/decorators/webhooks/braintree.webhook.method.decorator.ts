import 'reflect-metadata';
import {
  BRAINTREE_WEBHOOK_METHOD,
} from './../../braintree.constants';

export const BraintreeWebhookMethodDecorator = (method) => (): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      BRAINTREE_WEBHOOK_METHOD,
      method,
      descriptor.value,
    );
    return descriptor;
  };
};
