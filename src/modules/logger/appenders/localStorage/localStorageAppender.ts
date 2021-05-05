import { LocalStorageAppenderConfig } from './localStorageAppenderConfig';
import { Appender } from '../appender';
import { LogMessage } from '../../logMessage';
import { LogLevel } from '../../logLevel';

/**
 * LocalStorage logger appender
 */
export class LocalStorageAppender extends Appender {

  protected config: LocalStorageAppenderConfig;
  protected messages: LogMessage[];

  constructor(config: LocalStorageAppenderConfig) {
    if (!config) {
      // Default config
      config = new LocalStorageAppenderConfig();
    }
    super(config);
    this.config = config;
    this.messages = [];

    if (globalThis && 'localStorage' in globalThis && globalThis['localStorage'] !== null) {
      let me = this;
      if (globalThis.addEventListener) {
        globalThis.addEventListener('unload', function () {
          me.dropToLocalStorage();
        });
      } else {
        globalThis.onunload = function () {
          me.dropToLocalStorage();
        };
      }

      setInterval(function () {
        me.dropToLocalStorage();
      }, 5000);
    } else {
      console.warn('localStorage is unavailable, so LocalStorageAppender for logger is not working');
    }
  }

  public log(level: LogLevel, ...args: any[]): void {
    if (this.config.maxLevel <= level && level <= this.config.minLevel) {
      // store messages
      this.messages.push(new LogMessage(level, args));
      if (this.messages.length > this.config.size) {
        this.messages.shift();
      }
    }
  }

  public dropToLocalStorage() {
    let messages = this.messages;
    this.messages = [];
    try {
      let lsValue = localStorage.getItem(this.config.localStorageKey);
      let oldMessages: LogMessage[] = lsValue ? JSON.parse(lsValue) || [] : [];
      oldMessages.concat(messages);
      if (oldMessages.length > this.config.size) {
        oldMessages = oldMessages.slice(oldMessages.length - this.config.size - 1, oldMessages.length - 1);
      }
      localStorage.setItem(this.config.localStorageKey, JSON.stringify(oldMessages));
    } catch (ex) {
      console.warn('Unable to save logs to localStorage');
      console.warn(ex);
    }
  }

}
