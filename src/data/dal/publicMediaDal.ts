import { Dal } from './dal';
import { injectable } from '../../modules/common/di';

/**
 * Data access layer for publicly available media files hosted outside of the Cloud API (CDN).
 *
 * It is intentionally created without any interceptor:
 * there is no API key to send to a third party host, no cloud base url to resolve
 * and no API response envelope to unwrap - plain files are served here.
 */
@injectable('PublicMediaDal')
export class PublicMediaDal extends Dal {
  constructor() {
    super();
  }
}
