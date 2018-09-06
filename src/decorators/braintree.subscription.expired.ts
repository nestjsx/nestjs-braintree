import 'reflect-metadata';
import { BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED } from './../braintree.constants';

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
      BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED,
      true,
      descriptor.value,
    );
    return descriptor;
  };
};
