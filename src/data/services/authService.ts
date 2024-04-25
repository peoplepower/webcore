import { WcStorage } from '../../modules/localStorage/localStorage';
import { LiteEvent } from '../../modules/common/liteEvent';
import { AuthApi } from '../api/app/auth/authApi';
import { ApiKeyType, LoginApiResponse, PasscodeDeliveryType } from '../api/app/auth/loginApiResponse';
import { SendPasscodeApiResponse } from '../api/app/auth/sendPasscodeApiResponse';
import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { ApiResponseBase } from '../models/apiResponseBase';
import { UserAccountsApi } from '../api/app/userAccounts/userAccountsApi';
import { OAuthHostApi } from '../api/app/OAuthHost/oAuthHostApi';
import { GetPrivateKeyApiResponse } from "../api/app/auth/getPrivateKeyApiResponse";
import { CloudConfigService } from "./cloudConfigService";
import { CloudType } from "../api/app/common/getApiSettingsApiResponse";
import { Tuner } from "../../modules/tuner/tuner";
import { hashString } from "../../modules/common/hash";
import { CreateTotpSecretApiResponse } from "../api/app/auth/createTotpSecretApiResponse";
import { ConfirmTotpSecretApiResponse } from "../api/app/auth/confirmTotpSecretApiResponse";
import { GetTotpFactorsApiResponse } from "../api/app/auth/getTotpFactorsApiResponse";
import { DeleteTotpFactorApiResponse } from "../api/app/auth/deleteTotpFactorApiResponse";

const LOCAL_STORAGE_API_KEY = 'Auth-Key';
const LOCAL_STORAGE_API_KEY_TYPE = 'Auth-KeyType';
const LOCAL_STORAGE_API_KEY_EXPIRE = 'Auth-KeyExpire';
const LOCAL_STORAGE_API_KEY_EXPIRE_PERIOD = 'Auth-KeyExpirePeriod';
const LOCAL_STORAGE_LAST_USERNAME = 'Auth-Username';
const LOCAL_STORAGE_USER_SIGNATURE_PRIVATE_KEY = 'Auth-UserSignaturePrivateKey';

/**
 * How many milliseconds before the end of the key validity period will it be necessary to update the key
 */
const API_KEY_EXPIRE_ADDITIONAL_DELAY = 2 * 60 * 1000; // 2 minutes

@injectable('AuthService')
export class AuthService extends BaseService {
  @inject('AuthApi') protected readonly authApi!: AuthApi;
  @inject('OAuthHostApi') protected readonly oAuthHostApi!: OAuthHostApi;
  @inject('UserAccountsApi') protected readonly userAccountsApi!: UserAccountsApi;
  @inject('WcStorage') protected readonly wcStorage!: WcStorage;
  @inject('CloudConfigService') protected readonly cloudConfigService!: CloudConfigService;
  @inject('Tuner') private tuner!: Tuner;

  /**
   * Event that triggered when for some reason token is no more valid we need to re-login.
   * Possible reasons:
   *  - Server return 401 error
   *  - Some client call logoutFromAllBrowsers method
   *  - Token has expired
   * @type {LiteEvent<string>}
   */
  public readonly onNeedRelogin: LiteEvent<string> = new LiteEvent<string>();

  /**
   * Event that triggered when user logged into the system.
   * This event means only that fact that user gets his auth token
   * @type {LiteEvent<string>}
   */
  public readonly onLogin: LiteEvent<string> = new LiteEvent<string>();

  /**
   * Event that triggered when user logged out from the system
   * @type {LiteEvent<string>}
   */
  public readonly onLogout: LiteEvent<string> = new LiteEvent<string>();

  private _apiKey: string | undefined;

  private _apiKeyType: ApiKeyType | undefined;

  private ensureAuthenticatedPromise: Promise<boolean> | undefined;

  private apiKeyExpireTimeout: any;

  public get apiKey() {
    return this._apiKey;
  }

  public get lastUsername(): string | undefined {
    return this.wcStorage.get(LOCAL_STORAGE_LAST_USERNAME) || undefined;
  }

