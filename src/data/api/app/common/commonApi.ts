import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetApiSettingsApiResponse, ServerType } from './getApiSettingsApiResponse';
import { TestServerApiResponse } from './testServerApiResponse';
import { GetServerApiResponse } from './getServerApiResponse';

/**
 * Common Ensemble API.
 * See {@link http://docs.iotapps.apiary.io/#reference/ensemble}
 */
@injectable('CommonApi')
export class CommonApi {
  @inject('AppApiDal') protected readonly dal: AppApiDal;

  // TODO: Cover this API with integration tests just like the other APIs covered

  /**
   * Check availability of specific Server.
   * See {@link https://iotapps.docs.apiary.io/#reference/cloud-connectivity/how-to-ping/check-availability}
   *
   * @param {string} [baseUrl] Base URL for the server (with protocol, hostname and port).
   * @returns {Promise<TestServerApiResponse>}
   */
  testServer(baseUrl?: string): Promise<TestServerApiResponse> {
    return this.dal.get('watch', {
      baseURL: baseUrl || '/espapi/',
    });
  }

  /**
   * Available Server instances.
   * See {@link https://iotapps.docs.apiary.io/#reference/cloud-connectivity/available-server-instances/get-connection-settings}
   *
   * The /settings API provides the following information:
   *   - Ensemble cloud instance names ('Production', 'sbox', etc.).
   *   - Application /cloud API for all clouds. The current cloud is always returned first.
   *   - Device /deviceio API server for this cloud, only if the device ID parameter is provided.
   *   - Streaming /streaming API server for this cloud, only if the device ID parameter is provided.
   *
   * The first cloud in the list is the current one. To obtain info about other clouds call the same API on the corresponding appapi server.
   *
   * @param [params] request parameters
   * @param {string} [params.deviceId] When specified, the API will return connection settings for this device.
   * @param {number} [params.version] The API will return only server of this version and non-version servers.
   * @param {number} [params.connected] Check if the device is connected to the server, default 'false':
   *   'false' - return the best available server,
   *   'true' - return the server, where the device is connected now or nothing.
   * @param {string} baseUrl Base URL for the server (with protocol, hostname and port).
   * @returns {Promise<GetApiSettingsApiResponse>}
   */
  getApiSettings(
    params?: {
      deviceId?: string;
      version?: number;
      connected?: boolean;
    },
    baseUrl?: string,
  ): Promise<GetApiSettingsApiResponse> {
    return this.dal.get('settings', {
      params: params,
      baseURL: baseUrl,
    });
  }

  /**
   * This API returns just one server connection settings by type.
   * For maximum scalability, we recommend a device check in with this API
   *   every hour to discover, if it needs to switch servers.
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/cloud-connectivity/server-instances/get-server}
   *
   * @param [params] request parameters
   * @param {ServerType} [params.type] Server type
   *    appapi - restful API
   *    wsapi - websockets API
   *    deviceio - device IO API
   *    streaming - streaming API
   *    webapp - web UI app
   * @param {string} [params.deviceId] Device ID to receive streaming server
   * @param {boolean} [params.connected] Check, if the device is connected to the streaming server:
   *    false - return the best available server - default,
   *    true - return the server, where the device is connected now or nothing.
   * @param {string} [params.brand] Return brand specific server, if available.
   * @param {string} [params.appName] Return app specific server, if available.
   * @returns {Promise<GetServerApiResponse>}
   */
  getServer(params: {
    type: ServerType;
    deviceId?: string;
    connected?: boolean;
    brand?: string;
    appName?: string;
  }): Promise<GetServerApiResponse> {
    let { type, ...reqParams } = params;
    return this.dal.get('settingsServer/' + encodeURIComponent(type), {
      params: reqParams,
    });
  }

  /**
   * This is a simplified version of the previous API to retrieve the server connection URL in the plain text format.
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/cloud-connectivity/server-instance-url/get-server-url}
   *
   * @param [params] request parameters
   * @param {ServerType} [params.type] Server type
   *    appapi - restful API
   *    wsapi - websockets API
   *    deviceio - device IO API
   *    streaming - streaming API
   *    webapp - web UI app
   * @param {boolean} [params.ssl] Flag to return SSL version of the URL, if available, default true.
   * @param {string} [params.deviceId] Device ID to receive device server For maximum scalability,
   *    we recommend a device check in with this API about every hour to discover, if it needs to switch servers.
   * @param {boolean} [params.connected] Check, if the device is connected to the streaming server:
   *    false - return the best available server - default,
   *    true - return the server, where the device is connected now or nothing.
   * @param {string} [params.brand] Return brand specific server, if available.
   * @param {string} [params.appName] Return app specific server, if available.
   * @returns {Promise<string>}
   */
  getServerUrl(params: {
    type: ServerType;
    ssl: boolean;
    deviceId?: string;
    connected?: boolean;
    brand?: string;
    appName?: string;
  }): Promise<string> {
    return this.dal.get('settingsServer', {
      params: params,
      responseType: 'text',
    });
  }
}
