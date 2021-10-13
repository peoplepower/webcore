import { ApiResponseBase } from '../../../models/apiResponseBase';
import { SubscriptionStatus } from './getLocationSubscriptionsApiResponse';
import { PaymentType, SubscriptionType } from './getSoftwareSubscriptionsApiResponse';

export interface ProvideNewPurchaseInfoApiResponse extends ApiResponseBase {
  subscription: {
    userPlanId: number;
    plan: {
      id: number;
      name: string;
      desc: string;
    };
    /**
     * Location subscription purchased for.
     */
    locationId: number;
    /**
     * User who purchased subscription.
     * In case of administrative usage, the user on behalf of who subscription was assigned.
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
     * ID of subscription at payment gateway (for paid subscriptions)
     */
    subscriptionId: string;
    /**
     * Indicates whether it is payment gateway sandbox or not
     */
    sandbox?: boolean;
    /**
     * Name of the application (brand) in terms of which subscription was purchased
     */
    appName?: string;
  }
}

export interface NewPurchaseInfoModel {
  /**
   * Billing provider unique identification of the instance.
   * Only for certain providers like Chargify.
   */
  site?: string;

  /**
   * Existing subscription ID from recurring billing provider.
   */
  subscriptionId?: string;

  /**
   * One-time security nonce or token to verify that payment was really made.
   * Token usually provided by 3rd party billing service (payment provider service) integrated Web UI or framework
   */
  paymentToken?: string;

  /**
   * Payment profile ID what could be retrieved at Get Payments Profiles API
   * https://iotapps.docs.apiary.io/#reference/paid-services/user-payment-profiles/get-payment-profiles
   */
  paymentProfileId?: string;

  /**
   * Customer ID in 3rd party billing service or payment provider service
   */
  customerId?: string;

  services?: Array<{
    name: string;
    resourceId: string;
  }>;

  bots?: Array<{
    bundle: string;
    resourceId: number;
  }>;
}
