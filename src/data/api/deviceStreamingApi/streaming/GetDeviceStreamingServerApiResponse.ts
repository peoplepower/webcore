import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDeviceStreamingServerApiResponse extends ApiResponseBase {
  /**
   * If server field is not present - then device is disconnected from streaming server
   */
  server?: {
    host: string;
    port?: string;
    ssl: boolean;
  };
}
