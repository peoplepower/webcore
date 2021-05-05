import { LogLevel } from '../../logLevel';
import { AppenderConfig } from '../appenderConfig';

/**
 * XHR appender config
 */
export class XhrAppenderConfig extends AppenderConfig {
  /**
   * Path of API that will handle the logs
   * @type {string}
   */
  path: string = '/logs';

  /**
   * API HTTP Method
   * @type {string}
   */
  method: string = 'POST';

  /**
   * Headers
   */
  headers?: {
    [headerName: string]: string;
  };

  /**
   * Minimum level of message that will trigger sending logs to server; Critical by default
   */
  triggerLevel: LogLevel = LogLevel.Critical;

  /**
   * Number of messages to send to the server; 20 by default
   * @type {number}
   */
  size: number = 20;
}
