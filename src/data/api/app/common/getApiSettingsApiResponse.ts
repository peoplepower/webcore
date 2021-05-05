import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetApiSettingsApiResponse extends ApiResponseBase {
  clouds: Array<CloudConfig>;
}

export class CloudConfig {
  /**
   * Cloud name
   */
  name: string;

  currentTime: string;
  currentTimeMs: number;
  defaultTimezone: {
    id: string;
    offset: number;
    dst: boolean;
    name: string;
  };

  servers: CloudServerConfig[];
}

export class CloudServerConfig {
  /**
   * Server Type
   *   appapi - restful API
   *   wsapi - websockets API
   *   deviceio - device IO API
   *   streaming - streaming API
   *   webapp - web UI app
   */
  type: ServerType;

  /**
   * Server Host
   */
  host: string;

  /**
   * Default Port
   */
  port: number;

  /**
   * Optional path
   */
  path?: string;

  /**
   * SSL flag. true - SSL, false - No SSL.
   */
  ssl: boolean;

  /**
   * Alternative Port. Used to provide a different way to connect, usually without SSL.
   */
  altPort: number;

  /**
   * Alternative SSL. true - SSL, false - No SSL
   */
  altSsl: boolean;

  /**
   * Server version. Optional
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
  Streaming = 'streaming',

  /**
   * Web UI app
   */
  WebApp = 'webapp',
}
