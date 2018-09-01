export interface BraintreeWebhookNotificationInterface {
  timestamp: string;
  kind: string;
  subject: object; //TODO add different types to what could be returned
}
