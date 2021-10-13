import { Interceptor } from './interceptor';
import { DalRequestConfig } from '../interfaces';

/**
 * Interceptor to set API request Content-type header. We always JSON in UTF-8
 */
export class JsonContentTypeInterceptor implements Interceptor {
  private readonly METHODS = ['POST', 'PUT']; // uppercase
  private readonly JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
  private readonly CONTENT_TYPE_HEADER = 'Content-Type';

  constructor() {
  }

  request(config: DalRequestConfig<any>): any {
    let method = config.method!.toUpperCase();
    if (this.METHODS.some((m) => m === method) && (!config.headers || !config.headers[this.CONTENT_TYPE_HEADER])) {
      if (!config.headers) {
        config.headers = {}; // Just to make sure it is initialized in case its undefined
      }
      config.headers[this.CONTENT_TYPE_HEADER] = this.JSON_CONTENT_TYPE;
    }

    return config;
  }
}
