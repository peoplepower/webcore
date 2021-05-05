import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetBotSummaryApiResponse extends ApiResponseBase {
  dataStreams?: string[];
  microServices?: string[];
}
