import { Dal } from '../../dal/dal';
import { AuthInterceptor } from '../../dal/interceptors/authInterceptor';
import { ApiResponseInterceptor } from '../../dal/interceptors/apiResponseInterceptor';
import { BaseUrlInterceptor } from '../../dal/interceptors/baseUrlInterceptor';
import * as qs from 'qs';
import { inject, injectable } from '../../../modules/common/di';
import { CloudConfigService } from '../../services/cloudConfigService';
import { Path } from '../../../modules/common/path';
import { JsonContentTypeInterceptor } from '../../dal/interceptors/jsonContentTypeInterceptor';
import { OfflineInterceptor } from '../../dal/interceptors/offlineInterceptor';

@injectable('AppApiOAuthDal')
export class AppApiOAuthDal extends Dal {

  @inject('CloudConfigService') protected readonly cloudConfigService: CloudConfigService;

  constructor() {
    const offlineInterceptor = new OfflineInterceptor();

    super({
      // custom params serializer
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          arrayFormat: 'repeat', // this will make {a: ['b', 'c']} compiles to 'a=b&a=c' not 'a[]=b&a[]=c'
          //indices: false
        });
      },
    }, [
      new BaseUrlInterceptor(), // no need in any 'oauth' specific baseUrl segment, as every api method will use own url
      offlineInterceptor,
      new AuthInterceptor(),
      new ApiResponseInterceptor(),
      new JsonContentTypeInterceptor(),
    ]);

    offlineInterceptor.dal = this;
  }

  /**
   * Constructs the full URL taking into account the base url from the cloudConfigService and passed in relative url.
   * @param {string} relativeUrl Relative url part (segments) to combine with the currently configured base URL.
   * @returns {Promise<string>}
   */
  public GetFullUrl(relativeUrl: string): Promise<string> {
    return this.cloudConfigService.getBaseUrl()
      .then(baseUrl => {
        return Path.Combine(baseUrl, relativeUrl);
      });
  }
}
