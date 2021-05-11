import { inject, injectable } from '../../../../modules/common/di';
import { AppApiOAuthDal } from '../appApiOAuthDal';
import { AuthService } from '../../../services/authService';
import { GetSupportedThirdPartyAppsApiResponse } from './getSupportedThirdPartyAppsApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * OAuth allows the IoT Software Suite to act as a client or a host for a third-party application.
 * As a client, the IoT Software Suite may obtain authorizations from third-party applications such as Twitter or Green Button to access user data.
 * See {@link https://iotapps.docs.apiary.io/#reference/clouds-integration}
 */
@injectable('OAuthClientApi')
export class OAuthClientApi {
  @inject('AppApiOAuthDal') protected readonly dal: AppApiOAuthDal;
  @inject('AuthService') protected readonly authService: AuthService;

  /**
   * This API returns a list of supported third-party applications, where a user may obtain authorization.
   * See {@link https://iotapps.docs.apiary.io/#reference/clouds-integration/supported-third-party-clouds/get-third-party-clouds}
   *
   * @returns {Promise<GetSupportedThirdPartyAppsApiResponse>}
   */
  getSupportedThirdPartyApps(): Promise<GetSupportedThirdPartyAppsApiResponse> {
    return this.dal.get('cloud/json/authorize');
  }

  /**
   * Revoke authorization for the IoT Software Suite to access the user's data on a third-party host.
   * This operation will delete all corresponding access and refresh tokens.
   * See {@link https://iotapps.docs.apiary.io/#reference/clouds-integration/revoke-access-to-a-third-party-cloud/revoke-access-to-a-third-party-cloud}
   *
   * @param {number} applicationId Application ID.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<ApiResponseBase>}
   */
  revokeAccessToThirdPartyApps(
    applicationId: number,
    params: {
      locationId: number;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.delete(`cloud/json/authorize/${encodeURIComponent(applicationId.toString())}`, { params: params });
  }

  /**
   * Returns the constructed URL taking into account currently configured baseUrl from cloudConfig service for the current application instance.
   * See {@link https://iotapps.docs.apiary.io/#reference/clouds-integration/access-a-third-party-cloud/access-a-third-party-cloud}
   *
   * @param {number} appId Application ID. E.g.: 2 - Twitter.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID where the 3'rd party devices and services will be linked.
   * @param {string} [params.API_KEY] Temporary user API key for web page redirect.
   * @param {string} [params.scope] OAuth2 scope.
   * @param {string} [params.brand] Force forwarding user to a specific branded page. If not set, the current user brand will be used.
   * @returns {Promise<string>}
   */
  getUrlToAccessThirdPartyApp(
    appId: number,
    params: {
      locationId: number;
      API_KEY?: string;
      scope?: string;
      brand?: string;
    },
  ): Promise<string> {
    return this.dal.get(`auth/authorize/${encodeURIComponent(appId.toString())}`, { params: params });
  }
}
