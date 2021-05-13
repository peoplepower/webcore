# WebCore Client SDK

JavaScript/TypeScript SDK for People Power IoT Suite public API - <https://iotapps.docs.apiary.io>

## Installation

People Power packages provided by GitHub package registry, so add destination of the organisation-based packages into *~/.npmrc*

`@peoplepower:registry=https://npm.pkg.github.com`

Then, install package using `npm` (you can use `yarn` as well)

`npm install @peoplepower/webcore --save`

## Import

WebCore is bundled to several formats:

 * `dist/ppc-webcore.cjs.js` - CommonJS module (for Node)
 * `dist/ppc-webcore.esm.js` - ES module (for bundlers)
 * `dist/types/` - folder for type definitions and compiled sources per-file (not bundled). This folder contains project in ES module format. So you could use sources from there directly if you want to import interfaces, enums or separate classes (e.g. in another Typescript project).
   
Please, avoid importing two modules at the same time. This will lead to the appearance of hard-to-diagnose errors.

Bundles are compiled to ES5 format, so it should work almost in every environment.
We could enable browser-friendly UMD build (for injecting right into the web page) by request.

### Typescript Import

``` typescript
import { WebCore } from '@peoplepower/webcore/dist/types/ppc-webcore';
import type { Environment } from "@peoplepower/webcore/dist/types/modules/envir/environment";
import type { WebCoreConfig } from "@peoplepower/webcore/dist/types/modules/tuner/config";

const env: Environment = 'dev'; // or `'prod'`, or `process.env.NODE_ENV`
const config: WebCoreConfig = {
  localStoragePrefix: 'LOCAL_STORAGE_PREFIX'
  // ...
  // Check WebCoreConfig interface for more options
};

const webCoreInstance = new WebCore(env, config);

export default webCoreInstance;
```

### Bundler (webpack) Import with JavaScript

``` javascript
import { WebCore } from '@peoplepower/webcore';

const env = 'prod';
const config = {
  localStoragePrefix: 'LOCAL_STORAGE_PREFIX'
};

const webCoreInstance = new WebCore(env, config);

export default webCoreInstance;
```

## Configuration

You can use [environment option](src/modules/envir/environment.ts) to set up [default configuration options](/src/config.ts).

### Configuration Object

WebCore is designed to work as-is without additional configuration. But you could customise default config.
Check out [configuration interface](src/modules/tuner/config.ts) to see available options.

## Usage

### Auth and Current User Info

WebCore automatically store last used API_KEY in local storage and re-authenticate on startup. It also stores current user information in cache

``` typescript
import { WebCore } from '/webcoreInstanceModule'; // file described above.

/**
 * Check if we are currently authenticated (sync)
 */
isAuthenticated(): boolean {
  return WebCore.services.auth.isAuthenticated();
}

login(username: string, pwd: string): Promise<any> {
  return WebCore.services.auth.login(username, pwd, false);
}

loginByKey(apiKey: string): Promise<any> {
  return WebCore.services.auth.loginByKey(apiKey);
}

logout(): Promise<any> {
  return WebCore.services.auth.logoutFromThisBrowser();
}

/**
 * Send an SMS verification code to specific user.
 * @param {string} username The username.
 * @param {string} [brand] Optional brand name.
 * @returns {Promise<SendPasscodeApiResponse>}
 */
sendPasscode(username: string, brand?: string): Promise<SendPasscodeApiResponse> {
  let str = username.replace(/\+/g, '');
  return WebCore.services.auth.sendPasscode(str, false, brand);
}

/**
 * Log in into the system by username and passcode
 * @param {string} username The username.
 * @param {string} passcode Passcode.
 * @returns {Promise<LoginInfo>}
 */
loginByPasscode(username: string, passcode: string): Promise<LoginInfo> {
  let str = username.replace(/\+/g, '');
  return WebCore.services.auth.loginByPasscode(str, passcode, false);
}

/**
 * Get current user. Note that promise will not be resolved until you log in.
 * @param {boolean} [force] set it true to get information from server (ignore cached value)
 * @return {Promise<UserInformation>}
 */
getCurrentUser(force?: boolean): Promise<UserInformation> {
  return WebCore.services.user.getCurrentUserInfo(force);
}

/**
 * Get promise of current user avatar
 */
public getUserAvatarUrl(): Promise<string | undefined> {
  return WebCore.services.user.getCurrentUserInfo()
    .then((data) => {
      if (data?.user?.avatarFileId) {
        return WebCore.services.files.getApplicationFileDownloadUrl(data.user.avatarFileId);
      }
    });
}
```

### React Native Example

This library was originally designed to work in browser or NodeJS environment, but you could also use it in React Native.
The problem is React Native has no `localStorage` and `btoa`.

This realization is just example. You should adapt it for your environment. The same code is located [here](src/ppc-webcore-rn.ts).

``` typescript
import { WebCore } from '@peoplepower/webcore';
import { LocalStorageProvider } from './modules/localStorage/localStorage';
import { Environment } from "./modules/envir/environment";
import { WebCoreConfig } from "./modules/tuner/config";
import { AsyncStorage } from 'react-native';
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
      enabled: false
    },
    xhr: {
      enabled: false
    }
  },

  localStorage: ls,

  serverUrl: "https://app.peoplepowerco.com/", // or "https://sboxall.peoplepowerco.com"
  cloudName: "Production" // or "sbox"

  // Sandbox configuration:
  // serverUrl: "https://sboxall.peoplepowerco.com",
  // cloudName: "sbox"
};

const wsPromise = ls.load()
  .then(() => {
    let webCore = new WebCore(env, config);
    // webCore.services.auth.loginByKey(apiKey);
    return webCore;
  });
```

## Support

For more usage options or examples you could refer to the source code. Almost every method is covered by comments.

If you need some additional feature, something is not working properly, or you don't understand something - feel free to look into [GitHub Issues](https://github.com/peoplepower/webcore/issues).
