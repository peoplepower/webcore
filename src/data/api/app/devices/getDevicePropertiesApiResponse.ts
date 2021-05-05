import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDevicePropertiesApiResponse extends ApiResponseBase {
  properties: Array<{
    name: string;
    value: string;
    index?: string;
    lastUpdatedTime?: string;
    lastUpdatedTimeMs?: number;
  }>;
}
