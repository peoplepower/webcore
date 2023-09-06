import { WebCore } from './ppc-webcore';
import { LocalStorageProvider } from './modules/localStorage/localStorage';
import { Environment } from './modules/envir/environment';
import { WebCoreConfig } from './modules/tuner/config';
// @ts-ignore
import { AsyncStorage } from 'react-native';
// @ts-ignore
import { decode, encode } from 'base-64';

// You also will need btoa polyfill
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const ASYNC_STORAGE_KEY = 'PPC_WEBCORE_DATA';

/**
 * Fake sync local storage. You could use any realization that fit your needs.
 */
class LocalStorageMimic implements LocalStorageProvider {
  constructor() {
    return new Proxy(this, this);
  }

  get length(): number {
    return Object.keys(this.storageObject).length;
  }

  [name: string]: any;

  get(target, key) {
    return this[key] || this.storageObject[key];
  }

  key(index: number): string | null {
    return Object.entries(this.storageObject)
      .find(([key, value], i) => index === i)
      ?.[1];
  }

  private storageObject: { [key: string]: any } = {};

  load(): Promise<void> {
    return AsyncStorage.getItem(ASYNC_STORAGE_KEY).then(
      (data: string) => {
        try {
          const obj = JSON.parse(data || '');
          this.storageObject = obj || {};
        } catch (e) {
          this.storageObject = {};
        }
      },
      (err: any) => {
        console.warn(err);
        this.storageObject = {};
      },
    );
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

const ls = new LocalStorageMimic();

const env: Environment = 'dev';

const config: WebCoreConfig = {
  logger: {
    localStorage: {
      enabled: false,
    },
    xhr: {
      enabled: false,
    },
  },
  localStorage: ls,
};

const wsPromise = ls.load().then(() => {
  let webCore = new WebCore(env, config);
  // webCore.services.auth.loginByKey(apiKey);
  return webCore;
});

export default wsPromise;
