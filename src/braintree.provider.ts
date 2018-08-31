import {Injectable, Inject} from '@nestjs/common';
import { BraintreeOptions } from './interfaces';
import * as braintree from 'braintree';
import { BRAINTREE_OPTIONS_PROVIDER } from './braintree.constants';

@Injectable()
export default class BraintreeProvider {

    protected readonly gateway;

    constructor(@Inject(BRAINTREE_OPTIONS_PROVIDER) options: BraintreeOptions) {
        this.gateway = braintree.connect(options);
    }

    parseWebhook(bt_signature, bt_payload) {
        console.log(braintree.WebhookNotification);
    }
}