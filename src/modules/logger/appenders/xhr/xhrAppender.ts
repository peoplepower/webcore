import { XhrAppenderConfig } from './xhrAppenderConfig';
import { Appender } from '../appender';
import { LogMessage } from '../../logMessage';
import { LogLevel } from '../../logLevel';

/**
 * XHR logger appender
 */
export class XhrAppender extends Appender {
  protected override config: XhrAppenderConfig;
  protected messages: LogMessage[];

  constructor(config: XhrAppenderConfig) {
    if (!config) {
      // Default config
      config = new XhrAppenderConfig();
    }
    super(config);
    this.config = config;
    this.messages = [];
  }

  log(level: LogLevel, ...args: any[]): void {
    if (!this.config.enabled) {
      return;
    }
    if (this.config.maxLevel! <= level && level <= this.config.minLevel!) {
      // store messages
      this.messages.push(new LogMessage(level, args));
      if (this.messages.length > this.config.size!) {
        this.messages.shift();
      }

      if (level <= this.config.triggerLevel!) {
        // send it async
        this.send();
      }
    }
  }

  private send() {
    const messages = this.messages;
    this.messages = [];
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      xhr.open(this.config.method!, this.config.path!, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (this.config.headers) {
        for (const headerName in this.config.headers) {
          xhr.setRequestHeader(headerName, this.config.headers[headerName]!);
        }
      }
      xhr.send(JSON.stringify(new XhrLogMessagePackage(messages)));
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log('Unable to send logs to server: ' + xhr.status + ' ' + xhr.statusText);
        } else {
          console.log('Logs were sent to the server');
        }
      };
      xhr.ontimeout = function () {
        console.log('Unable to send logs to server: request timeout');
      };
    });
  }
}

export class XhrLogMessagePackage {
  public messages: LogMessage[];
  public browserInfo?: {
    appCodeName: string;
    appName: string;
    appVersion: string;
    cookieEnabled: boolean;
    platform: string;
    userAgent: string;
    language: string;
    languages?: string[];
    oscpu: string;
    vendor: string;
    vendorSub: string;
  };

  constructor(messages: LogMessage[]) {
    this.messages = messages;
    if (navigator) {
      this.browserInfo = {
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        cookieEnabled: navigator.cookieEnabled,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages ? navigator.languages.slice(0) : undefined,
        // @ts-ignore
        oscpu: navigator.oscpu as string,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
      };
    }
  }
}
