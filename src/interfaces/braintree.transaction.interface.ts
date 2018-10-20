import {
  CreditCard,
  DisbursementDetails,
  PayPalAccount,
  ApplePayCard,
  AndroidPayCard,
  CoinbaseAccount,
  VisaCheckoutCard,
  MasterpassCard,
  SamsungPayCard,
} from 'braintree';

export interface BraintreeTransactionOptionsInterface {
  submitForSettlement?: boolean;
  addBillingAddressToPaymentMethod?: boolean;
  holdInEscrow?: boolean;
  paypal?: BraintreePayPalOptionsInterface;
  skipAdvancedFraudChecking?: boolean;
  skipAvs?: boolean;
  skipCvv?: boolean;
  storeInVault?: boolean;
  storeInVaultOnSuccess?: boolean;
  storeShippingAddressInVault?: boolean;
  treeDSecure?: {
    required: boolean;
  };
  venmo?: {
    profileId: string;
  };
}

export interface BraintreePayPalOptionsInterface {
  customField: string;
  description: string;
}

export interface BraintreeDescriptorInterface {
  name?: string;
  phone?: string;
  url?: string;
}

export interface BraintreeAddressInterface {
  company?: string;
  countryName?: string;
  countryCodeAlpha2?: string;
  countryCodeAlpha3?: string;
  countryCodeNumeric?: string;
  extendedAddress?: string;
  firstName?: string;
  lastName?: string;
  locality?: string;
  postalCode?: string;
  region?: string;
  streetAddress?: string;
}

export interface BraintreeCustomerInterface {
  id?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  fax?: string;
  website?: string;
  email?: string;
}

export interface BraintreeTransactionInterface {
  payment_method_nonce: string;
  amount: string;
  billing?: BraintreeAddressInterface;
  billingAddressId?: string;
  channel?: string;
  customFields?: { [s: string]: string };
  customerId?: string;
  deviceSessionId?: string;
  discountAmount?: string;
  merchantAccountId?: string;
  options?: BraintreeTransactionInterface;
  orderId?: string;
  paymentMethodToken?: string;
  purchaseOrderNumber?: string;
  serviceFeeAmount?: string;
  sharedBillingAddress?: string;
  sharedCustomerId?: string;
  sharedPaymentMethodNonce?: string;
  sharedPaymentMethodToken?: string;
  sharedSippingAddressId?: string;
  shipping?: BraintreeAddressInterface;
  shippingAddressId?: string;
  shippingAmount?: string;
  shippingFromPostalCode?: string;
  taxAmount?: string;
  taxExempt?: boolean;
  transactionSource?: 'recurring' | 'unscheduled' | 'recurring_first' | 'moto';
  descriptor?: BraintreeDescriptorInterface;
}

export interface BraintreeTransactionResultInterface {
  success: boolean;
  transaction: BraintreeTransaction;
}

export interface BraintreeSubscriptionOptionsInterface {
  doNotInheritAddOnsOrDiscounts?: boolean;
  paypal?: {
    description?: string;
  };
  startImmediately?: boolean;
}

export interface BraintreeSubscriptionInterface {
  paymentMethodToken: string;
  planId: string;
  price?: string;
  paymentMethodNonce?: string;
  options?: BraintreeSubscriptionOptionsInterface;
  trialDuration?: number;
  trialDurationUnit?: 'day' | 'month';
  trialPeriod?: boolean;
  numberOfBillingCycles?: number;
  neverExpires?: boolean;
  merchantAccountId?: string;
  id?: string;
  firstBillingDate?: Date;
  discounts?: {
    add?: {
      amount?: string;
      inheritFromId: string;
      neverExpires?: boolean;
      numberOfBillingCycles?: string;
      quantity?: number;
    }[];
    remove: string[];
    update: {
      amount?: string;
      existingId: string;
      neverExpires?: boolean;
      numberOfBillingCycles?: number;
      quantity?: number;
    }[];
  };
  descriptor?: BraintreeDescriptorInterface;
}

export interface BraintreeTransaction {
  id: string;
  status: string;
  type: string;
  currencyIsoCode: string;
  amount: string;
  merchantAccountId: string;
  subMerchantAccountId: string | null;
  masterMerchantAccountId: string | null;
  orderId: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    email: string | null;
    website: string | null;
    phone: string | null;
    fax: string | null;
  };
  billing: {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    streetAddress: string | null;
    extendedAddress: string | null;
    locality: string | null;
    region: string | null;
    postalCode: string | null;
    countryName: string | null;
    countryCodeAlpha2: string | null;
    countryCodeAlpha3: string | null;
    countryCodeNumeric: string | null;
  };
  refundId: string | null;
  refundIds: string[];
  refundedTransactionId: string;
  partialSettlementTransactionIds: string[];
  authorizedTransactionId: string | null;
  settlementBatchId: string | null;
  shipping: {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    streetAddress: string | null;
    extendedAddress: string | null;
    locality: string | null;
    region: string | null;
    postalCode: string | null;
    countryName: string | null;
    countryCodeAlpha2: string | null;
    countryCodeAlpha3: string | null;
    countryCodeNumeric: string | null;
  };
  customFields: string | object;
  avsErrorResponseCode: string | null;
  avsPostalCodeResponseCode: string;
  avsStreetAddressResponseCode: string;
  cvvResponseCode: string;
  gatewayRejectionReason: null | string;
  processorAuthorizationCode: string;
  processorResponseCode: string;
  processorResponseText: string;
  additionalProcessorResponse: null | string;
  voiceReferralNumber: null | string;
  purchaseOrderNumber: null | string;
  taxAmount: null | string;
  taxExempt: boolean;
  creditCard: CreditCard;
  statusHistory: object;
  planId: null | string;
  subscriptionId: null | string;
  subscription: {
    billingPeriodEndDate: null | string;
    billingPeriodStartDate: null | string;
  };
  addOns: [];
  discounts: [];
  descriptor: {
    name: string | null;
    phone: string | null;
    url: string | null;
  };
  recurring: boolean;
  channel: null | string;
  serviceFeeAmount: null | string;
  escrowStatus: null | string;
  disbursementDetails: DisbursementDetails;
  disputes: [];
  authorizationAjustments: [];
  paymentInstrumentType: string;
  processorSettlementResponseCode: string;
  processorSettlementResponseText: string;
  threeDSecureInfo: null | string;
  shipsFromPostalCode: null | string;
  shippingAmount: null | string;
  discountAmount: null | string;
  networkTransactionId: string;
  refundGlobalIds: [];
  refundedTransactionGlobalId: null | string;
  partialSettlementTransactionGlobalIds: [];
  authorizedTransactionGlobalId: null | string;
  globalId: string;
  processorResponseType: string;
  paypalAccount: PayPalAccount;
  coinbaseAccount: CoinbaseAccount;
  applePayCard: ApplePayCard;
  androidPayCard: AndroidPayCard;
  visaCheckoutCard: VisaCheckoutCard;
  masterpassCard: MasterpassCard;
  samsungPayCard: SamsungPayCard;
}

export interface BraintreeSubscriptionResultInterface {
  transaction: BraintreeTransaction[];
  subscription: {}; // TODO add result types
}
