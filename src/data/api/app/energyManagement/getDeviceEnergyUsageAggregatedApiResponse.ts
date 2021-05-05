import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDeviceEnergyUsageAggregatedApiResponse extends ApiResponseBase {
  usages: Array<{
    startDate: string;
    startDateMs: number;
    endDate: string;
    endDateMs: number;
    energy: Array<{
      index: string;
      value: string;
    }>;
    cost: Array<{
      index: string;
      value: string;
    }>;
    external: boolean;
  }>;
}
