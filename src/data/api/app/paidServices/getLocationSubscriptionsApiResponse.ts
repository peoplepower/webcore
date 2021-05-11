import { ApiResponseBase } from '../../../models/apiResponseBase';
import { PaymentType, ResourceType, SubscriptionType } from './getSoftwareSubscriptionsApiResponse';

export enum SubscriptionStatus {
  DefaultOrActive = 0,
  ExpiredOrCancelled = 1,
  Paused = 2,
  Initial = -1,
}

export interface GetLocationSubscriptionsApiResponse extends ApiResponseBase {
  /**
   * Subscriptions purchased by user, assigned manually, automatically or bot
   */
  subscriptions?: Array<{
    /**
     * Subscription ID
     */
    userPlanId: number;
    /**
     * Plan description from which the subscription was created
     */
    plan: {
      id: number;
      name: string;
      desc: string;
      appName?: string;
      /**
       * 'true' if it's a freemium subscription
       */
      freemium?: boolean;
      services?: Array<{
        name: string;
        amount: number;
        resourceType: ResourceType;
        resourceId?: string;
      }>;
      bots?: Array<{
        bundle: string;
        resourceType: number;
      }>;
    };
    /**
     * Price ID that was used to purchase this subscription
     */
    priceId: number;
    /**
     * New plan which is in process of assignment/purchase
     */
    updatePlan?: {
      id: number;
      name: string;
      desc: string;
      appName?: string;
    };
    /**
     * List of service plan ID's to which ones current plan can be upgraded
     */
    upgradableTo?: number[];
    /**
     * ID of user who assigned subscription
     */
    assignUserId?: number;
    /**
     * System services applied with current subscription
     */
    services?: Array<{
      name: string;
      amount: string;
      resourceType: ResourceType;
      resurceId?: string;
    }>;
    /**
     * Location ID subscription belongs to
     */
    locationId: number;
    /**
     * ID of user who purchased subscription
     */
    userId?: number;
    /**
     * Type of subscription
     */
    type: SubscriptionType;
    /**
     * Type of payment
     */
    paymentType: PaymentType;
    /**
     * Subscription status
     */
    status: SubscriptionStatus;
    /**
     * Issue date of the subscription
     */
    issueDate: string;
    /**
     * Issue date of the subscription as milliseconds
     */
    issueDateMs: number;
    /**
     * Start date of the subscription
     */
    startDate: string;
    /**
     * Start date of the subscription as milliseconds
     */
    startDateMs: number;
    /**
     * End date of the subscription
     */
    endDate: string;
    /**
     * End date of the subscription as milliseconds
     */
    endDateMs: number;
    /**
     * 'true' if it is a free trial subscription
     */
    free?: boolean;
    /**
     * ID of the payment gateway if any (for paid subscriptions)
     */
    gatewayId?: string;
    /**
     * ID of subscription at payment gateway (for paid subscripitons)
     */
    subscriptionId: string;
    /**
     * ID of the payment transaction that corresponds to this subscription
     */
    transactionId?: string;
    /**
     * Indicates whether it is paymeny gateway sandbox or not
     */
    sandbox?: boolean;
    /**
     * Name of the application (brand) in terms of which subscription was purchased
     */
    appName?: string;
    /**
     * Masked card number that was used for payment
     */
    cardMaskedNumber?: string;
    /**
     * Card expiration date
     */
    cardExpirationDate?: string;
    /**
     * Cardholder name
     */
    cardFirstName?: string;
    cardLastName?: string;
    /**
     * Duration of the subscription in days, if this is a Non-Renewable subscription that requires Ensemble to expire the subscription
     */
    duration?: number;
    /**
     * Organization ID at which basis subscription was assigned
     */
    organizationId?: number;
    /**
     * True if the subscriptions was cancelled either by user or administrator
     */
    cancelled?: boolean;
    /**
     * Date of subscription cancellation
     */
    cancelDate?: string;
    /**
     * Date of subscription cancellation in milliseconds
     */
    cancelDateMs?: number;
    /**
     * ID of the transaction which was performed to cancel the subscription
     */
    cancelTransactionId?: string;
  }>;
}
