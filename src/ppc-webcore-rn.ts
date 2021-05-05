import { WebCore } from './ppc-webcore';
import { LocalStorageProvider } from './modules/localStorage/localStorage';
import { AsyncStorage } from 'react-native';

/**
 * You also will need btoa polyfill
 *
 * import {decode, encode} from 'base-64'
 *
 * if (!global.btoa) {
 *   global.btoa = encode;
 * }
 *
 * if (!global.atob) {
 *   global.atob = decode;
 * }
 */

const ASYNC_STORAGE_KEY = 'PPC_WEBCORE_DATA';

class LocalStorageMimic implements LocalStorageProvider {

  private storageObject: { [key: string]: any } = {};

  load(): Promise<void> {
    return AsyncStorage.getItem(ASYNC_STORAGE_KEY)
      .then((data: string) => {
        try {
          const obj = JSON.parse(data || '');
          this.storageObject = obj || {};
        } catch (e) {
          this.storageObject = {};
        }
      }, (err: any) => {
        console.warn(err);
        this.storageObject = {};
      });
  }

  private save() {
    let str = JSON.stringify(this.storageObject);
    AsyncStorage.setItem(ASYNC_STORAGE_KEY, str);
  }

  clear(): void {
    this.storageObject = {};
    AsyncStorage.clear();
  }

  getItem(key: string): string | null {
    return this.storageObject[key];
  }

  removeItem(key: string): void {
    delete this.storageObject[key];
    this.save();
  }

  setItem(key: string, value: string): void {
    this.storageObject[key] = value;
    this.save();
  }
}

let ls = new LocalStorageMimic();

const wsPromise = ls.load()
  .then(() => {
    let webCore = new WebCore('dev', {localStorage: ls});
    // webCore.services.auth.loginByKey(apiKey);
    // TODO it you need to use API_KEY from external - we could add it here somehow
    return webCore;
  });

export default wsPromise;
