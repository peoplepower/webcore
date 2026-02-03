import { Dal } from '../../dal/dal';
import { AuthInterceptor } from '../../dal/interceptors/authInterceptor';
import { ApiResponseInterceptor } from '../../dal/interceptors/apiResponseInterceptor';
import { BaseUrlInterceptor } from '../../dal/interceptors/baseUrlInterceptor';
import * as qs from 'qs';
import { injectable } from '../../../modules/common/di';
import { JsonContentTypeInterceptor } from '../../dal/interceptors/jsonContentTypeInterceptor';
import { OfflineInterceptor } from '../../dal/interceptors/offlineInterceptor';

@injectable('AppApiDal')
export class AppApiDal extends Dal {
  constructor() {
    const offlineInterceptor = new OfflineInterceptor();

    super(
      {
        // custom params serializer
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: 'repeat', // This will make {a: ['b', 'c']} compiles to 'a=b&a=c' not 'a[]=b&a[]=c'
            // indices: false
          });
        },
      },
      [
        new BaseUrlInterceptor('/cloud/json/'),
        offlineInterceptor,
        new AuthInterceptor(),
        new ApiResponseInterceptor(),
        new JsonContentTypeInterceptor(),
      ],
    );

    offlineInterceptor.dal = this;
  }
}
