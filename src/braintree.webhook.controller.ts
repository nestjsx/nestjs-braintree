import {Controller, HttpStatus, Req, Res, Logger} from '@nestjs/common';
import BraintreeProvider from './braintree.provider';
import BraintreeWebhookProvider from './braintree.webhook.provider';

@Controller('')
export default class BraintreeWebhookController {

  constructor(private readonly braintree: BraintreeProvider, private readonly webhookProvider: BraintreeWebhookProvider) {}

  async handle(@Req() request, @Res() response) {
    //TODO parse the payload from braintree
		//TODO get the type of webhook it is 
		//TODO call relative function for that type of webhook
    //TODO return response code
    
    let webhook; //TODO add webhook type

		try {
       webhook = await this.braintree.parseWebhook({
        bt_signature: request.body.bt_signature, 
        bt_payload: request.body.bt_payload,
      });
    } catch (e) {
      //TODO log something? see braintree for correct proceedure on signature failure
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
      Logger.warn('Failed to process webhook', this.constructor.name);
    }
    console.log('webhook', webhook);

    //TODO call webhookProvider 
    //TODO again see braintree to see how to handle errors
    this.webhookProvider.handle(webhook);

    response.status(HttpStatus.OK);
  }
}