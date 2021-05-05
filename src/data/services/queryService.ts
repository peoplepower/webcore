import { injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import * as qs from 'qs';
import { IStringifyOptions } from 'qs';

@injectable('QueryService')
export class QueryService extends BaseService {

  constructor() {
    super();
  }

  /**
   * Parse current URL query string and convert into hash object
   * @return {any}
   */
  getQueryParams() {
    if (!window?.location?.search || window?.location?.search?.length <= 1) {
      return {};
    }
    return qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
  }

  /**
   * Encode object into query params string. By default, without ? sign
   * @param {Object} obj
   * @param {IStringifyOptions} options
   * @return {string}
   */
  encodeQueryParams(obj: any, options?: IStringifyOptions): string {
    return qs.stringify(obj, options);
  }

}
