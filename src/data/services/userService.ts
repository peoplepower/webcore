import { inject, injectable } from '../../modules/common/di';
import { ApiResponseBase } from '../models/apiResponseBase';
import { AuthService } from './authService';
import { UserAccountsApi } from '../api/app/userAccounts/userAccountsApi';
import { GetUserInformationApiResponse } from '../api/app/userAccounts/getUserInformationApiResponse';
import { LiteEvent } from '../../modules/common/liteEvent';
import { UpdateUserApiResponse, UserModel } from '../api/app/userAccounts/updateUserApiResponse';
import { SystemAndUserPropertiesApi } from '../api/app/systemAndUserProperties/systemAndUserPropertiesApi';
import { CreateUserAndLocationApiResponse, CreateUserAndLocationModel } from '../api/app/userAccounts/createUserAndLocationApiResponse';
import { GetUserPropertiesApiResponse } from '../api/app/systemAndUserProperties/getUserPropertiesApiResponse';
import { BaseService } from './baseService';
import { GetSignaturesApiResponse } from '../api/app/userAccounts/getSignaturesApiResponse';
import { UpdateUserPropertiesModel } from "../api/app/systemAndUserProperties/updateUserPropertiesApiResponse";
import { GetUserOrSystemPropertyApiResponse } from "../api/app/systemAndUserProperties/getUserOrSystemPropertyApiResponse";

@injectable('UserService')
export class UserService extends BaseService {
  public readonly onCurrentUserInfoUpdated: LiteEvent<UserInformation> = new LiteEvent<UserInformation>();

  @inject('AuthService') protected readonly authService!: AuthService;
  @inject('UserAccountsApi') protected readonly userAccountsApi!: UserAccountsApi;
  @inject('SystemAndUserPropertiesApi') protected readonly systemAndUserPropertiesApi!: SystemAndUserPropertiesApi;

  private currentUserInfo: UserInformation | undefined;
  private initCurrentUserInfoPromise: Promise<UserInformation> | undefined;
  private getCurrentUserInfoPromise: Promise<UserInformation> | undefined;

  constructor() {
    super();
    let me = this;
    setTimeout(() => {
      me.init();
    });
  }

  /**
   * Get current user info
   * @param {boolean} [force] set it true to get information from server (ignore cached value)
   * @returns {Promise<UserInformation>}
   */
  public getCurrentUserInfo(force?: boolean): Promise<UserInformation> {
    let me = this;
    if (me.getCurrentUserInfoPromise) {
      return Promise.resolve(me.getCurrentUserInfoPromise);
    }
    if (me.currentUserInfo && !force) {
      return Promise.resolve(me.currentUserInfo);
    }
    me.getCurrentUserInfoPromise = me.authService
      .ensureAuthenticated()
      .then(() => {
        return me.initCurrentUserInfo(force);
      })
      .then(
        (data) => {
          delete me.getCurrentUserInfoPromise;
          return data;
        },
        (error) => {
          delete me.getCurrentUserInfoPromise;
          return Promise.reject(error);
        },
      );
    return Promise.resolve(me.getCurrentUserInfoPromise);
  }

  /**
   * Gets user information.
   * @param {number} [userId]
   * @param {number} [organizationId]
   * @returns {Promise<UserInformation>}
   */
  public getUserInfo(userId?: number, organizationId?: number): Promise<UserInformation> {
    return this.authService.ensureAuthenticated().then(() =>
      this.userAccountsApi.getUserInformation({
        userId: userId,
        organizationId: organizationId,
      })
    );
  }

  /**
   * Updates user information with the data from supplied model
   * @param {UserModel} user Model with data to update with
   * @param {number} [userId] ID of the user to update. Allowed for administrator users only.
   * @param [params] Request parameters.
   * @param {number} [params.userId] User ID to update.
   * @param {number} [params.organizationId] Organization ID to get brand name.
   * @param {string} [params.brand] Brand name for the notification.
   * @returns {Promise<UpdateUserResponse>}
   */
  public updateUserInfo(
    user: UserModel,
    userId?: number,
    params?: {
      userId?: number,
      organizationId?: number,
      brand?: string
    }
  ): Promise<UpdateUserResponse> {
    params = params || {};
    if (userId && !isNaN(userId)) {
      params.userId = userId;
    }

    return this.authService.ensureAuthenticated()
      .then(() => this.userAccountsApi.updateUser({user: user}, params));
  }

