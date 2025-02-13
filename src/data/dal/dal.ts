import { CreateDalDefaults, DalRequestConfig, DalResponsePromise } from './interfaces';
import Axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { Interceptor } from './interceptors/interceptor';

export abstract class Dal {
  protected readonly axios: AxiosInstance;

  protected constructor(defaultConfig?: CreateDalDefaults, protected interceptors?: Interceptor[]) {
    // @ts-ignore Fix react native error with axios package (Axios cjs package do not have default Axios Instance exported)
    const createFunc: typeof Axios.create = Axios.create ?? Axios.default.create;
    this.axios = createFunc(defaultConfig);

    interceptors?.forEach((i) => {
      // NOTE: request interceptors will be executed in reversed order,
      //  but response interceptors will be executed in normal order.

      this.axios.interceptors.request.use(
        i.request ? (config) => i.request!(config) : null,
        i.requestError ? (error) => i.requestError!(error) : null,
      );

      this.axios.interceptors.response.use(
        i.response ? (config) => i.response!(config) : null,
        i.responseError ? (error) => i.responseError!(error) : null,
      );
    });
  }

  public request<T>(config: DalRequestConfig<T>): DalResponsePromise<T> {
    return this.axios.request(config);
  }

  public get<T>(url: string, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {headers: {} as AxiosRequestHeaders};
    config.url = url;
    config.method = 'get';
    return this.request(config);
  }

  public delete<T>(url: string, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {headers: {} as AxiosRequestHeaders};
    config.url = url;
    config.method = 'delete';
    return this.request(config);
  }

  public head<T>(url: string, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {headers: {} as AxiosRequestHeaders};
    config.url = url;
    config.method = 'head';
    return this.request(config);
  }

  public post<T>(url: string, data?: any, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {headers: {} as AxiosRequestHeaders};
    config.url = url;
    config.method = 'post';
    config.data = data;
    return this.request(config);
  }

  public put<T>(url: string, data?: any, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {headers: {} as AxiosRequestHeaders};
    config.url = url;
    config.method = 'put';
    config.data = data;
    return this.request(config);
  }

  public patch<T>(url: string, data?: any, config?: DalRequestConfig<T>): DalResponsePromise<T> {
    config = config || {headers: {} as AxiosRequestHeaders};
    config.url = url;
    config.method = 'patch';
    config.data = data;
    return this.request(config);
  }
}
