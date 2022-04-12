import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetLocationTimeStateApiResponse extends ApiResponseBase {
  states?: Array<{
    name: string;
    stateDate: string;
    stateDateMs: number;
    value?: any;
    avg?: any;
  }>;
}

/**
 * How to aggregate the location time states historical data
 */
export enum LocationTimeStateAggregation {
  Hour = 1,
  Day = 2,
  Month = 3,
  Week = 3,
}
