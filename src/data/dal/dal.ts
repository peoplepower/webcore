import { DalRequestConfig, DalResponsePromise } from './interfaces';
import Axios, { AxiosInstance } from 'axios';
import { Interceptor } from './interceptors/interceptor';

export abstract class Dal {

  protected readonly axios: AxiosInstance;

  protected constructor(defaultConfig?: DalRequestConfig, protected interceptors?: Interceptor[]) {
    this.axios = Axios.create(defaultConfig);

    interceptors?.forEach(i => {

      // NOTE: request interceptors will be executed in reversed order,
      //  but response interceptors will be executed in normal order.

      this.axios.interceptors.request.use(
        i.request ? (config => i.request!(config)) : undefined,
        i.requestError ? (error => i.requestError!(error)) : undefined,
      );

      this.axios.interceptors.response.use(
        i.response ? (config => i.response!(config)) : undefined,
        i.responseError ? (error => i.responseError!(error)) : undefined,
      );

    });
  }

  public request(config: DalRequestConfig): DalResponsePromise {
    return this.axios.request(config);
  }

  public get(url: string, config?: DalRequestConfig): DalResponsePromise {
    config = config || {};
    config.url = url;
    config.method = 'get';
    return this.request(config);
  }

  public 'delete'(url: string, config?: DalRequestConfig): DalResponsePromise {
    config = config || {};
    config.url = url;
    config.method = 'delete';
    return this.request(config);
  }

  public head(url: string, config?: DalRequestConfig): DalResponsePromise {
    config = config || {};
    config.url = url;
    config.method = 'head';
    return this.request(config);
  }

  public post(url: string, data?: any, config?: DalRequestConfig): DalResponsePromise {
    config = config || {};
    config.url = url;
    config.method = 'post';
    config.data = data;
    return this.request(config);
  }

  public put(url: string, data?: any, config?: DalRequestConfig): DalResponsePromise {
    config = config || {};
    config.url = url;
    config.method = 'put';
    config.data = data;
    return this.request(config);
  }

  public patch(url: string, data?: any, config?: DalRequestConfig): DalResponsePromise {
    config = config || {};
    config.url = url;
    config.method = 'patch';
    config.data = data;
    return this.request(config);
  }

}
