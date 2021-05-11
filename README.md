## WebCore - SDK for People Power IoT Suite public API

### Installation

Install npm package to your destination

`npm install git+ssh://git@github.com/peoplepower/webcore.git`

### Import

WebCore is bundled to CommonJS module (for Node) and ES module (for bundlers) formats.
Bundles are compiled to ES5 format, so it should work almost in every environment. 
We could enable browser-friendly UMD build (for injecting right into the web page) by request.

### Typescript import

``` typescript
import { WebCore } from '@peoplepower/webcore';
import { Environment } from "@peoplepower/webcore/dist/types/modules/envir/environment";
import { WebCoreConfig } from "@peoplepower/webcore/dist/types/modules/tuner/config";

const env: Environment = 'dev'; // or `'prod'`, or `process.env.NODE_ENV`

const config: WebCoreConfig = {
  localStoragePrefix: 'LOCAL_STORAGE_PREFIX'
  // ...
  // Check WebCoreConfig interface for more options
};

const webCoreInstance = new WebCore(env, config);

export default webCoreInstance;
```

### Bundler (webpack) import with javascript

``` javascript
import { WebCore } from '@peoplepower/webcore';

const env = 'prod';

const config = {
  localStoragePrefix: 'LOCAL_STORAGE_PREFIX'
};

const webCoreInstance = new WebCore(env, config);

export default webCoreInstance;
```

### Environment object

You can set up [Environment option](src/modules/envir/environment.ts) to set up [default configuration options](/src/config.ts).

### Configuration object

Webcore is designed to work as-is without additional configuration. But you could customise default config.
Check out [configuration interface](src/modules/tuner/config.ts) to see available options.

### Usage

#### Auth and current user info

Webcore automatically store last used API_KEY in local storage and re-authenticate on startup. It also stores current user information in cache

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

#### React Native usage

This library was originally designed to work in browser or Node.js environment, but you could also use it in React Native.
The problem is React Native has no `localStorage` and `btoa`.

This realization is just example. You should adapt it for your environment by yourself. The same code is located [here](src/ppc-webcore-rn.ts)

``` typescript
import { WebCore } from './ppc-webcore';
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
  localStorage: ls
};

const wsPromise = ls.load()
  .then(() => {
    let webCore = new WebCore(env, config);
    // webCore.services.auth.loginByKey(apiKey);
    return webCore;
  });

```

### More

For more usage options or examples you could refer to the source code. Almost every method is covered by comments.

If you need some additional feature, something is not working properly, or you can't understand something - feel free to create GitHub Issue.
