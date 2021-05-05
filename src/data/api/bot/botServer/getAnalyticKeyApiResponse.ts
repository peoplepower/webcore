import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetAnalyticKeyApiResponse extends ApiResponseBase {
  key: string;
  expiry: number;
}
