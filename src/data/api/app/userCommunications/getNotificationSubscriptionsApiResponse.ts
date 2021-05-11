import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetNotificationSubscriptionsApiResponse extends ApiResponseBase {
  subscriptions: Array<{
    type: NotificationType;
    locationId: number;
    email: boolean;
    push: boolean;
    sms: boolean;
    name: string;
    emailPeriod: number;
    pushPeriod: number;
    smsPeriod: number;
  }>;
}

export enum NotificationType {
  All = 0,
  MarketingEmails = 1,
  Rules = 3,
  Bots = 4,
  Questions = 5,
  AccountCreationFollowUp = 6,
  DeviceAlerts = 7,
  Apps = 8,
  InAppMessage = 9,
  NewDeviceAdded = 10,
  AccountIssues = 11,
  OAuthClient = 13,
  DeviceFirmwareUpdate = 16,
  SMSChat = 17,
  LocationMessages = 18,
  BotErrors = 19,
  AppBadgeChange = 20,
  Community = 21,
  BotReports = 22,
}
