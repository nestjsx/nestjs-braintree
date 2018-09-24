export interface BraintreeWebhookMethodTreeInterface {
  [k: string]: BraintreeMethodInterface[];
}

export interface BraintreeWebhookMethodInterface {
  provider: string;
  method: string;
}