import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpgradeSubscriptionApiResponse extends ApiResponseBase {
}

export interface UpgradeSubscriptionInfoModel {
  services?: Array<{
    name: string;
    resourceId: string;
  }>;
  bots?: Array<{
    bundle: string;
    resourceId: number;
  }>;
}
