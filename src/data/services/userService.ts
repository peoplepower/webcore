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

@injectable('UserService')
export class UserService extends BaseService {
  public readonly onCurrentUserInfoUpdated: LiteEvent<UserInformation> = new LiteEvent<UserInformation>();

  @inject('AuthService') protected readonly authService: AuthService;
  @inject('UserAccountsApi') protected readonly userAccountsApi: UserAccountsApi;
  @inject('SystemAndUserPropertiesApi') protected readonly systemAndUserPropertiesApi: SystemAndUserPropertiesApi;

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
   * @param {number} userId
   * @param {number} organizationId
   * @returns {Promise<UserInformation>}
   */
  public getUserInfo(userId: number, organizationId?: number): Promise<UserInformation> {
    return this.authService.ensureAuthenticated().then(() =>
      this.userAccountsApi.getUserInformation({
        userId: userId,
        organizationId: organizationId,
      }),
    );
  }

  /**
   * Updates user information with the data from supplied model
   * @param {UserModel} user Model with data to update with
   * @param {number} [userId] Id of the user to update. Allowed for administrator users only.
   * @returns {Promise<UpdateUserResponse>}
   */
  public updateUserInfo(user: UserModel, userId?: number): Promise<UpdateUserResponse> {
    return this.authService.ensureAuthenticated().then(() => this.userAccountsApi.updateUser({ user: user }, userId));
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
  public recoverPassword(username: string, brand?: string, appName?: string): Promise<RecoverPasswordInfo> {
    return this.userAccountsApi.recoverPassword({
      username: username,
      brand: brand,
      appName: appName,
    });
  }

  /**
   * Register as new user.
   * @param {CreateUserAndLocationModel} user
   * @param {string} [operationToken]
   * @param {boolean} [strongPassword] Set to 'true' for full password test.
   * @returns {Promise<UserCreationResult>}
   */
  public registerNewUser(user: CreateUserAndLocationModel, operationToken?: string, strongPassword?: boolean): Promise<UserCreationResult> {
    return this.userAccountsApi.createUserAndLocation(user, operationToken, false, strongPassword);
  }

  /**
   * Creates specified user using supplied data. Usually used by Maestro administrators.
   * @param {CreateUserAndLocationModel} user
   * @returns {Promise<UserCreationResult>}
   */
  public createNewUser(user: CreateUserAndLocationModel): Promise<UserCreationResult> {
    return this.authService.ensureAuthenticated().then(() => this.userAccountsApi.createUserAndLocation(user));
  }

  /**
   * Get current user properties
   * @returns {Promise<UserProperties>}
   */
  public getCurrentUserProperties(): Promise<UserProperties> {
    return this.getCurrentUserInfo().then((userInfo) => {
      return this.systemAndUserPropertiesApi.getUserProperties({ userId: userInfo.user.id });
    });
  }

  /**
   * Gets list of user properties according to parameters.
   * @param {number} userId
   * @param {string|string[]} propertyName
   * @returns {Promise<UserProperties>}
   */
  public getUserProperties(userId?: number, propertyName?: string | string[]): Promise<UserProperties> {
    return this.systemAndUserPropertiesApi.getUserProperties({ name: propertyName, userId: userId });
  }

  /**
   * Gets value of the specified user or system property.
   * @param {string} propertyName
   * @returns {Promise<string>}
   */
  public getUserOrSystemPropertyValue(propertyName: string): Promise<string> {
    return this.systemAndUserPropertiesApi.getUserOrSystemProperty(propertyName);
  }

  /**
   * Saves supplied properties array to the server.
   * @param properties
   * @param {number} userId
   * @returns {Promise<ApiResponseBase>}
   */
  public updateUserProperties(properties: Array<{ name: string; content: any }>, userId?: number): Promise<ApiResponseBase> {
    return this.systemAndUserPropertiesApi.updateUserProperties({ property: properties }, { userId: userId });
  }

  // #region -------------------- Terms Of Service --------------------

  /**
   * Adds a unique signature identifier to the list of agreements the user has signed.
   * See {@link http://docs.iotapps.apiary.io/#reference/user-accounts/sign-terms-of-service/sign-terms-of-service}
   *
   * We recommend selecting agreement signature strings of the format {appName}_{agreement version number} or {appName}_{feature}_{agreement version number}.
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

export interface UserProperties extends GetUserPropertiesApiResponse {}

export interface UpdateUserResponse extends UpdateUserApiResponse {}

export interface UserInformation extends GetUserInformationApiResponse {}

export interface RecoverPasswordInfo extends ApiResponseBase {}

export interface UserCreationResult extends CreateUserAndLocationApiResponse {}

export interface UserProperties extends GetUserPropertiesApiResponse {}
