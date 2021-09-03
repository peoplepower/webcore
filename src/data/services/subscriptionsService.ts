import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { PaidServicesApi } from '../api/app/paidServices/paidServicesApi';
import { GetSoftwareSubscriptionsApiResponse, PaymentType } from '../api/app/paidServices/getSoftwareSubscriptionsApiResponse';
import { AuthService } from './authService';
import { GetLocationSubscriptionsApiResponse, SubscriptionStatus } from '../api/app/paidServices/getLocationSubscriptionsApiResponse';
import { UserService } from './userService';
import { GetSubscriptionTransactionsApiResponse } from '../api/app/paidServices/getSubscriptionTransactionsApiResponse';
import { NewPurchaseInfoModel } from '../api/app/paidServices/provideNewPurchaseInfoApiResponse';
import { UpdatePurchaseInfoModel } from '../api/app/paidServices/updatePurchaseInfoApiResponse';
import { UpgradeSubscriptionInfoModel } from '../api/app/paidServices/upgradeSubscriptionApiResponse';
import { ApiResponseBase } from '../models/apiResponseBase';
import {
  AssignServicesToLocationsApiResponse,
  AssignServicesToLocationsModel,
} from '../api/app/paidServices/assignServicesToLocationsApiResponse';
import { GetUserPaymentProfilesApiResponse } from '../api/app/paidServices/getUserPaymentProfilesApiResponse';

@injectable('SubscriptionsService')
export class SubscriptionsService extends BaseService {
  @inject('AuthService') private readonly authService!: AuthService;
  @inject('UserService') private readonly userService!: UserService;
  @inject('PaidServicesApi') protected readonly paidServicesApi!: PaidServicesApi;

  constructor() {
    super();
  }

  /**
   * Gets available service plans for the users to subscribe.
   * @param {number} [locationId] Location ID, required to get data for specific location.
   * @param {number} [userId] Used by administrators to specify another user.
   * @param {number} [organizationId] Used by administrators to receive plans in specific organization.
   * @param {string} [appName] Used by administrators to receive plans in specific organization.
   * @param {boolean} [hiddenPrices] Return hidden prices.
   * @param {boolean} [plansOnly] Return plans metadata without checking current availability.
   * @returns {Promise<ServicePlans>}
   */
  public getAvailableServicePlans(
    locationId?: number,
    userId?: number,
    organizationId?: number,
    appName?: string,
    hiddenPrices?: boolean,
    plansOnly?: boolean,
  ): Promise<ServicePlans> {
    const params: {
      locationId?: number;
      appName?: string;
      userId?: number;
      organizationId?: number;
      hiddenPrices?: boolean;
      plansOnly?: boolean;
    } = {};

    if (locationId && !isNaN(locationId)) {
      if (locationId < 1) {
        return this.reject(`Location Id is incorrect [${locationId}].`);
      }
      params.locationId = locationId;
    }
    if (userId && !isNaN(userId)) {
      if (userId < 1) {
        return this.reject(`User Id is incorrect [${userId}].`);
      }
      params.userId = userId;
    }
    if (organizationId && !isNaN(organizationId)) {
      if (organizationId < 1) {
        return this.reject(`Organization Id is incorrect [${organizationId}].`);
      }
      params.organizationId = organizationId;
    }
    if (appName && appName.length > 0) {
      params.appName = appName;
    }
    if (hiddenPrices) {
      params.hiddenPrices = true;
    }
    if (plansOnly) {
      params.plansOnly = true;
    }

    return this.authService.ensureAuthenticated().then(() => this.paidServicesApi.getSoftwareSubscriptions(params));
  }

  /**
   * Gets currently authenticated user's subscriptions.
   * @param {SubscriptionStatus} [status] Service plan status filter.
   * @param {boolean} [getCard] Retrieve payment card information from the payment provider. It can be slow!
   * @returns {Promise<Subscriptions>}
   */
  public getCurrentUserSubscriptions(status?: SubscriptionStatus, getCard?: boolean): Promise<Subscriptions> {
    return this.authService
      .ensureAuthenticated()
      .then(() => this.userService.getCurrentUserInfo())
      .then((data) => this.getLocationSubscriptions(undefined, data.user.id, undefined, status, getCard));
  }

