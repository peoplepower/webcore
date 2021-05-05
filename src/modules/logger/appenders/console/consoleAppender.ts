import { Appender } from '../appender';
import { ConsoleAppenderConfig } from './consoleAppenderConfig';
import { LogLevel } from '../../logLevel';

/**
 * Console logger appender
 */
export class ConsoleAppender extends Appender {

  protected config: ConsoleAppenderConfig;

  private readonly consoleStyle: { [logLevel: string]: string };

  constructor(config: ConsoleAppenderConfig) {
    if (!config) {
      // Default config
      config = new ConsoleAppenderConfig();
    }
    super(config);
    this.config = config;

    // Styles for console messages
    this.consoleStyle = {};
    this.consoleStyle[LogLevel.Emergency] = 'color: dark-red; font-size: xx-large; background-color: red';
    this.consoleStyle[LogLevel.Alert] = 'color: red; font-size: x-large; background-color: #fff0f0';
    this.consoleStyle[LogLevel.Critical] = 'color: red; font-size: large; background-color: #fff0f0';
    this.consoleStyle[LogLevel.Error] = 'color: red; background-color: #fff0f0';
    this.consoleStyle[LogLevel.Warn] = 'color: #e87a20;';
    this.consoleStyle[LogLevel.Notice] = 'color: blue;';
    this.consoleStyle[LogLevel.Info] = '';
    this.consoleStyle[LogLevel.Debug] = 'color: gray;';
  }

  log(level: LogLevel, ...args: any[]): void {
    if (this.config.maxLevel <= level && level <= this.config.minLevel && args.length > 0) {
      if (this.consoleStyle[level]) { // todo check if colors are supported
        if (args[0] && (typeof args[0] === 'string' || args[0] instanceof String)) {
          args.splice(1, 0, this.consoleStyle[level]);
          args[0] = '%c' + args[0];
        }
      }
      console.log(...args);
    }
  }

}
