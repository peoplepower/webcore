import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetExternalParametersApiResponse extends ApiResponseBase {
  [key: string]: string | number | boolean | undefined;
}
