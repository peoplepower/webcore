import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetMeasurementsHistoryApiResponse extends ApiResponseBase {
  readings: Array<{
    deviceId: string;
    timeStamp: string;
    timeStampMs: number;
    params: Array<{ name: string; value: string; }>;
  }>;
}

export enum IntervalAggregationAlgorithm {
  LastValueBeforeTheIntervalPoint = 0,
  MinimumValue = 1,
  MaximumValue = 2,
  MedianValue = 3,
  TimeDistributedAverageValue = 4,
  AverageValue = 5
}
