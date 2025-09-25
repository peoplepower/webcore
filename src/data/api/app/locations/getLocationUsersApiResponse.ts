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
  NoAlerts = 0,
  AlertedFirst = 1,
  AlertedSecond = 2,
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

/**
 * Location user residency status.
 * For the context of assisted living communities and families.
 */
export enum ResidencyStatus {
  Unknown = 0,
  Resident = 1,
  CommunityStaff = 2,
  LivesNearby = 3,
  LivesRemotely = 4,
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
   * User's residency status.
   */
  residency?: ResidencyStatus;

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
