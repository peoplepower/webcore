import { AppenderConfig } from '../appenderConfig';

/**
 * LocalStorage appender config
 */
export class LocalStorageAppenderConfig extends AppenderConfig {
  /**
   * Number of messages to store in localStorage
   * @type {number}
   */
  size?: number = 500;

  /**
   * Key for localStorage to store messages
   * @type {string}
   */
  localStorageKey?: string = 'Logger';
}
