import { CoreApiError } from '../models/coreApiError';
import { CloudConfig, GetApiSettingsApiResponse, ServerType } from '../api/app/common/getApiSettingsApiResponse';
import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { WcStorage } from '../../modules/localStorage/localStorage';
import { LiteEvent } from '../../modules/common/liteEvent';
import { Logger } from '../../modules/logger/logger';
import { CommonApi } from '../api/app/common/commonApi';

const localhostSynonyms: string[] = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::',
];
const sboxServerUrl = 'https://sboxall.peoplepowerco.com';
const apiServerTypeName = ServerType.AppApi;
const apiPath = '/cloud/json/';
const localStorageCurrentCloudKey = 'Main-Cloud';

@injectable('CloudConfigService')
export class CloudConfigService extends BaseService {

  @inject('CommonApi') public readonly commonApi: CommonApi;
  @inject('WcStorage') protected readonly wcStorage: WcStorage;
  @inject('Logger') protected readonly logger: Logger;

  /**
   * Cloud changed event
   * @type {LiteEvent<CloudConfig>}
   */
  public readonly onCloudChange: LiteEvent<CloudConfig> = new LiteEvent<CloudConfig>();

  /**
   * List of clouds available
   */
  protected clouds: CloudConfig[] | undefined;
  protected settings: GetApiSettingsApiResponse | undefined;
  protected currentCloud: CloudConfig | undefined;
  protected getCloudPromise: Promise<CloudConfig[]> | undefined;
  private _baseUrl: string | undefined;

  constructor() {
    super();
    // bootstrap:
    // get the clouds, set the first one as current

    setTimeout(() => {
      this.getCurrentCloud();
    });
  }

  public get baseUrl(): string | undefined {
    return this._baseUrl;
  }

  /**
   * Get base url of all the APIs
   * @returns {Promise<string>}
   */
  public getClouds(): Promise<CloudConfig[]> {
    if (this.clouds) {
      return Promise.resolve(this.clouds);
    }
    if (this.getCloudPromise) {
      return this.getCloudPromise;
    }

    let getSettingsBaseUrl: string;
    if (!window.location.hostname || ~localhostSynonyms.indexOf(window.location.hostname)) { // if in developer's environment
      getSettingsBaseUrl = sboxServerUrl;
    } else {
      getSettingsBaseUrl = window.location.protocol + '//' + window.location.host;
    }
    getSettingsBaseUrl += apiPath;
    this.getCloudPromise = this.commonApi.getApiSettings({}, getSettingsBaseUrl)
      .then(settings => {
        delete this.getCloudPromise;
        if (!settings) {
          this.logger.error(`Unexpected error: Get Connection Settings API returns empty result`);
          this.clouds = undefined;
          this.settings = undefined;
          return Promise.reject();
        }
        this.clouds = settings.clouds;
        this.settings = settings;

        if (!settings.clouds || settings.clouds.length <= 0) {
          this.logger.error(`Unexpected error: Get Connection Settings API returns empty clouds array`);
        }

        return this.clouds;
      })
      .catch(error => {
        delete this.getCloudPromise;
        return Promise.reject(error);
      });
    return this.getCloudPromise;
  }

  /**
   * Sets the cloud as a new Current Cloud.
   * @param {CloudConfig} cloud
   * @returns {Promise<CloudConfig>} Promise of Current Cloud
   */
  public setCurrentCloud(cloud: CloudConfig): Promise<CloudConfig> {
    if (!cloud) {
      throw new Error('Cloud must be defined');
    }
    this.currentCloud = cloud;
    this.wcStorage.set(localStorageCurrentCloudKey, cloud);
    this._baseUrl = this.getApiUrlForCloud(cloud);
    this.onCloudChange.trigger(cloud);
    return Promise.resolve(cloud);
  }

  /**
   * Get Current Cloud info
   * @returns {Promise<CloudConfig>}
   */
  public getCurrentCloud(): Promise<CloudConfig> {
    if (this.currentCloud) {
      return Promise.resolve(this.currentCloud);
    }

    return this.getClouds()
      .then(clouds => {
        let savedCloud = this.wcStorage.get<CloudConfig>(localStorageCurrentCloudKey);

        if (savedCloud) {
          if (!clouds || clouds.length <= 0) {
            return this.setCurrentCloud(savedCloud);
          }
          let savedCloudFromServer = clouds.find(c => {
            return savedCloud!.name && c.name && savedCloud!.name.toLowerCase() === c.name.toLowerCase();
          });
          if (savedCloudFromServer) {
            return this.setCurrentCloud(savedCloudFromServer);
          }
        }

        if (!clouds || clouds.length <= 0) {
          return Promise.reject(new CoreApiError('Empty clouds list'));
        }

        // By default, choose the first one
        return this.setCurrentCloud(clouds[0]);
      });
  }

  /**
   * Gets API base URL of the Current Cloud
   * @returns {Promise<string>}
   */
  public getBaseUrl(): Promise<string> {
    if (this._baseUrl) {
      return Promise.resolve(this._baseUrl);
    }
    // get first / appapi server settings
    return this.getCurrentCloud()
      .then((currentCloud: CloudConfig) => {
        return this.getApiUrlForCloud(currentCloud);
      });
  }

  /**
   * Get main API URL for the cloud
   * @param {CloudConfig} cloud
   * @returns {string} URL for the API cloud server
   */
  protected getApiUrlForCloud(cloud: CloudConfig): string {
    if (cloud && cloud.servers) {
      let apiInfo = cloud.servers.find(c => c.type?.toLocaleLowerCase() === apiServerTypeName.toLowerCase());
      if (apiInfo) {
        return (apiInfo.ssl ? 'https://' : 'http://') +
          apiInfo.host +
          (apiInfo.port ? ':' + apiInfo.port : '');
        // apiInfo.path; // todo this field should contains path to the API
      } else {
        throw new Error('Cloud configuration has no `appapi` server');
      }
    }
    throw new Error('Cloud configuration has no `servers` list');
  }

  /**
   * Get URL for WebSocket connection
   * @returns {Promise<string>} URL for the ws connections
   */
  public getWebSocketUrl(): Promise<string> {
    return this.commonApi.getServer({
      type: ServerType.WsApi,
    })
      .then((data) => {
        let server = data.server;

        let path = server.path;
        if (path && !path.startsWith('/')) {
          path = '/' + path;
        }

        return (server.ssl ? 'wss://' : 'ws://') +
          server.host +
          (server.port ? ':' + server.port : '') +
          (path || '');
      });
  }
}
