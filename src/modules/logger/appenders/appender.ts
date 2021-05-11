import { AppenderConfig } from './appenderConfig';
import { LogLevel } from '../logLevel';

/**
 * Abstract logger appender
 */
export abstract class Appender {
  protected config: AppenderConfig;

  constructor(config: AppenderConfig) {
    if (config.minLevel == null) {
      config.minLevel = LogLevel.Debug;
    }
    if (config.maxLevel == null) {
      config.maxLevel = LogLevel.Emergency;
    }
    if (config.minLevel < config.maxLevel) {
      let m = config.minLevel;
      config.minLevel = config.maxLevel;
      config.maxLevel = m;
    }
    this.config = config;
  }

  public abstract log(level: LogLevel, ...args: any[]): void;
}
