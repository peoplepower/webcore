import { Interceptor } from './interceptor';
import { DalResponse } from '../interfaces';
import { Logger } from '../../../modules/logger/logger';
import { inject } from '../../../modules/common/di';

/**
 * Interceptor for dealing with API response http statuses, codes inside the response body, etc.
 * Here we trying to determine which request is successful, which is not, resolving the promise according to that
 */
export class ApiResponseInterceptor implements Interceptor {

  @inject('Logger') logger: Logger;

  constructor() {
  }

  response(response: DalResponse): any {
    if (response?.config?.ignoreApiResponseTransformation === true) {
      return response;
    }
    if (response && response.config && response.config.responseType === 'text') {
      return response.data;
    }
    if (response === null || response.data === null) {
      this.logger.error('[ApiResponseInterceptor] Response is empty!', JSON.stringify(response, null, 2));
      return Promise.reject(response);
    }
    // tslint:disable-next-line:triple-equals
    if (response.data && response.data.resultCode == null) {
      this.logger.debug('[ApiResponseInterceptor] Wrong server response format! No resultCode field!', JSON.stringify(response, null, 2));
    }
    if (response.data && response.data.resultCode && response.data.resultCode !== 0) {
      return Promise.reject(response.data);
    }
    return response.data;
  }
}
