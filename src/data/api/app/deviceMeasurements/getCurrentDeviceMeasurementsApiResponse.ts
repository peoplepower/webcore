import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetCurrentDeviceMeasurementsApiResponse extends ApiResponseBase {
  devices: Array<{
    id: string;
    lastDataReceivedDate: string;
    lastDataReceivedDateMs: number;
    lastMeasureDate: string;
    lastMeasureDateMs: number;
    parameters: Array<{
      name: string;
      value?: string;
      lastUpdateTime: string;
      lastUpdateTimeMs: number;
    }>;
  }>;
}
