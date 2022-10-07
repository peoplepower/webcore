import { LoggerConfig } from '../logger/loggerConfig';
import { LocalStorageProvider } from '../localStorage/localStorage';

export class WebCoreConfig {
  /**
   * Server URL that will be used to get cloud settings. E.g. `https://sboxall.peoplepowerco.com`
   */
  serverUrl?: string;

  /**
   * Default server URL to get cloud settings.
   * We use it only on localhost environment if serverUrl was mot defined.
   * E.g. `https://sboxall.peoplepowerco.com`
   */
  sboxUrl?: string;

  /**
   * Cloud name that will be used (or at least tried to) as preferred cloud name
   */
  cloudName?: string;

  /**
   * Sign in by digital signature feature
   */
  signInBySignature?: {
    enabled: boolean;
    allowProduction: boolean;
  }

  /**
   * Logger config
   */
  logger?: LoggerConfig;

  /**
   * Prefix used to store things in localStorage
   */
  localStoragePrefix?: string;

  /**
   * Settings for Ping feature. This feature allows to pause requests if server
   *  is down, and re-send them after server is up again
   */
  ping?: {
    /**
     * Initial ping interval.
     * @type {number}
     */
    initialPingInterval?: number;

    /**
     * Step of increasing ping interval.
     * @type {number}
     */
    pingIntervalIncrease?: number;

    /**
     * Max ping interval
     * @type {number}
     */
    maxPingInterval?: number;

    /**
     * Additional time to wait after successful ping when server will be ready
     * @type {number}
     */
    afterPingTimeout?: number;
  };

  /**
   * Custom localStorage realization (e.g. for ReactNative)
   */
  localStorage?: LocalStorageProvider;
}
