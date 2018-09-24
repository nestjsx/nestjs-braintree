export interface BraintreeWebhookMethodInterface {
  provider: string;
  method: string;
}

export interface BraintreeWebhookMethodTreeInterface {
  [k: string]: BraintreeWebhookMethodInterface[];
}
