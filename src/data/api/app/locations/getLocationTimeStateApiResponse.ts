import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetLocationTimeStateApiResponse extends ApiResponseBase {
  states?: Array<{
    name: string,
    startDate: string,
    startDateMs: number,
    value?: Object,
    avg?: Object
  }>;
}

/**
 * How to aggregate the location time states historical data
 */
export enum LocationTimeStateAggregation {
  Hour = 1,
  Day = 2,
  Month = 3,
  Week = 3
}
