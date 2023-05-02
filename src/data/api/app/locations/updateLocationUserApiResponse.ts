import { ApiResponseBase } from '../../../models/apiResponseBase';
import { AddSingleLocationUserModel } from "./addLocationUsersApiResponse";

export interface UpdateLocationUserApiResponse extends ApiResponseBase {
}

export interface UpdateLocationUserModel {
  user: UpdateSingleLocationUserModel;
}

export interface UpdateSingleLocationUserModel extends AddSingleLocationUserModel {
}
