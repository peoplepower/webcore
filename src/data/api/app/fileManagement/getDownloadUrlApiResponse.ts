import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDownloadUrlApiResponse extends ApiResponseBase {
  contentUrl?: string;
  thumbnailUrl?: string;
}