  public get apiKeyExpire() {
    let expireDateStr = this.wcStorage.get<string>(LOCAL_STORAGE_API_KEY_EXPIRE);
    return expireDateStr ? new Date(expireDateStr) : undefined;
  }

  public get apiKeyExpirePeriod(): number | undefined {
    let val = this.wcStorage.get(LOCAL_STORAGE_API_KEY_EXPIRE_PERIOD);
    return val != null ? parseInt(val as string, 10) : undefined;
  }

  constructor() {
    super();
    this.init();
  }

  private init() {
    let _apiKey = this.wcStorage.get<string>(LOCAL_STORAGE_API_KEY);
    if (_apiKey) {
      this.logger.debug('API key extracted from local storage: ' + _apiKey);
      this._apiKey = _apiKey;
      this._apiKeyType = this.wcStorage.get<ApiKeyType>(LOCAL_STORAGE_API_KEY_TYPE) ?? undefined;
      let keyExpire = this.wcStorage.get<string>(LOCAL_STORAGE_API_KEY_EXPIRE);
      if (keyExpire) {
        this.setUpKeyExpireTimeout(keyExpire);
      }
      this.onLogin.trigger();
    } else {
      this.logger.debug('API key was not found in local storage');
    }
  }

  public ensureAuthenticated(): Promise<boolean> {
    if (this._apiKey) {
      return Promise.resolve(true);
    }
    if (!this.ensureAuthenticatedPromise) {
      this.ensureAuthenticatedPromise = new Promise<boolean>((resolve) => {
        let eventSubscriptionCanceller = this.onLogin.on(() => {
          eventSubscriptionCanceller();
          delete this.ensureAuthenticatedPromise;
          resolve(true);
        });
      });
    }
    return Promise.resolve(this.ensureAuthenticatedPromise);
  }

  /**
   * Log in into the system by username and password
   * @param {string} username
   * @param {string} pwd
   * @param {string} appName
   * @param {boolean} [admin] Use if you need to get admin API_KEY type
   * @param {PasscodeType} [passcodeType] Second factor type. 1 - sms, 2 - totp
   * @param {string} [brand] Optional brand name
   * @returns {Promise<LoginInfo>}
   */
  public async login(
    username: string,
    pwd: string,
    appName: string,
    admin?: boolean,
    passcodeType?: PasscodeType,
    brand?: string
  ): Promise<LoginInfo> {
    const params: any = {
      appName: appName,
      brand: brand
    }
    if (admin) {
      params.keyType = 11
    }
    if (passcodeType === PasscodeType.Totp) {
      params.totp = true;
    } else if (passcodeType === PasscodeType.EMail) {
      params.prefDeliveryType = PasscodeDeliveryType.Email
    } else {
      params.prefDeliveryType = PasscodeDeliveryType.Sms
    }
    await this.logoutFromThisBrowser();

    try {
      return await this.loginByPreservedSignature(username, pwd, appName, admin, brand);
    } catch (e) {
      if (typeof e !== 'string') {
        this.logger.error('Unable to login by signature: ' + username, e);
      }
    }

    const result = await this.authApi.login(username, pwd, params);
    return this.afterLogin(result, username, appName, brand);
  }

  /**
   * Log in into the system by username and passcode
   * @param {string} username The username.
   * @param {string} passcode Passcode.
   * @param {string} appName Application name.
   * @param {boolean} [admin] Use if you need to get admin API_KEY type.
   * @param {string} [brand] Optional brand name.
   * @returns {Promise<LoginInfo>}
   */
  public async loginByPasscode(
    username: string,
    passcode: string,
    appName: string,
    admin?: boolean,
    brand?: string,
  ): Promise<LoginInfo> {
    let keyType = admin ? 11 : 0; // Admin or User key type
    await this.logoutFromThisBrowser()
    const params: any = {
      passcode: passcode,
      keyType: keyType,
      brand: brand
    }
    const result = await this.authApi.login(username, undefined, params);
    return this.afterLogin(result, username, appName, brand);
  }

