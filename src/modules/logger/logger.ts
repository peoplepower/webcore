import { LogLevel } from './logLevel';
import { Appender } from './appenders/appender';
import { LoggerConfig } from './loggerConfig';
import { ConsoleAppender } from './appenders/console/consoleAppender';
import { ConsoleAppenderConfig } from './appenders/console/consoleAppenderConfig';
import { LocalStorageAppender } from './appenders/localStorage/localStorageAppender';
import { XhrAppender } from './appenders/xhr/xhrAppender';
import { Tuner } from '../tuner/tuner';
import { inject, injectable } from '../common/di';

const DEFAULT_MIN_LEVEL = LogLevel.Debug;
const DEFAULT_MAX_LEVEL = LogLevel.Emergency;

@injectable('Logger')
export class Logger {
  @inject('Tuner') private readonly tuner!: Tuner;

  /**
   * Array of Appenders
   * @type {Array<Appender>}
   */
  protected appenders: Appender[] = [];

  protected config!: LoggerConfig;

  constructor() {
    if (this.tuner.config && this.tuner.config.logger) {
      this.applyConfig(this.tuner.config.logger);
    }
    this.tuner.onChangeEvent.on((config) => {
      if (config && config.logger) {
        this.applyConfig(config.logger);
      }
    });
  }

  protected applyConfig(config: LoggerConfig) {
    if (this.config && this.config === config) {
      return;
    }

    // validation and fixing config:
    if (!config) {
      // Default config
      config = new LoggerConfig();
      this.appenders = [new ConsoleAppender(new ConsoleAppenderConfig())];
    }
    if (config.minLevel == null) {
      config.minLevel = DEFAULT_MIN_LEVEL;
    }
    if (config.maxLevel == null) {
      config.maxLevel = DEFAULT_MAX_LEVEL;
    }
    if (config.minLevel < config.maxLevel) {
      let m = config.minLevel;
      config.minLevel = config.maxLevel;
      config.maxLevel = m;
    }

    // applying config
    this.config = config;
    this.appenders = [];
    if (config.console) {
      this.appenders.push(new ConsoleAppender(config.console));
    }
    if (config.localStorage) {
      this.appenders.push(new LocalStorageAppender(config.localStorage));
    }
    if (config.xhr) {
      this.appenders.push(new XhrAppender(config.xhr));
    }

    if (!this.appenders || this.appenders.length <= 0) {
      console.warn('Logger error: Empty Appenders list in logger config.');
    }
  }

  private log(level: LogLevel, ...args: any[]) {
    if (this.config.maxLevel! <= level && level <= this.config.minLevel! && this.appenders) {
      for (let i = 0; i < this.appenders.length; i++) {
        const appender = this.appenders[i];
        if (appender) {
          appender.log(level, ...args);
        }
      }
    }
  }

  emergency(...args: any[]) {
    this.log(LogLevel.Emergency, ...args);
  }

  alert(...args: any[]) {
    this.log(LogLevel.Alert, ...args);
  }

  critical(...args: any[]) {
    this.log(LogLevel.Critical, ...args);
  }

  error(...args: any[]) {
    this.log(LogLevel.Error, ...args);
  }

  warn(...args: any[]) {
    this.log(LogLevel.Warn, ...args);
  }

  notice(...args: any[]) {
    this.log(LogLevel.Notice, ...args);
  }

  info(...args: any[]) {
    this.log(LogLevel.Info, ...args);
  }

  debug(...args: any[]) {
    this.log(LogLevel.Debug, ...args);
  }
}
