import { ApiResponseBase } from '../../../models/apiResponseBase';
import { EscalationPriority, EscalationType } from './getEscalationsApiResponse';

export enum EventSubscriptionDataType {
  Escalations = 11,
}

/**
 * Event subscription.
 */
export interface EventSubscription {

  /**
   * Subscription data type.
   */
  dataType: EventSubscriptionDataType;

  /**
   * Location ID, if the subscription is for a single location.
   */
  locationId?: number;

  /**
   * Organization ID, if the subscription is for an organization.
   */
  organizationId?: number;

  /**
   * Organization location tags to filter events.
   */
  locationTags?: string[];

  /**
   * Filter events by priority.
   * Minimum and maximum priorities are optional.
   */
  priority?: EscalationPriority;
  priorityTo?: EscalationPriority;

  /**
   * Escalation types to filter events.
   */
  escalationTypes?: EscalationType[];
}

/**
 * Event subscriptions to subscribe for.
 * Multiple subscriptions allowed for one optional notification token.
 */
export interface EventSubscriptionsModel {

  /**
   * Subscriptions to enable.
   */
  subscriptions: Array<EventSubscription>;

  /**
   * Push notification token of the mobile device.
   * If another user will submit the same token, the token will change the owner.
   */
  notificationToken?: string;

  /**
   * Mobile app name.
   * Used for push notifications, required if notification token is provided.
   */
  appName?: string;
}

/**
 * Active event subscription.
 */
export interface ActiveEventSubscription extends EventSubscription {
  subscriptionId: number;
}

export interface GetEventSubscriptionsApiResponse extends ApiResponseBase {
  subscriptions: Array<ActiveEventSubscription>;
}
