import { DalError, DalRequestConfig, DalResponse } from '../interfaces';

export interface Interceptor {
  request?<T>(config: DalRequestConfig<T>): DalRequestConfig<T> | Promise<DalRequestConfig<T>>;

  requestError?<T>(error: DalError<T>): DalError<T> | DalRequestConfig<T> | Promise<DalRequestConfig<T>>;

  response?<T>(response: DalResponse<T>): DalResponse<T> | Promise<DalResponse<T>>;

  responseError?<T>(error: DalError<T>): DalResponse<T> | Promise<DalResponse<T>> | Promise<DalError<T>>;
}
