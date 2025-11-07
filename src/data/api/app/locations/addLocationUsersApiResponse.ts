import { ApiResponseBase } from '../../../models/apiResponseBase';
import { LocationAccessLevel, LocationNotificationsCategory, ResidencyStatus, UserRole } from './getLocationUsersApiResponse';

export interface AddLocationUsersApiResponse extends ApiResponseBase {
}

export interface AddLocationUsersModel {
  users: Array<AddSingleLocationUserModel>;
}

export interface AddSingleLocationUserModel {
  id: number;
  locationAccess?: LocationAccessLevel;
  category?: LocationNotificationsCategory;
  residency?: ResidencyStatus;
  nickname?: string;

  /**
   * User role.
   */
  role?: UserRole;

  /**
   * Hide user for the non-admin users.
   */
  hidden?: boolean;

  /**
   * Call tree order.
   */
  callOrder?: number;
}
