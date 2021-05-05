import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetLastNMeasurementsApiResponse extends ApiResponseBase {
  readings: Array<{
    deviceId: string;
    timeStamp: string;
    timeStampMs: number;
    params: Array<{ name: string; value: string; }>;
  }>;
}
