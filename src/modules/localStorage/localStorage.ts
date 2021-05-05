import { Logger } from '../logger/logger';
import { inject, injectable } from '../common/di';
import { Tuner } from '../tuner/tuner';

@injectable('WcStorage')
export class WcStorage {

  @inject('Logger') private readonly logger: Logger;
  @inject('Tuner') private readonly tuner: Tuner;

  private ls: LocalStorageProvider = this.tuner?.config?.localStorage || localStorage;

  public get<T>(path: string): T | undefined | null {
    if (!path) {
      this.logger.error(`WcStorage.get("${path}"): empty path`);
      throw new Error('Unable to get value with empty path from localStorage');
    }
    // if not in local storage, the string "undefined" is returned sometimes
    let text: string | undefined | null = this.ls.getItem(this.tuner.config.localStoragePrefix + path);
    if (text === null || typeof text === 'undefined' || text === 'undefined') {
      // this.logger.debug(`WcStorage.get("${path}") - path not found, returned undefined`);
      return undefined;
    } else if (text === 'null') {
      return null;
    } else {
      //logger.debug(`WcStorage.read("${path}")`);
      // Try to parse a json
      try {
        return <T>JSON.parse(text);
      } catch (e) {
        return <T><any>text;
      }
    }
  }

  public set(path: string, data: string | number | boolean | object | null | undefined): void {
    if (typeof data === 'undefined') {
      this.logger.error(`WcStorage.set("${path}"): empty data`);
      throw new Error('Unable to save undefined value in localStorage');
    }
    if (!path) {
      this.logger.error(`WcStorage.set("${path}"): empty path`);
      throw new Error('Unable to save value with empty path in localStorage');
    }

    let dataStr: string;
    if (typeof data === 'string' || typeof (data) === 'boolean' || typeof (data) === 'number') {
      dataStr = data.toString();
    } else {
      dataStr = JSON.stringify(data);
    }

    //logger.debug(`WcStorage.set("${path}", "${dataStr}")`);
    this.ls.setItem(this.tuner.config.localStoragePrefix + path, dataStr);
  }

  public remove(path: string): void {
    if (!path) {
      this.logger.error(`WcStorage.remove("${path}"): empty path`);
      return;
    }
    //logger.debug(`WcStorage.remove("${path}")`);
    this.ls.removeItem(this.tuner.config.localStoragePrefix + path);
  }

  /**
   * Clear all Local Storage entries
   * WARNING! Use this feature carefully, because it will remove all data stored in localStorage, e.g. login info
   */
  public clear() {
    this.ls.clear();
  }
}

/**
 * Custom localStorage realization
 */
export interface LocalStorageProvider {
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
   */
  getItem(key: string): string | null;

  /**
   * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
   */
  removeItem(key: string): void;

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   */
  setItem(key: string, value: string): void;

  /**
   * Empties the list associated with the object of all key/value pairs, if there are any.
   */
  clear(): void;
}
