import { LogLevelAwareConfig } from '../logLevelAwareConfig';

/**
 * Abstract appender config
 */
export abstract class AppenderConfig extends LogLevelAwareConfig {
  /**
   * Is Appender enabled
   */
  enabled?: boolean = true;
}
