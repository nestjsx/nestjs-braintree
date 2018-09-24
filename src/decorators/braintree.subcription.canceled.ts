import 'reflect-metadata';
import {
  BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED,
  BRAINTREE_WEBHOOK_METHOD,
} from './../braintree.constants';

export default (): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      return originalMethod.apply(this, args);
    };

    Reflect.defineMetadata(
      BRAINTREE_WEBHOOK_METHOD,
      BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED,
      descriptor.value,
    );
    return descriptor;
  };
};
