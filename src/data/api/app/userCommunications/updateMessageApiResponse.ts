import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdateMessageApiResponse extends ApiResponseBase {
}

export interface UpdateMessageModel {
  message: {
    subject?: string;
    text?: string;
    parameters?: {
      [key: string]: string;
    };
  };
}
