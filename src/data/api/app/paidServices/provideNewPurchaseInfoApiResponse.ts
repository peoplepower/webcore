import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface ProvideNewPurchaseInfoApiResponse extends ApiResponseBase {

}

export interface NewPurchaseInfoModel {
  subscriptionId?: string;

  /**
   * One-time security nonce or token to verify that payment was really made.
   * Token usually provided by 3rd party billing service (payment provider service) integrated Web UI or framework
   */
  paymentToken?: string;

  /**
   * Payment profile ID what could be retrieved at Get Payments Profiles API
   * https://iotapps.docs.apiary.io/#reference/paid-services/user-payment-profiles/get-payment-profiles
   */
  paymentProfileId?: string;

  /**
   * Cusomer ID in 3rd party billing service or payment provider service
   */
  customerId?: string;

  services?: Array<{
    name: string,
    resourceId: string
  }>;

  bots?: Array<{
    bundle: string,
    resourceId: number
  }>;
}
