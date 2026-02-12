import { LiteEvent } from '../common/liteEvent';
import { injectable } from '../common/di';

export type Environment =
  | 'dev' // Development environment
  | 'test' // Automatic tests environment
  | 'prod'; // Production environment

const DEFAULT_ENV: Environment = 'dev'; // Default environment

/**
 * Module to rule the environment
 */
@injectable('Envir')
export class Envir {
  private _environment: Environment = DEFAULT_ENV;

  public readonly onChangeEvent = new LiteEvent<Environment>();

  public get environment(): Environment {
    return this._environment;
  }

  public set environment(theEnvironment: Environment) {
    if (theEnvironment !== this._environment) {
      this._environment = theEnvironment;
      this.onChangeEvent.trigger(this._environment);
    }
  }
}
