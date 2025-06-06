import { ApiResponseBase } from '../../../models/apiResponseBase';
import { EmailVerificationStatus, GenderType, PhoneVerificationStatus } from '../userAccounts/getUserInformationApiResponse';
import { AccessibilityType, PhoneType } from '../userAccounts/createUserAndLocationApiResponse';

export enum LocationAccessLevel {
  None = 0,
  Read = 10,
  Control = 20,
  Admin = 30,
}

export enum LocationNotificationsCategory {
  /**
   * Does not get smart home alerts
   */
  NoAlerts = 0,

  /**
   * First to get smart home alerts
   */
  HomeOwner = 1,

  /**
   * Get alerts if a resident doesn't respond
   */
  FamilyOrFriend = 2,

  /**
   * Get reminded to call or check in
   */
  SocialRemindersOnly = 3,
}

/**
 * Location user role.
 * Used by Bots and UI to determine who is who.
 */
export enum UserRole {
  EmptyRole = 0,
  CareRecipient = 1,
  PrimaryCaregiver = 2,
  SecondaryCaregiver = 3,
  ProfessionalCaregiver = 4,
}


export interface GetLocationUsersApiResponse extends ApiResponseBase {
  users: LocationUser[];
}

export interface LocationUser {
  id: number;
  userName: string;
  altUsername?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;

  /**
   * User role.
   */
  role?: UserRole;

  /**
   * Hide user for the non-admin users.
   */
  hidden?: boolean;

  email?: {
    email: string;
    verified: boolean;
    status: EmailVerificationStatus;
  };

  phone?: string;
  phoneType?: PhoneType;
  smsStatus?: PhoneVerificationStatus;
  locationAccess: LocationAccessLevel;
  category: LocationNotificationsCategory;

  /**
   * Temporary user access (deprecated).
   */
  temporary: boolean;
  accessEndDate?: string;
  accessEndDateMs?: number;

  phoneChennels?: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
  };

  smsPhone?: string;
  language: string;
  avatarFileId?: number;

  /**
   * Bitmask representation of accessibility preferences.
   */
  accessibility?: AccessibilityType;

  birthYear?: number;
  gender?: GenderType;

  /**
   * Call tree order.
   */
  callOrder?: number;
}
