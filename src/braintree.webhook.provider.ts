import {Injectable, Provider} from '@nestjs/common';
import {BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED, BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED} from './braintree.constants';

@Injectable()
export default class BraintreeWebhookProvider {

    constructor(private readonly providers: {[key: string]: Provider}, private readonly methods: {[key: string]: {
        provider: string,
        method: string,
    }[]}) {
        console.log('providers', providers);
        console.log('methods', methods);
    }

    call() {
        //TODO call provider methods with decorators

    }
}