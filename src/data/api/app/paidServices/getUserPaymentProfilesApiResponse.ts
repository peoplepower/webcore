import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum PaymentProfileType {
  Manual = 0,
  AppleInAppPurchase = 1,
  Braintree = 3,
  Chargify = 4
}

export interface GetUserPaymentProfilesApiResponse extends ApiResponseBase {
  customerId: string;
  paymentProfiles: Array<{
    type: PaymentProfileType;
    id: string;
    firstName: string;
    lastName: string;
    maskedCardNumber: string;
    cardType: string;
    expirationMonth?: string;
    expirationYear?: string;
    billingAddress?: string;
    billingAddress2?: string;
    billingCity?: string;
    billingCountry?: string;
    billingState?: string;
    billingZip?: string;
    paymentType?: string;
    disabled?: boolean;
  }>;
}