  /**
   * Gets subscriptions of particular user.
   * @param {number} userId Ger plan by this user. Used by organization administrators.
   * @param {SubscriptionStatus} status Service plan status filter.
   * @param {boolean} [getCard] Retrieve payment card information from the payment provider.
   * @returns {Promise<Subscriptions>}
   */
  public getUserSubscriptions(userId: number, status?: SubscriptionStatus, getCard?: boolean): Promise<Subscriptions> {
    if (!userId || isNaN(userId) || userId < 1) {
      return this.reject(`User ID is incorrect [${userId}].`);
    }
    return this.authService.ensureAuthenticated().then(() => this.getLocationSubscriptions(undefined, userId, undefined, status, getCard));
  }

  /**
   * Gets specified location/user subscriptions information. Mostly used by administrators.
   * Non-admin users will not be allowed to get information for other users.
   * @param {number} [locationId] Get plan on this location.
   * @param {number} [userId] Ger plan by this user. Used by organization administrators.
   * @param {number} [userPlanId] Get specific subscription by ID.
   * @param {SubscriptionStatus} [status] Service plan status filter.
   * @param {boolean} [getCard] Retrieve payment card information from the payment provider.
   * @param {string} sortOrder
   * @param {string} sortBy
   * @returns {Promise<Subscriptions>}
   */
  public getLocationSubscriptions(
    locationId?: number,
    userId?: number,
    userPlanId?: number,
    status?: SubscriptionStatus | SubscriptionStatus[],
    getCard?: boolean,
    sortOrder: string = 'desc',
    sortBy: string = 'endDateMs',
  ): Promise<Subscriptions> {
    const params: {
      sortCollection: string;
      locationId?: number;
      userId?: number;
      userPlanId?: number;
      status?: SubscriptionStatus | SubscriptionStatus[];
      sortOrder?: string;
      sortBy?: string;
      getCard?: boolean;
    } = {
      sortCollection: 'subscriptions',
    };

    if (locationId && !isNaN(locationId)) {
      if (locationId < 1) {
        return this.reject(`Location ID is incorrect [${locationId}].`);
      }
      params.locationId = locationId;
    }
    if (userId && !isNaN(userId)) {
      if (userId < 1) {
        return this.reject(`User ID is incorrect [${userId}].`);
      }
      params.userId = userId;
    }
    if (userPlanId && !isNaN(userPlanId)) {
      if (userPlanId < 1) {
        return this.reject(`User plan ID is incorrect [${userPlanId}].`);
      }
      params.userPlanId = userPlanId;
    }
    if (status) {
      params.status = status;
    }
    if (getCard) {
      params.getCard = !!getCard;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    if (sortBy) {
      params.sortBy = sortBy;
    }

    return this.authService.ensureAuthenticated().then(() => this.paidServicesApi.getLocationSubscriptions(params));
  }

  /**
   * Grants specified subscription to specified location(s).
   * @param {number} servicePlanId The Service Plan ID to assign.
   * @param {AssignServicesToLocationsModel} services
   * @param {number} [organizationId] Organization ID. Required if called by an organization administrator.
   * @param {string} [endDate] The end date of the subscription.
   */
  public grantSubscriptionToLocations(
    servicePlanId: number,
    services: AssignServicesToLocationsModel,
    organizationId?: number,
    endDate?: string,
  ): Promise<AssignServicesToLocationsApiResponse> {
    if (!servicePlanId && !isNaN(servicePlanId)) {
      if (servicePlanId < 1) {
        return this.reject(`Subscription ID is incorrect [${servicePlanId}].`);
      }
    }

    const params: {
      organizationId?: number;
      endDate?: string;
    } = {};

    if (organizationId && !isNaN(organizationId)) {
      if (organizationId < 1) {
        return this.reject(`Organization ID is incorrect [${organizationId}].`);
      }
      params.organizationId = organizationId;
    }
    if (endDate && endDate.length > 0) {
      params.endDate = endDate;
    }

    return this.authService
      .ensureAuthenticated()
      .then(() => this.paidServicesApi.assignServicesToLocations(servicePlanId, services, params));
  }

  /**
   * Grants specified subscription to the specified location.
   * @param {number} servicePlanId The Service Plan ID to assign.
   * @param {number} locationId Location ID to assign the service plan.
   * @param {number} [organizationId] Organization ID. Required if called by an organization administrator.
   * @param {string} [endDate] The end date of the subscription.
   * @returns {Promise<AssignServicesToLocationsApiResponse>}
   */
  public grantSubscriptionToSingleLocation(
    servicePlanId: number,
    locationId: number,
    organizationId?: number,
    endDate?: string,
  ): Promise<AssignServicesToLocationsApiResponse> {
    if (!servicePlanId && !isNaN(servicePlanId)) {
      if (servicePlanId < 1) {
        return this.reject(`Subscription ID is incorrect [${servicePlanId}].`);
      }
    }
    if (!locationId || isNaN(locationId) || locationId < 1) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    const params: {
      locationId: number;
      organizationId?: number;
      endDate?: string;
    } = {
      locationId: locationId,
    };

    if (organizationId && !isNaN(organizationId)) {
      if (organizationId < 1) {
        return this.reject(`Organization ID is incorrect [${organizationId}].`);
      }
      params.organizationId = organizationId;
    }
    if (endDate && endDate.length > 0) {
      params.endDate = endDate;
    }

    return this.authService
      .ensureAuthenticated()
      .then(() => this.paidServicesApi.assignServicesToLocations(servicePlanId, undefined, params));
  }

  /**
   * Upgrades the specified user plan (subscription) to the target plan (subscription).
   * @param {number} userPlanId Existing paid plan ID
   * @param {number} targetPlanId New service plan ID
   * @param {number} [userId] User ID on which account need to make changes. Can be used by a purchase administrator.
   * @param {UpgradeSubscriptionInfo} [upgradeModel] Additional service and bots to assign. Optional.
   * @returns {Promise<ApiResponseBase>}
   */
  public upgradeSubscription(
    userPlanId: number,
    targetPlanId: number,
    userId?: number,
    upgradeModel?: UpgradeSubscriptionInfo,
  ): Promise<ApiResponseBase> {
    if (userPlanId && !isNaN(userPlanId)) {
      if (userPlanId < 1) {
        return this.reject(`User plan ID is incorrect [${userPlanId}].`);
      }
    }
    if (targetPlanId && !isNaN(targetPlanId)) {
      if (targetPlanId < 1) {
        return this.reject(`Target plan ID is incorrect [${targetPlanId}].`);
      }
    }
    if (userId && !isNaN(userId)) {
      if (userId < 1) {
        return this.reject(`User ID is incorrect [${userId}].`);
      }
    }

    return this.authService.ensureAuthenticated().then(() =>
      this.paidServicesApi.upgradeSubscription(
        {
          userPlanId: userPlanId,
          targetPlanId: targetPlanId,
          userId: userId,
        },
        upgradeModel || {},
      ),
    );
  }

  /**
   * Cancels specified subscription for the specified location.
   * @param {number} servicePlanId The Service Plan ID to cancel.
   * @param {number} locationId Location ID to cancel the service plan.
   * @param {number} organizationId Organization ID. Required if called by an administrator.
   * @returns {Promise<ApiResponseBase>}
   */
  public cancelSubscription(servicePlanId: number, locationId?: number, organizationId?: number): Promise<ApiResponseBase> {
    const params: {
      locationId?: number;
      organizationId?: number;
    } = {};

    if (!servicePlanId || isNaN(servicePlanId) || servicePlanId < 1) {
      return this.reject(`Subscription ID is incorrect [${servicePlanId}].`);
    }
    if (locationId && !isNaN(locationId)) {
      if (locationId < 1) {
        return this.reject(`Location ID is incorrect [${locationId}].`);
      }
      params.locationId = locationId;
    }
    if (organizationId && !isNaN(organizationId)) {
      if (organizationId < 1) {
        return this.reject(`Organization ID is incorrect [${organizationId}].`);
      }
      params.organizationId = organizationId;
    }

    return this.authService.ensureAuthenticated().then(() => this.paidServicesApi.cancelSubscription(servicePlanId, params));
  }

  /**
   * Gets payment transactions history for the specified subscription (service plan).
   * @param {number} servicePlanId Subscription ID to get information for.
   * @param {number} [locationId] ID of the particular location to get information for.
   * @param {boolean} [upgradeDowngradeEventsOnly] Flag indicating we want to get only uprade/downgrade events history.
   * @returns {Promise<UserSubscriptionTransactions>}
   */
  public getSubscriptionTransactions(
    servicePlanId: number,
    locationId?: number,
    upgradeDowngradeEventsOnly?: boolean,
  ): Promise<UserSubscriptionTransactions> {
    const params: {
      locationId?: number;
      upgrade?: boolean;
    } = {};

    if (!servicePlanId || isNaN(servicePlanId) || servicePlanId < 1) {
      return this.reject(`Subscription ID is incorrect [${servicePlanId}].`);
    }
    if (locationId && !isNaN(locationId)) {
      if (locationId < 1) {
        return this.reject(`Location ID is incorrect [${locationId}].`);
      }
      params.locationId = locationId;
    }
    if (upgradeDowngradeEventsOnly) {
      params.upgrade = true;
    }

    return this.authService.ensureAuthenticated().then(() => this.paidServicesApi.getSubscriptionTransactions(servicePlanId, params));
  }

  /**
   * Gets transactions history for the specified subscription (service plan) which triggered subscription change (upgrade/downgrade).
   * @param {number} servicePlanId Subscription ID to get information for.
   * @param {number} [locationId] ID of the particular location to get information for.
   * @returns {Promise<UserSubscriptionTransactions>}
   */
  public getSubscriptionUpgradeDowngradeHistory(servicePlanId: number, locationId?: number): Promise<UserSubscriptionTransactions> {
    if (!servicePlanId || isNaN(servicePlanId) || servicePlanId < 1) {
      return this.reject(`Subscription ID is incorrect [${servicePlanId}].`);
    }
    if (locationId && !isNaN(locationId)) {
      if (locationId < 1) {
        return this.reject(`Location ID is incorrect [${locationId}].`);
      }
    }
    return this.getSubscriptionTransactions(servicePlanId, locationId, true);
  }

  /**
   * Provide purchase information like a subscription ID or a receipt or a nonce, which proofs that the purchase has been made at the given payment provider (payment type).
   * @param {NewPurchaseInfo} purchaseInfo Purchase information.
   * @param {number} locationId Location ID to purchase subscription for.
   * @param {PaymentType} [paymentType] Payment type (payment provider).
   * @param {number} [userId] Purchase as specific user. For Admin usage.
   * @param {number} [priceId] Service plan price ID. Do not provide for paymentType = 4 (Chargify).
   * @param {boolean} [sandbox] Set to true, if need to test the process on sandbox payment provider service. Available only for paymentType = 3 (Braintree).
   * @returns {Promise<ApiResponseBase>}
   */
  public provideNewPurchaseInfo(
    purchaseInfo: NewPurchaseInfo,
    locationId: number,
    paymentType?: PaymentType,
    userId?: number,
    priceId?: number,
    sandbox?: boolean,
  ): Promise<ApiResponseBase> {
    if (!locationId || isNaN(locationId) || locationId < 1) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    const params: {
      locationId: number;
      priceId?: number;
      userId?: number;
      sandbox?: boolean;
      paymentType?: PaymentType;
    } = {
      locationId: locationId,
    };

    if (userId && !isNaN(userId)) {
      if (userId < 1) {
        return this.reject(`User ID is incorrect [${userId}].`);
      }
      params.userId = userId;
    }
    if (priceId && !isNaN(priceId)) {
      if (priceId < 1) {
        return this.reject(`Service plan price ID is incorrect [${priceId}].`);
      }
      // Do not use priceId for Chargify
      if (paymentType !== PaymentType.Chargify) {
        params.priceId = priceId;
      }
    }

    // Use sandbox flag only for Braintree
    if (!!sandbox && paymentType === PaymentType.Braintree) {
      params.sandbox = true;
    }
    if (paymentType && !isNaN(paymentType)) {
      params.paymentType = paymentType;
    }
    return this.authService.ensureAuthenticated().then(() => this.paidServicesApi.provideNewPurchaseInfo(purchaseInfo, params));
  }

  /**
   * Update purchase information like a receipt or a subscription ID for an existing user service plan, or update payment profile for existing subscription if
   * 'paymentToken' is specified.
   * @param {UpdatePurchaseInfo} updatePurchaseInfo Subscription details.
   * @param {number} userPlanId The User Service Plan ID to update.
   * @param {number} locationId Location ID.
   * @param {number} [userId] Act as specific user.
   * @returns {Promise<ApiResponseBase>}
   */
  public updatePurchaseInfo(
    updatePurchaseInfo: UpdatePurchaseInfo,
    userPlanId: number,
    locationId: number,
    userId?: number,
  ): Promise<ApiResponseBase> {
    if (!userPlanId || isNaN(userPlanId) || userPlanId < 1) {
      return this.reject(`Service plan price ID is incorrect [${userPlanId}].`);
    }
    if (!locationId || isNaN(locationId) || locationId < 1) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    const params: {
      userPlanId: number;
      locationId: number;
      userId?: number;
    } = {
      userPlanId: userPlanId,
      locationId: locationId,
    };

    if (userId && !isNaN(userId)) {
      if (userId < 1) {
        return this.reject(`User ID is incorrect [${userId}].`);
      }
      params.userId = userId;
    }

    return this.authService.ensureAuthenticated().then(() => this.paidServicesApi.updatePurchaseInfo(updatePurchaseInfo, params));
  }

  /**
   * Returns existing payment profiles if related customer already exists in Chargify and have any valid payment profiles.
   * The customer in Chargify is uniquely identified by the user ID (specified in the parameters or identified by the API key),
   * however, you can specify the "customerId" if you know it and want to conduct additional verification.
   * @param params Request parameters.
   * @param {PaymentType} [params.paymentType] Payment type (payment provider)
   * @param {number} [params.userId] Used by administrators to specify another user.
   * @param {string} [params.customerId] Customer ID from external payment service (if known)
   * @param {boolean} [params.includeDisabled] Include disabled profiles into the result. Default is false.
   * @param {boolean} [params.appName] PPC cloud related appName (brand). Required if paymentType=4
   */
  getUserPaymentProfiles(params: {
    paymentType: PaymentType;
    userId?: number;
    customerId?: string;
    includeDisabled?: boolean;
    appName?: string;
  }): Promise<GetUserPaymentProfilesApiResponse> {
    return this.authService.ensureAuthenticated().then(() => this.paidServicesApi.getUserPaymentProfiles(params));
  }
}

export interface NewPurchaseInfo extends NewPurchaseInfoModel {
}

export interface UpdatePurchaseInfo extends UpdatePurchaseInfoModel {
}

export interface UpgradeSubscriptionInfo extends UpgradeSubscriptionInfoModel {
}

export interface UserSubscriptionTransactions extends GetSubscriptionTransactionsApiResponse {
}

export interface ServicePlans extends GetSoftwareSubscriptionsApiResponse {
}

export interface Subscriptions extends GetLocationSubscriptionsApiResponse {
}

export interface UserPaymentProfiles extends GetUserPaymentProfilesApiResponse {
}
