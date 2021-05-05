import { LogLevel } from './logLevel';

export class LogMessage {
  constructor(level: LogLevel, ...args: any[]) {
    this.timestamp = new Date();
    this.message = args;
    this.level = level;
  }

  /**
   * Time stamp
   */
  timestamp: Date;

  /**
   * Level of message
   */
  level: LogLevel;

  /**
   * Message arguments
   */
  message: any | any[];
}
