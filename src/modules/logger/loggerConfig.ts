import { LogLevelAwareConfig } from './logLevelAwareConfig';
import { ConsoleAppenderConfig } from './appenders/console/consoleAppenderConfig';
import { LocalStorageAppenderConfig } from './appenders/localStorage/localStorageAppenderConfig';
import { XhrAppenderConfig } from './appenders/xhr/xhrAppenderConfig';

export class LoggerConfig extends LogLevelAwareConfig {
  console?: ConsoleAppenderConfig;

  localStorage?: LocalStorageAppenderConfig;

  xhr?: XhrAppenderConfig;
}