  /**
   * This API can copy (merge) deleted user account resources to other user account.
   * @param {number} userToDeleteId User ID to delete and merge.
   * @param {number} destinationUserId Merge destination user ID
   * @returns {Promise<ApiResponseBase>}
   */
  public mergeAndDeleteUser(userToDeleteId: number, destinationUserId: number): Promise<ApiResponseBase> {
    return this.authService.ensureAuthenticated().then(() => this.userAccountsApi.mergeAndDeleteUser(userToDeleteId, destinationUserId));
  }

  /**
   * Delete specified of current user account completely.
   * @param {number} userId User ID to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteUser(userId?: number): Promise<ApiResponseBase> {
    return this.authService.ensureAuthenticated().then(() => this.userAccountsApi.deleteUser(userId));
  }

  /**
   * Requests user password recover.
   * @returns {Promise<RecoverPasswordInfo>}
   */
  public recoverPassword(username: string, brand?: string): Promise<RecoverPasswordInfo> {
    return this.userAccountsApi.recoverPassword({
      username: username,
      brand: brand,
    });
  }

  /**
   * Register as new user.
   * @param {CreateUserAndLocationModel} user
   * @param {string} [operationToken]
   * @param {boolean} [strongPassword] Set to 'true' for full password test.
   * @param {string} [brand] Brand name for the user registration email.
   * @returns {Promise<UserCreationResult>}
   */
  public registerNewUser(user: CreateUserAndLocationModel, operationToken?: string, strongPassword?: boolean, brand?: string): Promise<UserCreationResult> {
    let params = {
      strongPassword: !!strongPassword,
      brand: brand || void 0,
    };

    return this.userAccountsApi.createUserAndLocation(user, operationToken, true, params);
  }

  /**
   * Creates specified user using supplied data. Usually used by Maestro administrators.
   * @param {CreateUserAndLocationModel} user
   * @param {boolean} [strongPassword] Kept for the backward compatibility.
   * @param params Requested parameters.
   * @param {boolean} [params.strongPassword] Set to 'true' for full password test.
   * @param {number} [params.organizationId] Organization ID to create user with the specified brand.
   * @param {string} [params.brand] Brand name for the user registration email.
   * @returns {Promise<UserCreationResult>}
   */
  public createNewUser(
    user: CreateUserAndLocationModel,
    strongPassword?: boolean,
    params?: {
      strongPassword?: boolean,
      organizationId?: number,
      brand?: string
    }
  ): Promise<UserCreationResult> {
    params = params || {};

    return this.authService.ensureAuthenticated()
      .then(() => this.userAccountsApi.createUserAndLocation(user, void 0, false, params));
  }

  // #region -------------------- User and System Properties --------------------

  /**
   * Gets value of the specified system property.
   * @param {string} propertyName system property name
   * @returns {Promise<string>}
   */
  public getSystemPropertyValue(propertyName: string): Promise<string> {
    return this.systemAndUserPropertiesApi.getSystemProperty(propertyName);
  }

  /**
   * This API will first attempt to return a user-specific property value in plain text.
   * If there is no user-specific property set, it will attempt to return a system-wide property value as plain text,
   *  otherwise it will return no content.
   *
   * @param {string} propertyName user or system property name
   * @param {number} [userId] User ID, used by an account with administrative privileges to retrieve the properties of another user.
   * @returns {Promise<GetUserOrSystemPropertyApiResponse>}
   */
  public getUserOrSystemPropertyValue(propertyName: string, userId?: number): Promise<GetUserOrSystemPropertyApiResponse> {
    return this.systemAndUserPropertiesApi.getUserOrSystemProperty(propertyName, userId);
  }

