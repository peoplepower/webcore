import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum SubscriptionType {
  OneTimePurchase = 1,
  WeeklySubscription = 2,
  MonthlySubscription = 3,
  AnnualSubscription = 4,
}

export enum PaymentType {
  Manual = 0,
  AppleInAppPurchase = 1,
  PayPal = 2,
  Braintree = 3,
  Chargify = 4,
}

/**
 * Service and bot resource types
 * Some resources binded to Location, but some User-specific
 */
export enum ResourceType {
  User = 0,
  Location = 1,
  Device = 4,
  Circle = 7,
}

export interface GetSoftwareSubscriptionsApiResponse extends ApiResponseBase {
  /**
   * List of available software service plans
   */
  servicePlans: Array<{
    /**
     * ID of a specific service plan
     */
    id: number;
    /**
     * Name of a specific service plan
     */
    name: string;
    /**
     * Description of a specific service plan
     */
    desc: string;
    /**
     * Whether or not this service plan is available to purchase
     */
    available: boolean;
    /**c
     * List of service plan ID's, where this plan can be upgraded
     */
    upgradableTo?: Array<number>;
    services?: Array<{
      name: string;
      amount: number;
      resourceType: ResourceType;
    }>;
    bots?: Array<{
      bundle: string;
      resourceType: ResourceType;
    }>;
    /**
     * Set of available prices and options to purchase this service
     */
    prices: Array<{
      /**
       * ID of a plan price
       */
      id: number;
      /**
       * Type of subscription
       */
      type: SubscriptionType;
      /**
       * Type of payment
       */
      paymentType: PaymentType;
      /**
       * 'true' if a limited free trial option is available
       */
      free?: boolean;
      /**
       * 'true' if it's a freemium subscription
       */
      freemium?: boolean;
      /**
       * Duration of the subscription in days, if this is a Non-Renewable subscription that requires Ensemble to expire the subscription
       */
      duration?: number;
      /**
       * Unique Apple App Store product ID for the service plan. You must create an identical product identifier in your iTunes Connect account so Apple can
       * facilitate the sale
       */
      appleStoreId?: string;
      gatewayId?: string;
      currencySymbol?: string;
      currencyCode?: string;
      totalAmount?: string;
      totalTax?: string;
      /**
       * Price amount currency code, symbol and value
       */
      amounts?: Array<{
        value: string;
        taxable: boolean;
        tax?: string;
        desc?: string;
      }>;

      /**
       * Optional Chargify.js site name
       */
      site?: string;
    }>;
    /**
     * Existing subscriptions owned by the user
     */
    subscriptions?: Array<{
      /**
       * Subscription record ID
       */
      userPlanId: number;
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
       * Type of subscription
       */
      type: SubscriptionType;
      /**
       * Type of payment
       */
      paymentType: PaymentType;
      /**
       * Duration of the subscription in days, if this is a Non-Renewable subscription that requires Ensemble to expire the subscription
       */
      duration?: number;
      /**
       * Organization purchased this subscription for the user
       */
      organizationId: number;
      /**
       * Product ID of this subscription on the Apple App Store
       */
      appleStoreId?: string;
      /**
       * ID of the payment transaction that corresponds to this subscription
       */
      transactionId?: string;
    }>;
  }>;
}
