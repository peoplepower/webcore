import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface FileAttributesModel {
  file: {
    viewed: boolean;
    favourite: boolean;
    publicAccess: boolean;
  };
}

export interface UpdateFileAttributesApiResponse extends ApiResponseBase {

}
