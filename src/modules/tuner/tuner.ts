import webcoreConfig from '../../config';
import { LiteEvent } from '../common/liteEvent';
import { WebCoreConfig } from './config';
import { Envir } from '../envir/envir';
import { inject, injectable } from '../common/di';
import { Environment } from '../envir/environment';

const DEFAULT_CONFIG_NAME = 'default';

/**
 * Module for handling configs
 */
@injectable('Tuner')
export class Tuner {
  @inject('Envir') private readonly envir!: Envir;

  private readonly configs: {
    // actually it's `[env: Environment]: WebCoreConfig`, but typescript doesn't support this.
    // Environment is actually string, so
    [env: string]: WebCoreConfig[];
  };

  private currentConfig!: WebCoreConfig;

  get config(): WebCoreConfig {
    return this.currentConfig;
  }

  public readonly onChangeEvent = new LiteEvent<WebCoreConfig>();

  constructor() {
    this.configs = webcoreConfig;
    this.loadConfig();
    let me = this;
    this.envir.onChangeEvent.on((env) => {
      if (env) {
        me.loadConfig();
      }
    });
  }

  private loadConfig() {
    let defaultConfigs = this.configs[DEFAULT_CONFIG_NAME] || [];
    let envConfigs = this.configs[this.envir.environment] || [];
    let configs = [...defaultConfigs, ...envConfigs];
    let newCfg = <WebCoreConfig>Object.assign({}, ...configs);
    if (!this.checkJsonEquality(newCfg, this.currentConfig)) {
      this.currentConfig = newCfg;
      this.onChangeEvent.trigger(this.currentConfig);
    }
  }

  /**
   * Function to compare two jsons
   * @param {any} x
   * @param {any} y
   */
  private checkJsonEquality(x: any, y: any): boolean {
    let me = this;

    if (x === y) {
      return true;
    }

    if (typeof x !== typeof y) {
      return false;
    }

    // functions
    if (x instanceof Function) {
      return x.toString() === y.toString();
    }

    // Null or undefined values
    if (x === null || x === undefined || y === null || y === undefined) {
      return x === y;
    }

    // Dates
    if (x instanceof Date && y instanceof Date) {
      return x.getTime() === y.getTime();
    }

    // Strings
    if (x instanceof String && y instanceof String) {
      return x.toString() === y.toString();
    }
    if (typeof x === 'string') {
      return x === y;
    }
    if (typeof x === 'boolean') {
      return x === y;
    }
    if (typeof x === 'number') {
      return x === y || (isNaN(x) && isNaN(y));
    }

    // Arrays
    if (Array.isArray(x) && Array.isArray(y)) {
      if (x.length !== y.length) {
        return false;
      }
      return x.every((e, i) => me.checkJsonEquality(x[i], y[i]));
    }

    // Nested objects
    if (typeof x === 'object') {
      let keys = Object.keys(x);
      return Object.keys(y).every((i) => keys.indexOf(i) !== -1) && keys.every((i) => me.checkJsonEquality(x[i], y[i]));
    }

    // All other cases
    if (x.valueOf && y.valueOf && x.valueOf() === y.valueOf()) {
      return true;
    }

    return false;
  }

  public addConfig(environment: Environment, config: WebCoreConfig) {
    this.configs[environment].push(config);
    this.loadConfig();
  }
}
