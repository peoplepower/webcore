import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetSupportedDeviceTypeAttributesApiResponse extends ApiResponseBase {
  deviceTypeAttributes: Array<{
    name: string;
    desc: string;
    extended: boolean;
    defaultValue?: string;
    options?: Array<{
      id: string;
      value: string;
    }>;
  }>;
}
