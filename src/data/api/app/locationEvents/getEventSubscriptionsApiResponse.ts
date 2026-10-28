import { ApiResponseBase } from '../../../models/apiResponseBase';
import { EscalationPriority, EscalationType } from './getEscalationsApiResponse';

export enum EventSubscriptionDataType {
  Escalations = 11,
}

/**
 * Event subscription to subscribe for.
 */
export interface EventSubscriptionModel {
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

  /**
   * Push notification token of the mobile device.
   */
  notificationToken?: string;

  /**
   * Mobile app name.
   * Used for push notifications.
   */
  appName?: string;
}

/**
 * Existing event subscription.
 */
export interface EventSubscription extends EventSubscriptionModel {
  subscriptionId: number;
}

export interface GetEventSubscriptionsApiResponse extends ApiResponseBase {
  subscriptions: Array<EventSubscription>;
}
