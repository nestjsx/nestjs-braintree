import "reflect-metadata";
import { BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED } from "./../braintree.constants";

export default (): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED,
      true,
      descriptor.value
    );
    return descriptor;
  };
};
