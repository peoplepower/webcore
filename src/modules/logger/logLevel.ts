/**
 * Log levels from rfc5424 - https://tools.ietf.org/html/rfc5424
 */
export enum LogLevel {
  /**
   * system is unusable
   * @type {number}
   */
  Emergency = 0,

  /**
   * Action must be taken immediately
   * @type {number}
   */
  Alert = 1,

  /**
   * Critical conditions
   * @type {number}
   */
  Critical = 2,

  /**
   * Error conditions
   * @type {number}
   */
  Error = 3,

  /**
   * Warning conditions
   * @type {number}
   */
  Warn = 4,

  /**
   * Normal but significant condition
   * @type {number}
   */
  Notice = 5,

  /**
   * Informational messages
   * @type {number}
   */
  Info = 6,

  /**
   * Debug-level messages
   * @type {number}
   */
  Debug = 7,
}
