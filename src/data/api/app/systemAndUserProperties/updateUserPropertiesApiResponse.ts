import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdateUserPropertiesApiResponse extends ApiResponseBase {}

export interface UpdateUserPropertiesModel {
  property: Array<{
    name: string;
    content: string;
  }>;
}
