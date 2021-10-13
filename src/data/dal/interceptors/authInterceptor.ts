import { Interceptor } from './interceptor';
import { DalError, DalRequestConfig, DalResponse } from '../interfaces';
import { AuthService } from '../../services/authService';
import { inject } from '../../../modules/common/di';

/**
 * Interceptor automatically adding the "API_KEY" authorisation header
 */
export class AuthInterceptor implements Interceptor {
  @inject('AuthService') protected readonly authService!: AuthService;

  // http://docs.iotapps.apiary.io/reference/login-and-logout/login/login-by-username-and-password
  // http://docs.iotapps.apiary.io/reference/login-and-logout/login-with-an-existing-api-key
  // http://docs.iotapps.apiary.io/reference/login-and-logout/operation-token/get-operation-token

  constructor() {
  }

  request(config: DalRequestConfig<any>): any {
    if (!config.noAuth && (!config.headers || !config.headers['API_KEY']) && this.authService) {
      if (!config.headers) {
        config.headers = {}; //Just to make sure it is initialized in case its undefined
      }
      let key = this.authService.apiKey; // todo make getting api key as promise to let it working if we are logging in.
      if (key && key.length >= 0) {
        config.headers['API_KEY'] = key;
      }
    }

    return config;
  }

  response(response: DalResponse<any>): any {
    if (response && response.data && response.data.resultCode === 2) {
      // unauthorised
      this.authService.logoutFromThisBrowser();
      this.authService.onNeedRelogin.trigger();
    } else if (response && response.data && response.data.keyExpireMs && this.authService.isAuthenticated()) {
      this.authService.setUpKeyExpireTimeout(response.data.keyExpireMs);
    }
    return response;
  }

  responseError(error: DalError<any>): any {
    if (error && error.response && error.response.data && error.response.data.resultCode === 2) {
      // unauthorised
      this.authService.onNeedRelogin.trigger();
    }
    return Promise.reject(error);
  }
}
