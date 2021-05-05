import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetLocationScenesHistoryApiResponse extends ApiResponseBase {
  events: Array<{
    event: string;
    eventDate: string;
    eventDateMs: number;
  }>;
}
