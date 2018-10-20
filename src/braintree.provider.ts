import {Injectable, Inject} from '@nestjs/common';
import { 
  BraintreeOptions, 
  BraintreeWebhookPayloadInterface, 
  BraintreeWebhookNotificationInterface, 
  BraintreeTransactionInterface,
  BraintreeTransactionResultInterface,
  BraintreeSubscriptionInterface,
  BraintreeSubscriptionResultInterface,
} from './interfaces';
import * as braintree from 'braintree';
import { BRAINTREE_OPTIONS_PROVIDER } from './braintree.constants';

@Injectable()
export default class BraintreeProvider {

  protected readonly gateway;

  constructor(@Inject(BRAINTREE_OPTIONS_PROVIDER) options: BraintreeOptions) {
    this.gateway = braintree.connect(options);
  }

  async parseWebhook(payload: BraintreeWebhookPayloadInterface): Promise<BraintreeWebhookNotificationInterface> {
    return await this.gateway.webhookNotification.parse(payload.bt_signature, payload.bt_payload);
  }

  async sale(transaction: BraintreeTransactionInterface): Promise<BraintreeTransactionResultInterface> {

    return await this.gateway.transaction.sale(transaction);
  }

  async refund(transactionId: string, amount?: string, orderId?: string): Promise<BraintreeTransactionResultInterface> {
    return await this.gateway.transaction.refund(transactionId, amount, orderId);
  }

  async find(transactionId: string): Promise<BraintreeTransactionResultInterface> {
    return await this.gateway.transaction.find(transactionId);
  }

  async createSubscription(subscription: BraintreeSubscriptionInterface): Promise<BraintreeSubscriptionResultInterface> {
    return await this.gateway.subscription.create(subscription);
  }

  async cancelSubscription(subscriptionId: string): Promise<BraintreeSubscriptionResultInterface> {
    return await this.gateway.subscription.cancel(subscriptionId);
  }

  async findSubscription(subscriptionId: string): Promise<BraintreeSubscriptionResultInterface> {
    return await this.gateway.subscription.find(subscriptionId);
  }

  async updateSubscription(subscriptionId: string, subscription: BraintreeSubscriptionInterface): Promise<BraintreeSubscriptionResultInterface> {
    return await this.gateway.subscription.update(subscriptionId, subscription);
  }

  // TODO implement confusing looking search plans
  // https://developers.braintreepayments.com/reference/request/subscription/search/node#search-results
}