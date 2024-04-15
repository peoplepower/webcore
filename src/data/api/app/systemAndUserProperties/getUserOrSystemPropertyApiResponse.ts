import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetUserOrSystemPropertyApiResponse extends ApiResponseBase {
  value?: string;
}
