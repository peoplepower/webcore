import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDeviceActivationInfoAtLocationApiResponse extends ApiResponseBase {
  deviceActivationKey?: string;
  deviceActivationUrl?: string;
  setupDownloadUrl?: string;
  message: string;
  host?: string;
  port?: number;
  uri?: string;
  ssl?: number;
}
