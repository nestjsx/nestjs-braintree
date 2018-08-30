import {Injectable} from '@nestjs/common';
import { BraintreeOptions } from './interfaces/braintree.options.interface';
import * as braintree from 'braintree';

@Injectable()
export default class BraintreeProvider {

    protected readonly gateway;

    constructor(options: BraintreeOptions) {
        this.gateway = braintree.connect(options);
    }
}