  /**
   * Log in into the system by TOTP
   * @param {string} username The username.
   * @param {string} password Password.
   * @param {string} passcode Passcode.
   * @param {string} appName Application name.
   * @param {boolean} [admin] Use if you need to get admin API_KEY type.
   * @param {string} [brand] Optional brand name.
   * @returns {Promise<LoginInfo>}
   */
  public async loginByTotp(
    username: string,
    password: string,
    passcode: string,
    appName: string,
    admin?: boolean,
    brand?: string,
  ): Promise<LoginInfo> {
    let keyType = admin ? 11 : 0; // Admin or User key type
    await this.logoutFromThisBrowser()
    const params: any = {
      passcode: passcode,
      keyType: keyType,
      totp: true,
      brand: brand
    }
    const result = await this.authApi.login(username, password, params);
    return this.afterLogin(result, username, appName, brand);
  }

  /**
   * This login API allows the user to log in with an existing API key instead of username and password.
   * Request can also be used generate a temporary key that is valid for only a brief amount of time.
   * See {@link http://docs.iotapps.apiary.io/#reference/login-and-logout/login-with-an-existing-api-key/login-by-key}
   *
   * @param {string} apiKey Temporary or normal API_KEY
   * @param {boolean} [admin] Use if need to get admin API_KEY type.
   * @param {string} [brand] Brand name.
   * @returns {Promise<LoginApiResponse>}
   */
  loginByKey(apiKey: string, admin?: boolean, brand?: string): Promise<LoginApiResponse> {
    let me = this;
    let keyType = admin ? 11 : 0; // Admin or User key type
    return this.logoutFromThisBrowser()
      .then(() => this.authApi.loginByKey({apiKey: apiKey, keyType: keyType, brand: brand}))
      .then((result) => {
        me.logger.debug('Logged in by API_KEY', result);

        // NOTE: Dmitriy said that if API_KEY is valid enough - server will not generate new API_KEY. ¯\_(ツ)_/¯
        const key = result.key || apiKey;

        me._apiKey = key;
        me._apiKeyType = result.keyType;
        me.wcStorage.set(LOCAL_STORAGE_API_KEY, key);
        me.wcStorage.set(LOCAL_STORAGE_API_KEY_TYPE, result.keyType);
        me.wcStorage.set(LOCAL_STORAGE_API_KEY_EXPIRE, result.keyExpire);
        me.wcStorage.set(LOCAL_STORAGE_API_KEY_EXPIRE_PERIOD, new Date(result.keyExpire!).getTime() - new Date().getTime());
        me.wcStorage.remove(LOCAL_STORAGE_LAST_USERNAME);
        me.setUpKeyExpireTimeout(result.keyExpire!, brand);
        me.onLogin.trigger();
        return result;
      })
      .catch((err) => {
        return err;
      });
  }

  /**
   * Login by preserved digital signature
   */
  public async loginByPreservedSignature(username: string, pwd: string, appName: string, admin?: boolean, brand?: string) {
    if (!this.tuner.config?.signInBySignature?.enabled) {
      return Promise.reject('The digital signature login feature is disabled');
    }

    const currentCloud = await this.cloudConfigService.getCurrentCloud();
    if (currentCloud.type === CloudType.Production && !this.tuner.config?.signInBySignature?.allowProduction) {
      return Promise.reject('The digital signature login feature is unavailable for production servers');
    }

    const usernameHash = await hashString(username);
    const key = LOCAL_STORAGE_USER_SIGNATURE_PRIVATE_KEY + '-' + appName + '-' + currentCloud.name + '-' + usernameHash;
    const privateKey = this.wcStorage.get(key);

    if (!privateKey || typeof privateKey !== 'string') {
      return Promise.reject('The digital signature private key for the specified user was not found');
    }

    return this.loginBySignature(
      username,
      pwd,
      privateKey,
      appName,
      !!admin,
      brand
    );
  }

