import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetSoftwareSubscriptionsApiResponse, PaymentType } from './getSoftwareSubscriptionsApiResponse';
import { AssignServicesToLocationsApiResponse, AssignServicesToLocationsModel } from './assignServicesToLocationsApiResponse';
import { GetLocationSubscriptionsApiResponse, SubscriptionStatus } from './getLocationSubscriptionsApiResponse';
import { GetSubscriptionTransactionsApiResponse } from './getSubscriptionTransactionsApiResponse';
import { NewPurchaseInfoModel, ProvideNewPurchaseInfoApiResponse } from './provideNewPurchaseInfoApiResponse';
import { UpdatePurchaseInfoApiResponse, UpdatePurchaseInfoModel } from './updatePurchaseInfoApiResponse';
import { UpgradeSubscriptionApiResponse, UpgradeSubscriptionInfoModel } from './upgradeSubscriptionApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { GetUserPaymentProfilesApiResponse } from './getUserPaymentProfilesApiResponse';

/**
 * Ensemble facilitates sales of software services, and physical products. This API allows to get subscriptions,
 * store products, manage tokens, etc.
 * See {@link http://docs.iotapps.apiary.io/#reference/paid-services}
 */
@injectable('PaidServicesApi')
export class PaidServicesApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Return a list of paid service plans for sale.
   * See {@link http://docs.iotapps.apiary.io/#reference/paid-services/get-software-subscriptions}
   *
   * System and organization administrators can retrieve data for other users.
   * Software service plans can be subscription-based, or one-time feature buys.
   * Ensemble supports Apple's Auto-renewable Subscriptions as well as Non-Renewing Subscriptions with custom limits on durations.
   * See https://developer.apple.com/in-app-purchase/ for more details.
   *
   * @param [params] Request parameters.
   * @param {number} [params.locationId] Location ID, required to get data for specific location.
   * @param {number} [params.userId] Used by administrators to specify another user.
   * @param {string} [params.appName] Retrieve the subscriptions available for the given unique app name.
   * @param {number} [params.organizationId] Used by administrators to receive plans for another user in specific organization.
   * @param {boolean} [params.hiddenPrices] Return hidden prices. It can be useful for testing new features before exposing them to public.
   * @param {boolean} [params.plansOnly] Return only service plans data without checking availability.
   * @returns {Promise<GetSoftwareSubscriptionsApiResponse>}
   */
  getSoftwareSubscriptions(params?: {
    locationId?: number;
    userId?: number;
    appName?: string;
    organizationId?: number;
    hiddenPrices?: boolean;
    plansOnly?: boolean;
  }): Promise<GetSoftwareSubscriptionsApiResponse> {
    return this.dal.get('servicePlans', {params: params});
  }

  /**
   * This API can be called by any user to assign free services,
   * or by an administrator with a corresponding privilege level to assign a service plan to multiple locations.
   * In multiple locations assignment result codes are returned for each of them.
   * See {@link https://iotapps.docs.apiary.io/#reference/paid-services/manage-services/assign-services-to-locations}
   *
   * @param {number} servicePlanId The Service Plan ID to assign.
   * @param {AssignServicesToLocationsModel} services update model
   * @param [params] Request parameters.
   * @param {string} [params.endDate] The end date of the subscription. Xsd:dateTime.
   * @param {number} [params.organizationId] Organization ID. Required if called by an organization administrator.
   * @param {number} [params.locationId] Location ID.
   * @returns {Promise<AssignServicesToLocationsApiResponse>}
   */
  assignServicesToLocations(
    servicePlanId: number,
    services?: AssignServicesToLocationsModel,
    params?: {
      organizationId?: number;
      endDate?: string;
      locationId?: number;
    },
  ): Promise<AssignServicesToLocationsApiResponse> {
    return this.dal.post('userServicePlans/' + encodeURIComponent(servicePlanId.toString()), services || {}, {params: params});
  }

  /**
   * Returns a list of subscriptions purchased by for specific location.
   * See {@link https://iotapps.docs.apiary.io/#reference/paid-services/location-subscriptions/get-location-subscriptions}
   *
   * System and organization administrators can retrieve data for other user locations.
   *
   * @param [params] Request parameters.
   * @param {number} [params.locationId] Specific location ID to retrieve subscriptions for.
   * @param {number} [params.userId] Ger plan by this user. Used by organization administrators.
   * @param {number} [params.userPlanId] Get specific subscription by ID.
   * @param {SubscriptionStatus|SubscriptionStatus[]} [params.status] Status of the subscription.
   * @param {boolean} [params.getCard] Retrieve payment card information from the payment provider.
   * @returns {Promise<GetLocationSubscriptionsApiResponse>}
   */
  getLocationSubscriptions(params?: {
    locationId?: number;
    userId?: number;
    userPlanId?: number;
    status?: SubscriptionStatus | SubscriptionStatus[];
    getCard?: boolean;
    sortBy?: string;
    sortOrder?: string;
    sortCollection?: string;
  }): Promise<GetLocationSubscriptionsApiResponse> {
    return this.dal.get('userServicePlans', {params: params});
  }

  /**
   * Upgrades specified existing user subscription to the specified target subscription (plan).
   * See {@link https://iotapps.docs.apiary.io/#reference/paid-services/upgrade-purchase/upgrade-purchased-plan}
   *
   * @param params Request params.
   * @param {number} params.userPlanId Existing user subscription (plan) ID to upgrade.
   * @param {number} params.targetPlanId ID of the target subscription (plan) to upgrade to.
   * @param {number} [params.userId] User ID on which account need to make changes. Can be used by a purchase administrator.
   * @param {UpgradeSubscriptionInfoModel} [upgradeModel] Additional service and bots to assign. Optional.
   * @returns {Promise<UpgradeSubscriptionApiResponse>}
   */
  upgradeSubscription(
    params: {
      userPlanId: number;
      targetPlanId: number;
      userId?: number;
    },
    upgradeModel?: UpgradeSubscriptionInfoModel,
  ): Promise<UpgradeSubscriptionApiResponse> {
    return this.dal.post('purchase/upgrade', upgradeModel, {params: params});
  }

  /**
   * Cancel subscription purchased through PayPal or assigned to the user manually.
   * See {@link https://iotapps.docs.apiary.io/#reference/paid-services/manage-services/cancel-subscription}
   *
   * @param {number} servicePlanId The Service Plan ID to cancel.
   * @param [params] Request parameters.
   * @param {number} [params.locationId] User's location ID to cancel the service plan.
   * @param {number} [params.organizationId] Organization ID. Required if called by an administrator.
   * @returns {Promise<ApiResponseBase>}
   */
  cancelSubscription(servicePlanId: number, params?: { locationId?: number; organizationId?: number }): Promise<ApiResponseBase> {
    return this.dal.delete('userServicePlans/' + encodeURIComponent(servicePlanId.toString()), {params: params});
  }

  /**
   * Returns all payment transactions for the specified service plan (subscription).
   * See {@link https://iotapps.docs.apiary.io/#reference/paid-services/transactions/get-transactions}
   *
   * @param {number} servicePlanId ID of the subscription to return transactions for.
   * @param [params] Request parameters.
   * @param {number} [params.locationId] ID of the particular location to get subscription transactions for. Should be used by administrators.
   * @param {boolean} [params.upgrade] Return only transactions, which caused service plan change.
   * @returns {Promise<GetSubscriptionTransactionsApiResponse>}
   */
  getSubscriptionTransactions(
    servicePlanId: number,
    params?: { locationId?: number; upgrade?: boolean },
  ): Promise<GetSubscriptionTransactionsApiResponse> {
    return this.dal.get(`userServicePlanTransactions/${encodeURIComponent(servicePlanId.toString())}`, {params: params});
  }

  /**
   * Provide purchase information like a subscription ID or a receipt or a nonce, which proofs that the purchase has been made.
   * See {@link https://iotapps.docs.apiary.io/#reference/paid-services/purchase/provide-new-purchase-info}
   *
   * If the purchased plan contains services with resource types other than "user" (0), the request must include corresponding resource ID's for these services.
   *
   * @param {NewPurchaseInfoModel} newPurchaseInfo Purchase Info
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @param {number} [params.priceId] Service plan price ID. Do not use for paymentType = 4 (Chargify).
   * @param {PaymentType} [params.paymentType] Payment type (payment provider).
   * @param {number} [params.userId] Purchase as specific user.
   * @param {boolean} [params.sandbox] Set to true, if need to test on sandbox payment provider. Used only for paymentType = 3 (Braintree).
   */
  provideNewPurchaseInfo(
    newPurchaseInfo: NewPurchaseInfoModel,
    params: {
      locationId: number;
      priceId?: number;
      paymentType?: PaymentType;
      userId?: number;
      sandbox?: boolean;
    },
  ): Promise<ProvideNewPurchaseInfoApiResponse> {
    return this.dal.post(`purchase`, newPurchaseInfo, {params: params});
  }

  /**
   * Update purchase information like a receipt or a subscription ID for an existing user service plan, or update payment profile for existing subscription if
   * 'paymentToken' is specified.
   * See {@link https://iotapps.docs.apiary.io/#reference/paid-services/purchase/update-purchase-info}
   *
   * @param {UpdatePurchaseInfoModel} purchaseInfo Subscription details.
   * @param params Request parameters.
   * @param {number} params.userPlanId The User Service Plan ID to update.
   * @param {number} params.locationId Location ID.
   * @param {number} [params.userId] Act as specific user.
   */
  updatePurchaseInfo(
    purchaseInfo: UpdatePurchaseInfoModel,
    params: {
      userPlanId: number;
      locationId: number;
      userId?: number
    },
  ): Promise<UpdatePurchaseInfoApiResponse> {
    return this.dal.put(`purchase`, purchaseInfo, {params: params});
  }

  /**
   * Returns existing payment profiles if related customer already exists in Chargify and have any valid payment profiles.
   * The customer in Chargify is uniquely identified by the user ID (specified in the parameters or identified by the API key),
   * however, you can specify the "customerId" if you know it and want to conduct additional verification.
   * @param params Request parameters.
   * @param {PaymentType} [params.paymentType] Payment type (payment provider).
   * @param {number} [params.userId] Used by administrators to specify another user.
   * @param {string} [params.customerId] Customer ID from external payment service (if known).
   * @param {boolean} [params.includeDisabled] Include disabled profiles into the result. Default is false.
   * @param {boolean} [params.appName] PPC cloud related appName (brand). Required if paymentType = 4 (Chargify).
   */
  getUserPaymentProfiles(params: {
    paymentType: PaymentType;
    userId?: number;
    customerId?: string;
    includeDisabled?: boolean;
    appName?: string;
  }): Promise<GetUserPaymentProfilesApiResponse> {
    return this.dal.get(`userPaymentProfiles`, {params: params});
  }
}
