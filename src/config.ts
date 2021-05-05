import { WebCoreConfig } from './modules/tuner/config';
import { LogLevel } from './modules/logger/logLevel';

let configs: { [env: string]: WebCoreConfig[] } = {
  'default': [
    {
      localStoragePrefix: 'ppc.',
      ping: {
        initialPingInterval: 1000,
        pingIntervalIncrease: 1000,
        maxPingInterval: 5000,
        afterPingTimeout: 100,
      },
    },
  ],
  'dev': [
    {
      logger: {
        minLevel: LogLevel.Debug,
        maxLevel: LogLevel.Emergency,
        console: {
          minLevel: LogLevel.Debug,
          maxLevel: LogLevel.Emergency,
        },
        localStorage: {
          minLevel: LogLevel.Debug,
          maxLevel: LogLevel.Emergency,
          localStorageKey: 'Logger',
          size: 500,
        },
      },
    },
  ],
  'prod': [
    {
      logger: {
        minLevel: LogLevel.Info,
        maxLevel: LogLevel.Emergency,
        console: {
          minLevel: LogLevel.Info,
          maxLevel: LogLevel.Emergency,
        },
        xhr: {
          minLevel: LogLevel.Debug,
          maxLevel: LogLevel.Emergency,
          triggerLevel: LogLevel.Critical,
          size: 10,
          method: 'POST',
          path: '/logs',
        },
      },
    },
  ],
  'test': [
    {
      logger: {
        minLevel: LogLevel.Info,
        maxLevel: LogLevel.Emergency,
        console: {
          minLevel: LogLevel.Info,
          maxLevel: LogLevel.Emergency,
        },
      },
    },
  ],
};

export default configs;
