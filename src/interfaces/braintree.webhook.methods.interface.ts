export interface BraintreeWebhookMethodInterface {
    provider: string,
    method: string,
};

export interface BraintreeWebhookMethodTreeInterface {
    [key: string]: BraintreeWebhookMethodInterface[];
};