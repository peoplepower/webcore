import { ApiResponseBase } from '../../../models/apiResponseBase';
import { PaymentType } from './getSoftwareSubscriptionsApiResponse';

export interface GetUserPaymentProfilesApiResponse extends ApiResponseBase {
  customerId: string;
  paymentProfiles: Array<{
    type: PaymentType;
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
