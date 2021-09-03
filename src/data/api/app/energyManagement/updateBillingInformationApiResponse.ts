import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdateBillingInformationApiResponse extends ApiResponseBase {
}

export interface UpdateBillingInformationModel {
  billingInfo?: {
    billingDay?: number;
    budgets?: {
      budget?: Array<{
        month: number;
        content: string;
      }>;
    };
    utility?: string;
    billingRate?: {
      id: number;
      value: string;
    };
  };
}
