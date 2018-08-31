import {Injectable} from '@nestjs/common';
import { BraintreeOptions } from './interfaces';
import * as braintree from 'braintree';

@Injectable()
export default class BraintreeProvider {

    protected readonly gateway;

    constructor(options: BraintreeOptions) {
        this.gateway = braintree.connect(options);
    }

    parseWebhook(bt_signature, bt_payload) {
        console.log(braintree.WebhookNotification);
    }
}