  /**
   * Login by signature
   * @param {string} username The username.
   * @param {string} password Actual user password.
   * @param {string} privateKey Private key stored on server.
   * @param {string} appName Application name that was used to generate privateKey.
   * @param {boolean} [admin] Use if you need to get admin API_KEY type.
   * @param {string} [brand] Optional brand name
   */
  public async loginBySignature(
    username: string,
    password: string,
    privateKey: string,
    appName: string,
    admin?: boolean,
    brand?: string,
  ): Promise<LoginInfo> {
    await this.logoutFromThisBrowser();

    let params: any = {
      keyType: admin ? 11 : 0, // Admin or User key type
      appName: appName,
      sign: true,
      brand: brand
    };
    const getTempKeyResult = await this.authApi.login(username, password, params)

    const signature = await this.sign(privateKey, getTempKeyResult.key)

    params = {
      keyType: admin ? 11 : 0,
      appName: appName,
      sign: true,
      signAlgorithm: 'SHA512withRSA',
      passcode: signature,
      brand: brand
    };
    const result = await this.authApi.login(username, undefined, params)

    return this.afterLogin(result, username, appName, brand);
  }

  /**
   * Requests a new API_KEY and reset its expiration to default.
   * @param {string} [brand] Optional brand name.
   * @returns {Promise<LoginInfo>}
   */
  public refreshToken(brand?: string): Promise<LoginInfo> {
    let me = this;
    return me.authApi.loginByKey({apiKey: me._apiKey, brand: brand, keyType: me._apiKeyType}).then((result) => {
      me.logger.debug('API key has refreshed from: ' + me._apiKey, result);
      me._apiKey = result.key;
      me._apiKeyType = result.keyType;
      me.wcStorage.set(LOCAL_STORAGE_API_KEY, result.key);
      me.wcStorage.set(LOCAL_STORAGE_API_KEY_TYPE, result.keyType);
      me.wcStorage.set(LOCAL_STORAGE_API_KEY_EXPIRE, result.keyExpire);
      me.wcStorage.set(LOCAL_STORAGE_API_KEY_EXPIRE_PERIOD, new Date(result.keyExpire!).getTime() - new Date().getTime());
      me.setUpKeyExpireTimeout(result.keyExpire!, brand);
      return result;
    });
  }

  /**
   * Send an SMS verification code to specific user.
   * @param {string} username The username.
   * @param {boolean} [admin] Use if need to get admin API_KEY type.
   * @param {string} [brand] Optional brand name.
   * @returns {Promise<SendPasscodeApiResponse>}
   */
  public sendPasscode(username: string, admin?: boolean, brand?: string): Promise<SendPasscodeApiResponse> {
    if (!username || username.length === 0) {
      return Promise.reject(`Username can not be empty [${username}].`);
    }
    // let keyType = admin ? 11 : 0; // Admin or User key type
    let brandName = brand ? brand : undefined;
    return this.authApi
      .sendPasscode({
        username: username,
        type: 2,
        // keyType: keyType,
        brand: brandName,
      })
      .then((result) => {
        return result;
      });
  }

  /**
   * Gets temporary API key that is valid for only a brief amount of time.
   * @param {string} [brand] Optional brand name.
   * @returns {Promise<LoginInfo>}
   */
  public getTempToken(brand?: string): Promise<LoginInfo> {
    return this.authApi.loginByKey({keyType: 1, brand: brand}).then((result) => {
      this.logger.debug('Temporary API key has been requested.', result);
      return result;
    });
  }

  /**
   * Generate a new RSA signature private/public keys pair for the user.
   * Both private and public keys are in Base64 format. The private key is PKCS #8 encoded. The public key must be X.509 formatted.
   * @param appName appName App name used to store the public key
   * returns {Promise<GetPrivateKeyApiResponse>}
   */
  public getPrivateKey(appName: string): Promise<GetPrivateKeyApiResponse> {
    return this.ensureAuthenticated()
      .then(() => this.authApi.getPrivateKey(appName));
  }

