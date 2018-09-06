import 'reflect-metadata';
import { BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED } from './../braintree.constants';

export default (): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log('this', this);
      return originalMethod.apply(this, args);
    };

    Reflect.defineMetadata(
      BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED,
      true,
      descriptor.value,
    );
    return descriptor;
  };
};
