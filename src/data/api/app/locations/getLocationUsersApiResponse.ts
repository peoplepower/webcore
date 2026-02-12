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
 * TODO: Consider to add additional roles here.
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
   * Organization administrator role.
   * Determine if the user is an organization administrator.
   */
  roleId?: number;

  /**
   * User's residency status.
   */
  residency: ResidencyStatus;

  /**
   * Hide user for other location users.
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
   * Available communication channels.
   */
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

  birthDate?: string;
  gender?: GenderType;

  /**
   * Call tree order.
   */
  callOrder?: number;

  /**
   * Medical record number.
   */
  medicalRecordNumber?: string;

  /**
   * Temporary access to location.
   */
  temporary?: boolean;
  accessEndDate?: string;
  accessEndDateMs?: number;
}
