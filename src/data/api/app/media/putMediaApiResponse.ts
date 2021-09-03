import { ApiResponseBase } from '../../../models/apiResponseBase';
import { Media } from './getMediaApiResponse';

export interface PutMediaApiResponse extends ApiResponseBase {
}

export interface MediaModel {
  media: Array<Media>;
}
