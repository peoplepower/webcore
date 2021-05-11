import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetApplicationFileUrlApiResponse extends ApiResponseBase {
  contentUrl: string;
}
