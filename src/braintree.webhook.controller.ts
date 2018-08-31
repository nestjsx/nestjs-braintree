import {Controller, HttpStatus, Req, Res} from '@nestjs/common';
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
    }
    console.log('webhook', webhook);

    //TODO call webhookProvider 
    //TODO again see braintree to see how to handle errors
    response.status(this.webhookProvider.handle(webhook) ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR);
  }
}