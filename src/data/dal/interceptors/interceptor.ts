import { DalError, DalRequestConfig, DalResponse } from '../interfaces';

export interface Interceptor {
  request?(config: DalRequestConfig): DalRequestConfig | Promise<DalRequestConfig>;

  requestError?(error: DalError): DalError | DalRequestConfig | Promise<DalRequestConfig>;

  response?(response: DalResponse): DalResponse | Promise<DalResponse>;

  responseError?(error: DalError): DalResponse | Promise<DalResponse> | Promise<DalError>;
}