  /**
   * Set up timeout to handle token expiration time
   * @param {string|number} keyExpireDate date/time as string in RFC2822 or ISO 8601 formats, or in milliseconds since UNIX epoch
   * @param {string} [brand] Optional brand
   */
  public setUpKeyExpireTimeout(keyExpireDate: string | number, brand?: string) {
    let me = this;
    if (keyExpireDate) {
      let keyExpireDateObj = new Date(keyExpireDate);
      let expirePeriod = keyExpireDateObj.getTime() - new Date().getTime() - API_KEY_EXPIRE_ADDITIONAL_DELAY;
      if (isNaN(expirePeriod) || expirePeriod <= 0) {
        me.logger.debug('API key has expired: ' + me._apiKey);
        me.logoutFromThisBrowser();
        me.onNeedRelogin.trigger();
      } else {
        // setTimeout is buggy: it will fire immediately if timeout is bigger that 0x7FFFFFFF
        if (expirePeriod >= 0x7fffffff) {
          expirePeriod = 0x7ffffffe;
        }

        if (this.apiKeyExpireTimeout) {
          clearTimeout(this.apiKeyExpireTimeout);
          this.apiKeyExpireTimeout = undefined;
        }

        me.wcStorage.set(LOCAL_STORAGE_API_KEY_EXPIRE, keyExpireDateObj.toISOString());
        this.apiKeyExpireTimeout = setTimeout(function () {
          me.logger.debug(`API key (${me._apiKey}) is about to expire. Refreshing...`);
          me.refreshToken(brand)
            .catch(() => {
              me.logoutFromThisBrowser();
              me.onNeedRelogin.trigger();
            });
        }, expirePeriod);
      }
    } else {
      this.clearKeyExpireTimeout();
    }
  }

  /**
   * Clear API key expiration timeout.
   */
  private clearKeyExpireTimeout() {
    this.wcStorage.remove(LOCAL_STORAGE_API_KEY_EXPIRE);
    this.wcStorage.remove(LOCAL_STORAGE_API_KEY_EXPIRE_PERIOD);
    if (this.apiKeyExpireTimeout) {
      clearTimeout(this.apiKeyExpireTimeout);
    }
    this.apiKeyExpireTimeout = undefined;
  }

  /**
   * Log out only from this browser. In other words - clear session and forget auth token
   * @returns {Promise<boolean>}
   */
  public logoutFromThisBrowser() {
    this._apiKey = undefined;
    this.wcStorage.remove(LOCAL_STORAGE_API_KEY);
    this._apiKeyType = undefined;
    this.wcStorage.remove(LOCAL_STORAGE_API_KEY_TYPE);
    this.clearKeyExpireTimeout();
    this.onLogout.trigger();
    this.logger.debug('System logged out');
    return Promise.resolve(true);
  }

  /**
   * Log out from all session from all clients (browsers and android/ios native clients). This call annul auth token on
   * the server.
   * @returns {Promise<LogoutApiResponse>}
   */
  public logoutFromAllBrowsers() {
    let me = this;
    return me.authApi.logout().then(() => {
      me.logger.debug('System logged out from all the browsers');
      me._apiKey = undefined;
      me.wcStorage.remove(LOCAL_STORAGE_API_KEY);
      me._apiKeyType = this._apiKeyType;
      this.wcStorage.remove(LOCAL_STORAGE_API_KEY_TYPE);
      this.clearKeyExpireTimeout();
      me.onLogout.trigger();
    });
  }

  /**
   * Is webcore is authenticated
   * @returns {boolean}
   */
  public isAuthenticated() {
    return !!this._apiKey;
  }

  /**
   * Set new password by temporary API key.
   * @param {string} newPassword New password
   * @param {string} tempKey Temporary API key
   * @param [params] Request parameters
   * @param {string} [params.brand] A parameter identifying specific email template, among other customization settings
   * @param {string} [params.appName] App name to identify the brand
   * @param {string} [params.passcode] SMS passcode if it was sent (this API can return resultCode=17 which force user to enter passcode)
   * @param {number} [params.smsPrefix] Passcode SMS prefix type to automatically parse it by the app: 1 = Google <#>
   * @param {string} [params.appHash] 11-character app hash
   * @param {boolean} [params.strongPassword] Check if the password is strong
   * @param {boolean} [params.keepKeyVersion] Keep the current user key version to keep previously generated API keys active
   * @returns {Promise<ApiResponseBase>}
   */
  public setNewPasswordByTempKey(
    newPassword: string,
    tempKey: string,
    params?: {
      brand?: string;
      passcode?: string;
      smsPrefix?: number;
      appHash?: string;
      strongPassword?: boolean;
      keepKeyVersion?: boolean;
    },
  ): Promise<ApiResponseBase> {
    return this.userAccountsApi.newPasswordByTempKey(newPassword, tempKey, params);
  }

