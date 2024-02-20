import { ApiResponseBase } from '../../../models/apiResponseBase';
import { LocationAccessLevel, LocationNotificationsCategory, UserRole } from './getLocationUsersApiResponse';
import { AccessibilityType } from "../userAccounts/createUserAndLocationApiResponse";

export interface AddLocationUsersApiResponse extends ApiResponseBase {
}

export interface AddLocationUsersModel {
  users: Array<AddSingleLocationUserModel>;
}

export interface AddSingleLocationUserModel {
  id: number;
  locationAccess?: LocationAccessLevel;
  temporary?: boolean;
  category?: LocationNotificationsCategory;
  nickname?: string;
  schedules?: Array<{
    daysOfWeek?: number;
    startTime?: number;
    endTime?: number;
  }>;

  /**
   * User role.
   */
  role?: UserRole;

  /**
   * Bitmask representation of accessibility preferences.
   */
  accessibility?: AccessibilityType;
}
