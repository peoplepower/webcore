import {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  HeadersDefaults,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders
} from 'axios';

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

export interface DalRequestConfigInternal<T> extends DalRequestConfig<T>, InternalAxiosRequestConfig<T> {
  headers: AxiosRequestHeaders;
}

export interface DalResponse<T> extends AxiosResponse<T> {
  config: DalRequestConfigInternal<T>;
}

export interface DalError<T> extends AxiosError<T> {
  config: DalRequestConfigInternal<T>;
  response?: DalResponse<T>;
}

export interface CreateDalDefaults<D = any> extends Omit<DalRequestConfig<D>, 'headers'> {
  headers?: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults>;
}
