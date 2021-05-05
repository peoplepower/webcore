import { ApiResponseBase } from '../../../models/apiResponseBase';
import { PhoneType } from './createUserAndLocationApiResponse';

export interface UpdateUserApiResponse extends ApiResponseBase {

}

export interface UserModel {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailResetStatus?: boolean;
  phone?: string;
  phoneType?: PhoneType;
  anonymous?: boolean;
  language?: string;
}

export interface UpdateUserModel {
  user: UserModel;
}
