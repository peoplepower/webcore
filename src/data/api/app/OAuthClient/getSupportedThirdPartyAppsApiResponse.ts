import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetSupportedThirdPartyAppsApiResponse extends ApiResponseBase {
  applications: Array<{
    id: number;
    name: string;
    microService?: boolean;
    greenButton?: boolean;
    icon: string;
  }>;
}
