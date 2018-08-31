import {Injectable, Provider} from '@nestjs/common';
import {BRAINTREE_WEBHOOK_SUBSCRIPTION_CANCELED, BRAINTREE_WEBHOOK_SUBSCRIPTION_EXPIRED} from './braintree.constants';
import {
    BraintreeWebhookMethodTreeInterface,
} from './interfaces';

@Injectable()
export default class BraintreeWebhookProvider {

    constructor(
        private readonly providers: {[key: string]: Provider}, 
        private readonly methods: BraintreeWebhookMethodTreeInterface,
    ) {
        
    }

    //TODO add webhook type to param
    handle(webhook): boolean {
        //TODO call provider methods with decorators depending on webhook type

        

        return true;
    }
}