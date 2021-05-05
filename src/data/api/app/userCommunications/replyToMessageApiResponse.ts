import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface ReplyToMessageApiResponse extends ApiResponseBase {

}

export interface ReplyToMessageModel {
  message: {
    text: string,
    email: boolean,
    push: boolean
  }
}
