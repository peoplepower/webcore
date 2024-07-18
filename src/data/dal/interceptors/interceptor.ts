import { DalError, DalRequestConfigInternal, DalResponse } from '../interfaces';

export interface Interceptor {
  request?<T>(config: DalRequestConfigInternal<T>): DalRequestConfigInternal<T> | Promise<DalRequestConfigInternal<T>>;

  requestError?<T>(error: DalError<T>): DalError<T> | DalRequestConfigInternal<T> | Promise<DalRequestConfigInternal<T>>;

  response?<T>(response: DalResponse<T>): DalResponse<T> | Promise<DalResponse<T>>;

  responseError?<T>(error: DalError<T>): DalResponse<T> | Promise<DalResponse<T>> | Promise<DalError<T>>;
}
