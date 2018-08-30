export interface BraintreeOptions {
  environment: string;
  merchantId: string;
  publicKey: string;
  privateKey: string;
}

export interface BraintreeAsyncOptions {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<BraintreeOptions>;
}
