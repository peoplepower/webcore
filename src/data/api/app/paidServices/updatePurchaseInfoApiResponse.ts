import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdatePurchaseInfoApiResponse extends ApiResponseBase {}

export interface UpdatePurchaseInfoModel {
  subscriptionId?: string;

  /**
   * Payment provider one-time token to update payment method
   */
  paymentToken?: string;
}