  /**
   * Set new password.
   * If 2-factor auth is used - this API will send passcode, so you'll need to call this method again
   * @param {string} newPassword New password
   * @param {string} oldPassword Old password
   * @param {string} [passcode] 2-factor auth passcode
   * @param [params] Request parameters
   * @param {string} [params.brand] A parameter identifying specific email template, among other customization settings
   * @param {string} [params.strongPassword] Check if the password is strong
   * @param {string} [params.keepKeyVersion] Keep the current user key version to keep previously generated API keys active
   * @returns {Promise<ApiResponseBase>}
   */
  public setNewPassword(
    newPassword: string,
    oldPassword: string,
    passcode?: string,
    params?: {
      brand?: string;
      strongPassword?: boolean;
      keepKeyVersion?: boolean;
    },
  ): Promise<ApiResponseBase> {
    return this.ensureAuthenticated().then(() => {
      return this.userAccountsApi.newPassword(newPassword, oldPassword, passcode, params);
    });
  }

  /**
   * Gets URL which allows a user to approve or deny an authorization request from the third-party application.
   * The user will be redirected to the external application web page.
   * @param {string} approved If the url to approve or deny authorization (true or false).
   * @param params Request parameters.
   * @param {string} params.clientId OAuth Client ID.
   * @param {string} params.responseType OAuth 2 response type. The "code" response type is the only one currently supported.
   * @param {string} params.apiKey Temporary API_KEY.
   * @param {string} [params.brand] Brand name.
   * @param {number} [params.locationId] Location ID, where the third-party app is going to have access.
   * @param {string} [params.state] The client's state which will be returned in the callback URL.
   * @returns {Promise<string>}
   */
  getUrlToApproveOrDenyAuthorization(
    approved: boolean,
    params: {
      clientId: string;
      responseType: string;
      apiKey: string;
      state?: string;
      locationId?: number;
      brand?: string;
    },
  ): Promise<string> {
    return this.oAuthHostApi.getUrlToApproveOrDenyAuthorization(approved, params);
  }

  // #region -------------------- Time-based one-time password (TOTP) --------------------

  /**
   * Generate Time-based One-Time Password (TOTP) Secret and QR code URL.
   * The client has to confirm that the secret has been set in the Authenticator app by submitting code.
   *
   * All TOTP factor management APIs require 2-step authentication (administrator API key).
   * Google Authenticator and Microsoft Authenticator apps are supported.
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/authentication/totp/create-totp-secret}
   *
   * @param params Request parameters.
   * @param {string} params.name Device name used to store the authentication factor
   * @param {string} [params.issuer] Optional issuer returned in the QR code URL and be displayed in the app
   *
   * returns {Promise<CreateTotpSecretApiResponse>}
   */
  createTotpSecret(params: { name: string, issuer?: string }): Promise<CreateTotpSecretApiResponse> {
    return this.ensureAuthenticated()
      .then(() => this.authApi.createTotpSecret(params));
  }

  /**
   * The client has to confirm that the secret has been set in the Authenticator app
   * by submitting code.
   *
   * The API returns the authentication factor's status.
   * The value 1 means that the factor is active and can be used.
   * Zero or negative value means that additional confirmations are required.
   * On each successful confirmation the status value is decremented starting from zero.
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/authentication/totp/confirm-totp-secret}
   *
   * @param {string} name Device name used to store the authentication factor
   * @param {string} code Code generated in the Authenticator app
   *
   * returns {Promise<ConfirmTotpSecretApiResponse>}
   */
  confirmTotpSecret(name: string, code: string): Promise<ConfirmTotpSecretApiResponse> {
    return this.ensureAuthenticated()
      .then(() => this.authApi.confirmTotpSecret(name, code));
  }

