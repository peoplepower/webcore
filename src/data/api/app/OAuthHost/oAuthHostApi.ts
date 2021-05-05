import { inject, injectable } from '../../../../modules/common/di';
import { AppApiOAuthDal } from '../appApiOAuthDal';
import { AuthService } from '../../../services/authService';
import { GetAccessTokenApiResponse } from './getAccessTokenApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { QueryService } from '../../../services/queryService';

/**
 * OAuth allows the IoT Software Suite to act as a client or a host for a third-party application.
 * As a host, the IoT Software Suite provides authorization information to third party applications using the OAuth 2.0 open standard.
 * See {@link https://iotapps.docs.apiary.io/#reference/clouds-integration/authorize-a-third-party-application}
 */
@injectable('OAuthHostApi')
export class OAuthHostApi {

  @inject('AppApiOAuthDal') protected readonly dal: AppApiOAuthDal;
  @inject('AuthService') protected readonly authService: AuthService;
  @inject('QueryService') protected readonly queryService: QueryService;

  /**
   * Begin the process of authorizing a third-party application (the client) to access the user's data.
   * See {@link https://iotapps.docs.apiary.io/#reference/clouds-integration/authorize-a-third-party-application/authorize-a-third-party-application}
   *
   * The application has to GET the Access Token with a separate API call to access data from the IoT Software Suite.
   * You may find the list of authorized third-party apps in the /user GET information API.
   *
   * @param {string} brand Brand name.
   * @param params Request parameters.
   * @param {string} params.clientId OAuth Client ID.
   * @param {string} params.responseType OAuth 2 response type. The "code" response type is the only one currently supported.
   * @param {string} [params.state] The client's state which will be returned in the callback URL.
   * @returns {Promise<string>}
   */
  getUrlToAuthorizeThirdPartyApp(brand: string,
                                 params: {
                                   clientId: string,
                                   responseType: string,
                                   state?: string
                                 }): Promise<string> {
    let paramsStr = this.queryService.encodeQueryParams({
      client_id: params.clientId,
      response_type: params.responseType,
      state: params.state,
    }, {addQueryPrefix: true});

    return this.dal.GetFullUrl(
      `oauth/authorize/${encodeURIComponent(brand)}${paramsStr}`,
    );
  }

  /**
   * Gets URL which allows a user to approve or deny an authorization request from the third-party application.
   * The user will be redirected to the external application web page.
   * See {@link http://docs.iotapps.apiary.io/#reference/oauth-2.0-host/authorize-a-third-party-application/approve-or-deny-authorization}
   *
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
  getUrlToApproveOrDenyAuthorization(approved: boolean,
                                     params: {
                                       clientId: string,
                                       responseType: string,
                                       apiKey: string
                                       state?: string,
                                       locationId?: number,
                                       brand?: string,
                                     }): Promise<string> {
    let paramsStr = this.queryService.encodeQueryParams({
      client_id: params.clientId,
      response_type: params.responseType,
      state: params.state,
      locationId: params.locationId,
      brand: params.brand,
      API_KEY: params.apiKey,
    }, {addQueryPrefix: true});

    return this.dal.GetFullUrl(
      `oauth/approve/${encodeURIComponent(approved.toString())}${paramsStr}`,
    );
  }

  /**
   * This API uses an authorization code or a previously generated refresh token to grant new access to the IoT Software Suite.
   * See {@link https://iotapps.docs.apiary.io/#reference/clouds-integration/get-access-token/get-access-token}
   *
   * It returns a new access token, a token type, expiration time, and a refresh token.
   * Error codes include:
   *  unauthorized_client - Invalid authorization header
   *  invalid_request - Missing input parameters
   *  invalid_client - The Client ID or Secret is invalid
   *  invalid_token - The authorization code or refresh token is incorrect
   *  server_error - Internal server error
   *
   * @param [params] Request parameters.
   * @param {string} [params.client_id] OAuth Client ID.
   * @param {string} [params.refresh_token] A refresh token previously received from getting an access token with an authorization code.
   * @param {string} [params.code] The authorization code.
   * @returns {Promise<GetAccessTokenApiResponse>}
   */
  getAccessToken(params: {
    code?: string,
    refresh_token?: string,
    client_id?: string
  }): Promise<GetAccessTokenApiResponse> {

    //TODO: Find out what should be put as 'secret' actually. Putting apiKey for now
    let clientIdAndSecretEncoded = btoa(`${params.client_id}:${this.authService.apiKey}`);

    let body = this.queryService.encodeQueryParams({
      'code': params.code,
      'refresh_token': params.refresh_token,
      'client_id': params.client_id,
      'client_secret': this.authService.apiKey,
      'grant_type': (params.refresh_token || params.code) ? undefined : 'client_credentials',
    });

    return this.dal.post(
      'oauth/token',
      body,
      {
        // params: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${clientIdAndSecretEncoded}`,
        },
      });
  }

  /**
   * The user may revoke authorization for a third-party to access the user's data on the IoT Software Suite.
   * This operation will delete all corresponding access and refresh tokens.
   * See {@link http://docs.iotapps.apiary.io/#reference/oauth-2.0-host/revoke-oauth-clients/revoke-oauth-clients}
   *
   * @param params Request parameters.
   * @param {string} params.client_id The Client ID to revoke.
   * @param {string} [params.userId] Administrators may revoke access to third-party clients on behalf of a user.
   * @returns {Promise<ApiResponseBase>}
   */
  revokeOAuthClients(params: { client_id: string, userId?: number }): Promise<ApiResponseBase> {
    return this.dal.delete('cloud/json/authClient', {params: params});
  }
}
