import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetListOfFileDevicesApiResponse extends ApiResponseBase {
  devices: Array<{
    id: number;
    desc: string;
  }>;
}
