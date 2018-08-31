import { Inject } from '@nestjs/common';
import BraintreeProvider from './../braintree.provider';

const InjectBraintreeProvider = () => Inject(BraintreeProvider);

export default InjectBraintreeProvider;
