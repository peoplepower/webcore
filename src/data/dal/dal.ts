import { DalRequestConfig, DalResponsePromise } from './interfaces';
import Axios, { AxiosInstance } from 'axios';
import { Interceptor } from './interceptors/interceptor';

export abstract class Dal {
  protected readonly axios: AxiosInstance;

  protected constructor(defaultConfig?: DalRequestConfig<any>, protected interceptors?: Interceptor[]) {
    this.axios = Axios.create(defaultConfig);

    interceptors?.forEach((i) => {
      // NOTE: request interceptors will be executed in reversed order,
      //  but response interceptors will be executed in normal order.

      this.axios.interceptors.request.use(
        i.request ? (config) => i.request!(config) : undefined,
        i.requestError ? (error) => i.requestError!(error) : undefined,
      );

      this.axios.interceptors.response.use(
        i.response ? (config) => i.response!(config) : undefined,
        i.responseError ? (error) => i.responseError!(error) : undefined,
      );
    });
  }

  public request<T>(config: DalRequestConfig<T>): DalResponsePromise<T> {
    return this.axios.request(config);
  }

  public get<T>(url: string, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {};
    config.url = url;
    config.method = 'get';
    return this.request(config);
  }

  public delete<T>(url: string, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {};
    config.url = url;
    config.method = 'delete';
    return this.request(config);
  }

  public head<T>(url: string, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {};
    config.url = url;
    config.method = 'head';
    return this.request(config);
  }

  public post<T>(url: string, data?: any, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {};
    config.url = url;
    config.method = 'post';
    config.data = data;
    return this.request(config);
  }

  public put<T>(url: string, data?: any, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {};
    config.url = url;
    config.method = 'put';
    config.data = data;
    return this.request(config);
  }

  public patch<T>(url: string, data?: any, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {};
    config.url = url;
    config.method = 'patch';
    config.data = data;
    return this.request(config);
  }
}
