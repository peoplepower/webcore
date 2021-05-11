import { Interceptor } from './interceptor';
import { DalError, DalRequestConfig, DalResponse } from '../interfaces';
import { OfflineService } from '../../services/offlineService';
import { inject } from '../../../modules/common/di';
import { Dal } from '../dal';

/**
 * HTTP response codes for server unavailability detection
 * @type {number[]}
 */
const SERVER_UNAVAILABLE_CODES = [
  403,
  404,
  405,
  406,
  407,
  408,
  409,
  410,
  429,
  434,
  501,
  502,
  503,
  504,
  509,
  0,
  null,
  undefined,
  NaN, // fancy cases with IE %)
];

/**
 * We will not retry requests to these URLs
 * @type {string[]}
 */
const IGNORED_URLS = ['/watch', '/logout', '/login'];

/**
 * How many attempts to send a message to make (excluding sending ping messages)
 */
const RETRY_COUNT_LIMIT = 3;

/**
 * Interceptor that will cache requests when we are offline or server is down
 */
export class OfflineInterceptor implements Interceptor {
  @inject('OfflineService') protected readonly offlineService: OfflineService;

  public dal: Dal | undefined;

  constructor() {}

  request(config: DalRequestConfig): any {
    if (this.offlineService.offline) {
      return this.offlineService.waitOnline().then(() => config);
    }
    return config;
  }

  requestError(error: DalError): any {
    return Promise.reject(error);
  }

  response(response: DalResponse): any {
    if (
      response &&
      SERVER_UNAVAILABLE_CODES.some((el) => el === response.status) &&
      response.config &&
      response.config.url &&
      !IGNORED_URLS.some((el) => response.config.url!.indexOf(el) !== -1)
    ) {
      if (response.config.retryCount! >= RETRY_COUNT_LIMIT) {
        return response;
      }

      return this.repeatRequest(response.config);
    }
    return response;
  }

  responseError(error: DalError): any {
    if (!error || !error.request) {
      return Promise.reject(error);
    }

    if (!error.response || SERVER_UNAVAILABLE_CODES.some((el) => el === error.response!.status)) {
      if (error.config && error.config.url && !IGNORED_URLS.some((el) => error.config.url!.indexOf(el) !== -1)) {
        if (error.config.retryCount! >= RETRY_COUNT_LIMIT) {
          return Promise.reject(error);
        }

        return this.repeatRequest(error.config);
      }
    }

    return Promise.reject(error);
  }

  private repeatRequest(config: DalRequestConfig) {
    return this.offlineService.goOfflineAndWaitOnline().then(() => {
      config.retryCount = config.retryCount ? config.retryCount + 1 : 1;
      config.ignoreApiResponseTransformation = true;
      return this.dal!.request(config).then((data) => {
        data.config.ignoreApiResponseTransformation = false;
        return data;
      });
    });
  }
}
