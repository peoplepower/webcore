import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetSignaturesApiResponse extends ApiResponseBase {
  termsOfServices: Array<string>;
}
