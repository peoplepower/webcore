import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface DalResponsePromise<T> extends Promise<T> {
}

export interface DalRequestConfig<T> extends AxiosRequestConfig<T> {
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

export interface DalResponse<T> extends AxiosResponse<T> {
  config: DalRequestConfig<T>;
}

export interface DalError<T> extends AxiosError<T> {
  config: DalRequestConfig<T>;
  response?: DalResponse<T>;
}
