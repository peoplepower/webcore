import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdateLocationSpaceApiResponse extends ApiResponseBase {
  spaceId?: number;
}

export interface UpdateLocationSpaceModel {
  space: {
    type?: number;
    name?: string;
  };
}
