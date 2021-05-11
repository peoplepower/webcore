import { ApiResponseBase } from '../../../models/apiResponseBase';
import { NotificationType } from './getNotificationSubscriptionsApiResponse';

export interface GetNotificationsApiResponse extends ApiResponseBase {
  notifications?: Array<{
    sendDate?: string;
    sendDateMs?: number;
    deliveryType?: NotificationDeliveryType;
    notificationType?: NotificationType;
    brand?: string;
    templateName?: string;
    language?: string;
    sound?: string;
    badge?: number;
    sentCount?: number;
    sourceType?: NotificationSourceType;
    sourceId?: number;
    messageText?: string;
  }>;
}

export enum NotificationDeliveryType {
  Push = 1,
  Email = 2,
  OutgoingSMS = 3,
  IncomingSMS = 4,
}

export enum NotificationSourceType {
  ExternalApiCall = 0,
  Rule = 1,
  Bot = 2,
  DeviceFirmwareUpdate = 4,
  InternalSystem = 5,
  CloudBusinessLogic = 6,
  ExternalIncomingMessage = 7,
}
