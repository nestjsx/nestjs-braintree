import {Controller, HttpStatus, Req, Res} from '@nestjs/common';
import BraintreeProvider from './braintree.provider';
import BraintreeWebhookProvider from './braintree.webhook.provider';

@Controller('')
export default class BraintreeWebhookController {

    constructor(private readonly braintree: BraintreeProvider, private readonly webhookProvider: BraintreeWebhookProvider) {}

    handle(@Req() request, @Res() response) {
        //TODO parse the payload from braintree
        //TODO get the type of webhook it is 
        //TODO call relative function for that type of webhook
        //TODO return response code

        const webhook = this.braintree.parseWebhook(request.body.bt_signature, request.body.bt_payload);
        console.log('webhook', webhook);
    }

    protected handleSubscriptionCanceled(webhook, response) {
        
        response.status(HttpStatus.OK);
    }
}