import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface DalResponsePromise extends Promise<any> {
}

export interface DalRequestConfig extends AxiosRequestConfig {
  /**
   * Set this flag if you want to skip API_KEY header automatic add
   */
  noAuth?: boolean;

  /**
   * Ignore transformations made in ApiResponseInterceptor (needed for request repeating)
   */
  ignoreApiResponseTransformation?: boolean;

  /**
   * Request retry count
   */
  retryCount?: number;
}

export interface DalResponse extends AxiosResponse {
  config: DalRequestConfig;
}

export interface DalError extends AxiosError {
  config: DalRequestConfig;
  response?: DalResponse;
}
