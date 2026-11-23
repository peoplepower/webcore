import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * A bitmask for the push notification subscription types:
 * 1 - General push notifications (default)
 * 2 - Event subscriptions
 */
export enum PushSubscriptionType {
  General = 1,
  EventSubscriptions = 2,
}

export interface RegisterPushNotificationsApiResponse extends ApiResponseBase { };
