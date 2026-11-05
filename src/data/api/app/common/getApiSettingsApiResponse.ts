import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetApiSettingsApiResponse extends ApiResponseBase {
  clouds: Array<CloudConfig>;
}

export interface TimezoneModel {
  /**
   * Timezone ID ("US/Eastern")
   */
  id: string;

  /**
   * Timezone name
   */
  name: string;

  /**
   * Timezone offset in minutes
   */
  offset: number;

  /**
   * Daylight saving time
   */
  dst: boolean;
}

export interface CloudConfig {
  /**
   * Cloud unique name identificator.
   */
  name: string;

  /**
   * Cloud type.
   */
  type: CloudType;

  /**
   * Cloud instance description.
   */
  description?: string;

  /**
   * The current cloud software version.
   */
  version?: string;

  currentTime: string;
  currentTimeMs: number;
  defaultTimezone: TimezoneModel;

  /**
   * Servers for connection.
   */
  servers: CloudServerConfig[];
}

export interface CloudServerConfig {
  /**
   * Server type.
   */
  type: ServerType;

  /**
   * Server host.
   */
  host: string;

  /**
   * Default port.
   */
  port: number;

  /**
   * Server brand.
   */
  brand?: string;

  /**
   * Optional path
   */
  path?: string;

  /**
   * SSL flag. true - SSL, false - No SSL.
   */
  ssl: boolean;

  /**
   * Server version. Optional.
   */
  version?: number;
}

export enum ServerType {
  /**
   * Restful API
   */
  AppApi = 'appapi',

  /**
   * Websockets API
   */
  WsApi = 'wsapi',

  /**
   * Device IO API
   */
  DeviceIo = 'deviceio',

  /**
   * Streaming API
   */
  Streaming = 'mqtt',

  /**
   * Web UI app
   */
  WebApp = 'webapp',
}

export enum CloudType {
  Production = 0,
  Test = 1
}
