import 'reflect-metadata';
import { BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED } from './../braintree.constants';

export default (): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED,
      true,
      descriptor.value,
    );
    return descriptor;
  };
};