  /**
   * Return active and not expired user's TOTP factors.
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/authentication/totp/get-totp-factors}
   *
   * returns {Promise<GetTotpFactorsApiResponse>}
   */
  getTotpFactors(): Promise<GetTotpFactorsApiResponse> {
    return this.ensureAuthenticated()
      .then(() => this.authApi.getTotpFactors());
  }

  /**
   * Delete TOTP factor
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/authentication/totp/delete-totp-factor}
   *
   * @param {string} name Authentication factor name to delete
   *
   * returns {Promise<DeleteTotpFactorApiResponse>}
   */
  deleteTotpFactor(name: string): Promise<DeleteTotpFactorApiResponse> {
    return this.ensureAuthenticated()
      .then(() => this.authApi.deleteTotpFactor(name));
  }

  // #endregion

  /**
   * Sign tempKey with privateKey
   * @param privateKey private key that we get from server (or previously uploaded public key)
   * @param tempKey temporary user key
   */
  private async sign(privateKey: string, tempKey: string): Promise<string> {
    // base64 decode the string to get the binary data (hex string)
    const binaryPrivateKeyString = globalThis.atob(privateKey);
    // convert from a hex string to an ArrayBuffer
    const binaryPrivateKey = this.hexStringToArrayBuffer(binaryPrivateKeyString);
    const binaryTempKey = this.hexStringToArrayBuffer(tempKey);

    const encodedPrivateKey = await globalThis.crypto.subtle.importKey(
      "pkcs8",
      binaryPrivateKey,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-512"
      },
      false,
      ["sign"]
    )

    let signature = await globalThis.crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      encodedPrivateKey,
      binaryTempKey
    );

    // Converting ArrayBuffer to base64 string
    // @ts-ignore
    return btoa(String.fromCharCode(...(new Uint8Array(signature))));
  }

  /**
   * Convert a hex string into an ArrayBuffer
   */
  private hexStringToArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  private afterLogin(result: LoginApiResponse, username: string, appName: string, brand?: string): LoginApiResponse {
    this.logger.debug('Logged in as: ' + username, result);
    this._apiKey = result.key;
    this._apiKeyType = result.keyType;
    this.wcStorage.set(LOCAL_STORAGE_API_KEY, result.key);
    this.wcStorage.set(LOCAL_STORAGE_API_KEY_TYPE, result.keyType);
    this.wcStorage.set(LOCAL_STORAGE_API_KEY_EXPIRE, result.keyExpire);
    this.wcStorage.set(LOCAL_STORAGE_API_KEY_EXPIRE_PERIOD, new Date(result.keyExpire!).getTime() - new Date().getTime());
    this.wcStorage.set(LOCAL_STORAGE_LAST_USERNAME, username);
    this.setUpKeyExpireTimeout(result.keyExpire!, brand);
    this.onLogin.trigger();
    this.preserveSignature(username, appName, result.keyType);
    return result;
  }

  /**
   * Preserve digital signature for future logins
   */
  private async preserveSignature(username: string, appName: string, keyType?: ApiKeyType): Promise<void> {
    if (keyType != null && keyType !== ApiKeyType.AdminApiKey) {
      // Signature sign in is available only for admins
      return;
    }
    if (!this.tuner.config?.signInBySignature?.enabled) {
      this.logger.debug('The digital signature login feature is disabled');
      return;
    }

    const currentCloud = await this.cloudConfigService.getCurrentCloud();
    if (currentCloud.type === CloudType.Production && !this.tuner.config?.signInBySignature?.allowProduction) {
      this.logger.warn('The digital signature login feature is unavailable for production servers');
      return;
    }

    try {
      const {privateKey} = await this.getPrivateKey(appName);
      const usernameHash = await hashString(username);
      const key = LOCAL_STORAGE_USER_SIGNATURE_PRIVATE_KEY + '-' + appName + '-' + currentCloud.name + '-' + usernameHash;
      this.wcStorage.set(key, privateKey);
    } catch (e) {
      this.logger.error('Unable to get digital signature for future login: ' + username, e);
    }
  }

}

export interface LoginInfo extends LoginApiResponse {
}

export interface LogoutApiResponse extends ApiResponseBase {
}

export enum PasscodeType {
  EMail = 2,
  Sms = 3,
  Totp = 4
}
