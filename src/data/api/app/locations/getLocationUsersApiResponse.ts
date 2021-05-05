import { ApiResponseBase } from '../../../models/apiResponseBase';
import { EmailVerificationStatus, PhoneVerificationStatus } from '../userAccounts/getUserInformationApiResponse';
import { PhoneType } from '../userAccounts/createUserAndLocationApiResponse';

export enum LocationAccessLevel {
  None = 0,
  Read = 10,
  Control = 20,
  Admin = 30
}

export enum LocationNotificationsCategory {
  NoCategory = 0,
  HomeOwner = 1,
  Supporter = 2
}

export interface GetLocationUsersApiResponse extends ApiResponseBase {
  users: Array<{
    id: number;
    userName: string;
    altUsername?: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    email?: {
      email: string;
      verified: boolean;
      status: EmailVerificationStatus;
    },
    phone?: string;
    phoneType?: PhoneType;
    smsStatus?: PhoneVerificationStatus;
    locationAccess: LocationAccessLevel;
    temporary: boolean;
    accessEndDate?: string;
    accessEndDateMs?: number;
    category: LocationNotificationsCategory;
    smsPhone?: string;
    language: string;
    avatarFileId?: number;
    schedules?: Array<{
      daysOfWeek: number;
      startTime: number;
      endTime: number;
    }>;
  }>;
}
