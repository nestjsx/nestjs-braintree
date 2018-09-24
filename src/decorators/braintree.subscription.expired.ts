import 'reflect-metadata';
import {
  BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED,
  BRAINTREE_WEBHOOK_METHOD,
} from './../braintree.constants';

export default (): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      BRAINTREE_WEBHOOK_METHOD,
      BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED,
      descriptor.value,
    );
    return descriptor;
  };
};
