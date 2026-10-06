import { ApiResponseBase } from '../../../models/apiResponseBase';
import { LocationNotificationsCategory } from '../locations/getLocationUsersApiResponse';
import { NotificationType } from './getNotificationSubscriptionsApiResponse';

export interface SendNotificationApiResponse extends ApiResponseBase {
}

export interface SendNotificationModel {
  /**
   * Notification template brand.
   */
  brand: string;

  /**
   * Notify location uses of these categories.
   */
  userCategories?: LocationNotificationsCategory[];

  /**
   * Notify these uses.
   */
  users?: number[];

  /**
   * Message language.
   */
  language?: string;

  /**
   * Related escalation.
   */
  escalationId?: number;

  /**
   * Push notification.
   */
  pushMessage?: {
    title?: string;
    subtitle?: string;
    category?: string;
    type: NotificationType;
    badgeType?: number;
    template: string;
    sound: string;
    content: string;

    /**
     * Send SMS, if the user does not have valid notification tokens.
     */
    smsFallback?: boolean;
    smsContent?: string;

    model: {
      [key: string]: string;
    };
    info: {
      [key: string]: string;
    };
  };

  /**
   * Email message.
   */
  emailMessage?: {
    subject: string;
    html: boolean;
    template: string;
    content: string;
    model: {
      [key: string]: string;
    };
    attachments: Array<{
      name: string;
      content: string;
      contentType: string;
      contentId: string;
    }>;
  };

  /**
   * SMS message.
   */
  smsMessage?: {
    template?: string;
    content: string;
    model: {
      [key: string]: string;
    };
  };

  /**
   * Device message.
   * Message to be delivered to an IoT device.
   */
  deviceMessage?: {
    deviceId: string;
    title?: string;
    text: string;
    from: string;
    duration?: number;
    icon?: string;
    muted: boolean;
    imageUrl?: string;
    image?: string;
  };
}
