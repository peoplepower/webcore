import { AppApiDal } from '../appApiDal';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { GetOperationTokenApiResponse, OperationTokenType } from './getOperationTokenApiResponse';
import { ApiKeyType, LoginApiResponse } from './loginApiResponse';
import { inject, injectable } from '../../../../modules/common/di';
import { PasscodeMessagePrefix, PasscodeNotificationType, SendPasscodeApiResponse } from './sendPasscodeApiResponse';

/**
 * Login, logout and operation token features.
 * See {@link https://iotapps.docs.apiary.io/#reference/login-and-logout}
 */
@injectable('AuthApi')
export class AuthApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Generate a new operation token, which can be used in other API calls instead of optional API key.
   * Token is valid exactly between two time values in ms and can be used only once.
   * See {@link http://docs.iotapps.apiary.io/#reference/login-and-logout/operation-token/get-operation-token}
   *
   * The token value should be provided in the PPCAuthorization HTTP header as 'op token=123ABC'.
   *
   * @param {OperationTokenType} type Token type.
   * @returns {Promise<GetOperationTokenApiResponse>}
   */
  getOperationToken(type: OperationTokenType): Promise<GetOperationTokenApiResponse> {
    return this.dal.get('token', {
      params: {
        type: type,
      },
    });
  }

  /**
   * Allows a user to login using their private credentials (username and password).
   * See {@link http://docs.iotapps.apiary.io/#reference/login-and-logout/login/login-by-username-and-password}
   *
   * This request returns an API key which is linked to the user, and will be used in all future API calls.
   *
   * @param {string} username The username, typically an email address or phone.
   * @param {string} pwd User password.
   *
   * @param [params] Request parameters.
   * @param {number} [params.expiry] API key expiration period in days, nonzero. By default, this is set to -1, which means the key will never expire.
   * @param {string} [params.clientId] Short application client ID to generate a specific user API key.
   * @param {string} [params.passcode] Temporary pass code for one-time login.
   * @param {ApiKeyType} [params.keyType] Key type, 0 - User (default), 11 - Admin.
   * @returns {Promise<LoginApiResponse>}
   */
  login(
    username: string,
    pwd: string | undefined,
    params?: {
      passcode?: string;
      expiry?: number;
      clientId?: string;
      keyType?: ApiKeyType;
    },
  ): Promise<LoginApiResponse> {
    params = params || {};

    // HTTP headers limited to ISO-8859-1 characters, so if we want to pass UTF symbols, we need to encode them
    // Now server decode password header in that way: URLDecoder.decode(password, Constants.UTF8)
    // So we can use encodeURIComponent function for encoding
    // See @link{https://docs.oracle.com/javase/8/docs/api/java/net/URLDecoder.html#decode-java.lang.String-java.lang.String-}
    let headers: { [headerName: string]: string } = {};
    if (pwd) {
      headers['PASSWORD'] = encodeURIComponent(pwd);
    }
    if (params.passcode) {
      headers['passcode'] = encodeURIComponent(params.passcode);
    }

    return this.dal.get('login', {
      params: {
        username: username,
        expiry: params.expiry,
        clientId: params.clientId,
        keyType: params.keyType,
      },
      headers: headers,
    });
  }

  /**
   * Logout the user and securely remove the API key from the server database. All application instances for this user are simultaneously logged out.
   * See {@link http://docs.iotapps.apiary.io/#reference/login-and-logout/logout/logout}
   * @returns {Promise<ApiResponseBase>}
   */
  logout(): Promise<ApiResponseBase> {
    return this.dal.get('logout');
  }

  /**
   * This login API allows the user to log in with an existing API key instead of username and password.
   * Request can also be used generate a temporary key that is valid for only a brief amount of time.
   * See {@link http://docs.iotapps.apiary.io/#reference/login-and-logout/login-with-an-existing-api-key/login-by-key}
   *
   * @param [params] Request parameters.
   * @param {string} [params.apiKey] Normal or temporary API key.
   * @param {ApiKeyType} [params.keyType] Returned API key type.
   * @param {number} [params.expiry] API key expiry period in days, nonzero. By default the key will never expire.
   * @param {number|string} [params.clientId] Client ID to retrieve a specific key for this app.
   * @param {string} [params.cloudName] The third party cloud name, where the API key must be validated.
   * @returns {Promise<LoginApiResponse>}
   */
  loginByKey(params: {
    apiKey?: string;
    keyType?: ApiKeyType;
    expiry?: number;
    clientId?: string;
    cloudName?: string;
  }): Promise<LoginApiResponse> {
    return this.dal.get('loginByKey', {
      params: {
        keyType: params.keyType,
        expiry: params.expiry,
        clientId: params.clientId,
        cloudName: params.cloudName,
      },
      headers: {
        API_KEY: params.apiKey,
      },
    });
  }

  /**
   * Send a temporary pass code to a user.
   * Currently it can be send only by SMS, if the user has a valid mobile phone number.
   * See {@link https://iotapps.docs.apiary.io/#reference/login-and-logout/passcode/send-passcode}
   *
   * @param params Request parameters.
   * @param {string} params.username The username.
   * @param {PasscodeNotificationType} params.type Notification type: 2 = SMS.
   * @param {ApiKeyType} [params.keyType] API key type requested by this passcode.
   * @param {number} [params.brand] A parameter identifying a customer's specific notification template.
   * @param {PasscodeMessagePrefix} [params.prefix] Message prefix type.
   * @param {string} [params.appHash] 11-character app hash.
   * @returns {Promise<SendPasscodeApiResponse>}
   */
  sendPasscode(params: {
    username: string;
    type: PasscodeNotificationType;
    keyType?: ApiKeyType;
    brand?: string;
    prefix?: PasscodeMessagePrefix;
    appHash?: string;
  }): Promise<SendPasscodeApiResponse> {
    return this.dal.get('passcode', {
      params: params,
    });
  }
}
