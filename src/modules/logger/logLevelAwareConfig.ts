import { LogLevel } from './logLevel';

export abstract class LogLevelAwareConfig {
  /**
   * Minimum level of log messages; Debug(7) by default
   * @type {LogLevel}
   */
  minLevel?: LogLevel = LogLevel.Debug;

  /**
   * Maximum level of log messages; Emergency(0) by default
   * @type {LogLevel}
   */
  maxLevel?: LogLevel = LogLevel.Emergency;
}