  /**
   * Gets list of user properties
   * @param {string|string[]} [propertyName] User property name or optional name prefix to filter properties.
   *   Multiple values are supported.
   *   Provide no value to get all available properties
   * @param {number} [userId] User ID, used by an account with administrative privileges to retrieve the properties of another user
   * @returns {Promise<UserProperties>}
   */
  public getUserProperties(propertyName?: string | string[], userId?: number): Promise<UserProperties> {
    return this.systemAndUserPropertiesApi.getUserProperties({name: propertyName, userId: userId});
  }

  /**
   * Saves supplied properties array to the server.
   * @param {Array<{ name: string; content: any; }>} properties Properties to update
   * @param {number} [userId] User ID, used by an account with administrative privileges to update the properties for another user
   * @returns {Promise<ApiResponseBase>}
   */
  public updateUserProperties(properties: UpdateUserPropertiesModel['property'], userId?: number): Promise<ApiResponseBase> {
    return this.systemAndUserPropertiesApi.updateUserProperties({property: properties}, {userId: userId});
  }

  // #endregion

  // #region -------------------- Terms Of Service --------------------

  /**
   * Adds a unique signature identifier to the list of agreements the user has signed.
   * See {@link http://docs.iotapps.apiary.io/#reference/user-accounts/sign-terms-of-service/sign-terms-of-service}
   *
   * We recommend selecting agreement signature strings of the format {appName}_{agreement version number} or
   * {appName}_{feature}_{agreement version number}.
   *
   * @param {string} signatureId Terms of Service ID.
   * @returns {Promise<ApiResponseBase>}
   */
  signTermsOfService(signatureId: string): Promise<ApiResponseBase> {
    return this.authService.ensureAuthenticated().then(() => this.userAccountsApi.signTermsOfService(signatureId));
  }

  /**
   * Retrieve all of the Terms of Service agreement signature identifiers to which the user has previously agreed.
   * See {@link http://docs.iotapps.apiary.io/#reference/user-accounts/get-terms-of-service/get-signatures}
   * @param {string} [userId] Optional UserId to get signatures of particular user (Allowed for admins only)
   * @returns {Promise<GetSignaturesApiResponse>}
   */
  getSignatures(userId?: number): Promise<GetSignaturesApiResponse> {
    return this.authService.ensureAuthenticated().then(() => this.userAccountsApi.getSignatures(userId));
  }

  // #endregion

  private init() {
    let me = this;
    me.authService.ensureAuthenticated().then(function () {
      me.initCurrentUserInfo();
      me.authService.onLogin.on(() => {
        me.initCurrentUserInfo();
      });
      me.authService.onLogout.on(() => {
        me.clearCurrentUserInfo();
      });
    });
  }

  private initCurrentUserInfo(force?: boolean): Promise<UserInformation> {
    let me = this;
    if (me.initCurrentUserInfoPromise) {
      return Promise.resolve(me.initCurrentUserInfoPromise);
    }
    if (me.currentUserInfo && !force) {
      return Promise.resolve(me.currentUserInfo);
    }
    me.initCurrentUserInfoPromise = me.userAccountsApi.getUserInformation().then(function (userInfo) {
      // me.logger.debug('User info loaded', userInfo);
      me.currentUserInfo = userInfo;
      delete me.initCurrentUserInfoPromise;
      me.onCurrentUserInfoUpdated.trigger(me.currentUserInfo);
      return userInfo;
    });
    return Promise.resolve(me.initCurrentUserInfoPromise);
  }

  private clearCurrentUserInfo(): void {
    delete this.currentUserInfo;
    // this.logger.debug('User info cleared');
    this.onCurrentUserInfoUpdated.trigger(undefined);
  }
}

export interface UserProperties extends GetUserPropertiesApiResponse {
}

export interface UpdateUserResponse extends UpdateUserApiResponse {
}

export interface UserInformation extends GetUserInformationApiResponse {
}

export interface RecoverPasswordInfo extends ApiResponseBase {
}

export interface UserCreationResult extends CreateUserAndLocationApiResponse {
}
