import { Interceptor } from './interceptor';
import { DalRequestConfig } from '../interfaces';
import { CloudConfigService } from '../../services/cloudConfigService';
import { inject } from '../../../modules/common/di';
import { Path } from '../../../modules/common/path';

/**
 * Interceptor for dealing with API response http statuses, codes inside the response body, etc.
 * Here we trying to determine which request is successful, which is not, resolving the promise according to that
 */
export class BaseUrlInterceptor implements Interceptor {
  private readonly apiBase: string;

  @inject('CloudConfigService') protected readonly cloudConfigService!: CloudConfigService;

  /**
   * Creates instance of the BaseUrlInterceptor
   * @param apiBase Contains the 'location' of the api that we want to target. i.e.: "/cloud/json/" for AppAPI,
   * or "/admin/json/" for AdminAPI, etc.
   */
  constructor(apiBase?: string) {
    this.apiBase = apiBase || '/';
  }

  request(config: DalRequestConfig): any {
    if (!config.baseURL) {
      if (this.cloudConfigService.baseUrl) {
        config.baseURL = Path.Combine(this.cloudConfigService.baseUrl, this.apiBase);
        config.url = Path.Combine(this.cloudConfigService.baseUrl, this.apiBase, config.url!);
      } else {
        return this.cloudConfigService.getBaseUrl().then((url) => {
          config.baseURL = Path.Combine(url, this.apiBase);
          config.url = Path.Combine(url, this.apiBase, config.url!);
          return config;
        });
      }
    }
    return config;
  }
}
