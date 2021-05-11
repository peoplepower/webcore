import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum MediaType {
  Video = 1,
  Image = 2,
  Audio = 3,
  TextDocument = 6,
}

export interface Media {
  id: string;
  mediaType: MediaType;
  url: string;
  contentType: string;
  desc: {
    [key: string]: string;
  };
}

export interface GetMediaApiResponse extends ApiResponseBase {
  media: Array<Media>;
}
