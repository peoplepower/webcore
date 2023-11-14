import { AppApiDal } from '../appApiDal';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { inject, injectable } from '../../../../modules/common/di';
import { CreateUserAndLocationApiResponse, CreateUserAndLocationModel } from './createUserAndLocationApiResponse';
import { GetSignaturesApiResponse } from './getSignaturesApiResponse';
import { GetUserInformationApiResponse } from './getUserInformationApiResponse';
import { SendVerificationMessageApiResponse, VerificationType } from './sendVerificationMessageApiResponse';
import { BadgeType, ResetBadgesApiResponse } from './resetBadgesApiResponse';
import { UpdateUserApiResponse, UpdateUserModel } from './updateUserApiResponse';
import { GetPronounsApiResponse } from './getPronounsApiResponse';

/**
 * User Accounts API.
 * See {@link http://docs.iotapps.apiary.io/#reference/user-accounts}
 */
@injectable('UserAccountsApi')
export class UserAccountsApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  // #region -------------------- User and location --------------------

  /**
   * Create User and Location.
   * See {@link http://docs.iotapps.apiary.io/#reference/user-accounts/manage-a-user/create-user-and-location}
   *
   * When creating a new user, the email address field and appName are mandatory.
   * If the password is not set, the user account will be created, but the user will not be able to login and will have to go throw the password renew process.
   * Although it's not required, we recommend creating a default Location when creating a new user account.
   *  The API returns registered user ID and a new API key. A new user account can be created by an existing user. In this case the API key must be used.
   * Otherwise an operation token of type 1 must be provided.
   *
   * @param {CreateUserAndLocationModel} userModel User and Location information.
   * @param {string} [operationToken] Operation token.
   * @param {boolean} [noApiKey] Set to 'true' to avoid adding of ApiKey. Default is 'false'.
   * @param {boolean} [strongPassword] Set to 'true' for full password test.
   * @returns {Promise<CreateUserAndLocationApiResponse>}
   */
  createUserAndLocation(
    userModel: CreateUserAndLocationModel,
    operationToken?: string,
    noApiKey: boolean = false,
    strongPassword: boolean = false
  ): Promise<CreateUserAndLocationApiResponse> {
    // Make sure the headers collection initialized as empty to avoid chances the code using it will crash
    return this.dal.post('user', userModel, {
      noAuth: noApiKey,
      headers: operationToken ? {PPCAuthorization: 'op token=' + operationToken} : {},
      params: strongPassword ? {strongPassword: true} : {}
    });
  }

  /**
   * Delete specified or current user completely.
   * Any legal agreements the user signed will be retained in the backend.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/manage-a-user/delete-user}
   *
   * @param {number} [userId] User ID. Used by administrators to delete another user's account.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteUser(userId?: number): Promise<ApiResponseBase> {
    return this.dal.delete('user', {params: {userId: userId}});
  }

  /**
   * This API can copy (merge) deleted user account resources to other user account.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/manage-a-user/delete-user}
   *
   * @param {number} userToDeleteId User ID to delete and merge
   * @param {number} destinationUserId Merge destination user ID
   * @returns {Promise<ApiResponseBase>}
   */
  mergeAndDeleteUser(userToDeleteId: number, destinationUserId: number): Promise<ApiResponseBase> {
    return this.dal.delete('user', {
      params: {
        userId: userToDeleteId,
        mergeUserId: destinationUserId,
        merge: true,
      },
    });
  }

  /**
   * Obtain all the information previously stored on this user, user permissions, locations, etc.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/manage-a-user/get-user-information}
   *
   * @param [params] Request parameters.
   * @param {number|string} [params.userId] User ID. This parameter is used by administrator accounts to receive a specific user's account.
   * @param {number|string} [params.organizationId] Organization ID to get user from a specific organization.
   * @param {boolean} [noApiKey] Set to 'true' to avoid adding of ApiKey.
   * @returns {Promise<GetUserInformationApiResponse>}
   */
  getUserInformation(
    params?: {
      userId?: number | string;
      organizationId?: number | string;
    },
    noApiKey: boolean = false,
  ): Promise<GetUserInformationApiResponse> {
    return this.dal.get('user', {params: params, noAuth: noApiKey});
  }

  /**
   * Update the user's information. All fields are optional.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/manage-a-user/update-user}
   *
   * @param {UpdateUserModel} user User model. All fields are optional.
   * @param {number} [userId] User ID. Optional parameter. This parameter is used by administrator accounts to update a specific user's account.
   * @returns {Promise<UpdateUserApiResponse>}
   */
  updateUser(user: UpdateUserModel, userId?: number): Promise<UpdateUserApiResponse> {
    return this.dal.put('user', user, {params: {userId: userId}});
  }

  // #endregion

  // #region ------------------ User Tags -------------------

  /**
   * Apply tag to the current user (current user = API_KEY owner).
   * Tags will not be applied to admins
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/user-tags/apply-tag}
   *
   * @param {string} tag Tag value.
   * @returns {Promise<ApiResponseBase>}
   */
  applyUserTag(tag: string): Promise<ApiResponseBase> {
    return this.dal.put(`usertags/${encodeURIComponent(tag)}`);
  }

  /**
   * Delete tag from list of current user tags.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/user-tags/delete-tag}
   *
   * @param {string} tag Tag value.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteUserTag(tag: string): Promise<ApiResponseBase> {
    return this.dal.delete(`usertags/${encodeURIComponent(tag)}`);
  }

  // #endregion

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
    return this.dal.put(`termsOfServices/${encodeURIComponent(signatureId)}`, {});
  }

  /**
   * Retrieve all of the Terms of Service agreement signature identifiers to which the user has previously agreed.
   * See {@link http://docs.iotapps.apiary.io/#reference/user-accounts/get-terms-of-service/get-signatures}
   * @param {string} [userId] Optional UserId to get signatures of particular user (Allowed for admins only)
   * @returns {Promise<GetSignaturesApiResponse>}
   */
  getSignatures(userId?: number): Promise<GetSignaturesApiResponse> {
    let params;
    if (userId) {
      params = {
        userId: userId,
      };
    }
    return this.dal.get('termsOfServices', {
      params: params,
    });
  }

  // #endregion

  // #region -------------------- Password reset and verification --------------------

  /**
   * The app calls this API to submit a new password.
   * End users must provide either a temporary API key sent by email or a regular user API key and the old password.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/recover-password/put-new-password}
   *
   * @param {string} newPassword New password
   * @param {string} tempApiKey Temporary API key
   * @param [params] Request parameters
   * @param {string|undefined} [params.brand] A parameter identifying an Ensemble Customer specific email template, among other customization settings.
   * @param {string|undefined} [params.appName] App name to identify the brand
   * @param {string|undefined} [params.passcode] SMS passcode if it was sent (this API can return resultCode=17 which force user to enter passcode)
   * @param {number|undefined} [params.smsPrefix] Passcode SMS prefix type to automatically parse it by the app: 1 = Google <#>
   * @param {string|undefined} [params.appHash] 11-character app hash
   * @param {boolean|undefined} [params.strongPassword] Check if the password is strong
   * @param {boolean|undefined} [params.keepKeyVersion] Keep the current user key version to keep previously generated API keys active
   * @returns {Promise<ApiResponseBase>}
   */
  newPasswordByTempKey(
    newPassword: string,
    tempApiKey: string,
    params?: {
      brand?: string;
      passcode?: string;
      smsPrefix?: number;
      appHash?: string;
      strongPassword?: boolean;
      keepKeyVersion?: boolean;
    },
  ): Promise<ApiResponseBase> {
    let {passcode, ...urlParams} = params || {};
    return this.dal.put(
      'newPassword',
      {
        newPassword: newPassword,
        passcode: passcode,
      },
      {
        params: urlParams,
        headers: {
          API_KEY: tempApiKey,
        },
        noAuth: true,
      },
    );
  }

  /**
   * The app calls this API to submit a new password.
   * To drop the password with 2-factor auth:
   * 1) Pass the old password, the new password. Server will send 2-factor passcode
   * 2) Pass passcode
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/recover-password/put-new-password}
   *
   * @param {string} newPassword New password
   * @param {string} oldPassword Old password
   * @param {string|undefined} passcode Passcode for 2-factor auth
   * @param [params] Request parameters
   * @param {string|undefined} [params.brand] A parameter identifying an Ensemble Customer specific email template, among other customization settings.
   * @param {boolean|undefined} [params.strongPassword] Check if the password is strong
   * @param {boolean|undefined} [params.keepKeyVersion] Keep the current user key version to keep previously generated API keys active
   * @returns {Promise<ApiResponseBase>}
   */
  newPassword(
    newPassword: string,
    oldPassword: string,
    passcode?: string,
    params?: {
      brand?: string;
      strongPassword?: boolean;
      keepKeyVersion?: boolean;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.put(
      'newPassword',
      {
        newPassword: newPassword,
        oldPassword: oldPassword,
        passcode: passcode,
      },
      {
        params: params,
      },
    );
  }

  /**
   * Recover user's password.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/recover-password/send-a-recover-password-email}
   *
   * Send an email to the user containing a link to a temporary page which is valid for the
   * next hour, to reset the password.
   *
   * @param params Request parameters
   * @param {string} params.username The username, which is typically the user's email address.
   * @param {string} [params.brand] A parameter identifying an Ensemble Customer specific email template, among other customization settings.
   * @returns {Promise<ApiResponseBase>}
   */
  recoverPassword(params: { username: string; brand?: string; }): Promise<ApiResponseBase> {
    return this.dal.get('newPassword', {
      params: params,
    });
  }

  /**
   * Provide verification code to email or by SMS.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/verify-email-address-or-phone-number/provide-verification-code}
   *
   * @param params Request parameters.
   * @param {string} params.code Code sent to the user in email or SMS.
   * @param {VerificationType} params.type Code type.
   * @returns {Promise<ApiResponseBase>}
   */
  provideVerificationCode(params: { code: string; type: VerificationType }): Promise<ApiResponseBase> {
    return this.dal.put('emailVerificationMessage', {}, {params: params});
  }

  /**
   * Send an email or an SMS to the user containing a link to a temporary page which is valid for one day and/or a verification code.
   * Used to verify the email address or if this phone number able to receive SMS.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/verify-email-address-or-phone-number/send-a-verification-message}
   *
   * @param params Request parameters
   * @param {string} [params.brand] A parameter identifying an Ensemble Customer's specific email template, among other customization settings.
   * @param {string} [params.appName] App name to identify the brand.
   * @param {VerificationType} [params.type] Message type.
   * @returns {Promise<SendVerificationMessageApiResponse>}
   */
  sendVerificationMessage(params: {
    brand?: string;
    appName?: string;
    type?: VerificationType;
  }): Promise<SendVerificationMessageApiResponse> {
    return this.dal.get('emailVerificationMessage', {params: params});
  }

  // #endregion

  /**
   * Reset application badges.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/badges/reset-badges}
   *
   * A badge is a red number that appears over an app's icon, indicating to the user that the app has something new to share.
   *
   * @param params Request parameters.
   * @param {BadgeType} [params.type] If this is not provided, all badge counts will be reset.
   * @returns {Promise<ResetBadgesApiResponse>}
   */
  resetBadges(params?: { type?: BadgeType }): Promise<ResetBadgesApiResponse> {
    return this.dal.put('badges', {}, {params: params});
  }

  // #region -------------------- Pronouns --------------------

  /**
   * User pronouns are used to create a sentence like "{She} went to bed at 9:00 PM. {She} took {her} medicine at 10:00 AM."
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/pronoun/get-pronouns}
   *
   * @param params Request parameters
   * @param {string} [params.language] language filter
   * @returns {Promise<GetPronounsApiResponse>}
   */
  getPronouns(params: {
    brand?: string;
    appName?: string;
    type?: VerificationType;
  }): Promise<GetPronounsApiResponse> {
    return this.dal.get('pronouns', {params: params});
  }

  // #endregion
}
