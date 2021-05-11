import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetUserPropertiesApiResponse extends ApiResponseBase {
  properties: Array<{ name: string; value: string }>;
}
