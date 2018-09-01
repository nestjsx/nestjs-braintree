import {Injectable, Provider} from '@nestjs/common';
import {
    BraintreeWebhookMethodTreeInterface, 
    BraintreeWebhookNotificationInterface,
    BraintreeWebhookMethodInterface,
} from './interfaces';

@Injectable()
export default class BraintreeWebhookProvider {

    constructor(
        private readonly providers: {[key: string]: Provider}, 
        private readonly methods: BraintreeWebhookMethodTreeInterface,
    ) {
        
    }

    handle(webhook: BraintreeWebhookNotificationInterface): boolean {
        //TODO call provider methods with decorators depending on webhook type

        if (Object.keys(this.methods).includes(webhook.kind)) {
            this.methods[webhook.kind].forEach((methodProto: BraintreeWebhookMethodInterface) => {
                //TODO should I use Reflect to see what the injection is? Should I add a @Webhook() decorator? 
                this.providers[methodProto.provider][methodProto.method](webhook);
            });
        }

        return true;
    }
}