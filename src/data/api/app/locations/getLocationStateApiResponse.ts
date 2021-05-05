import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetLocationStateApiResponse extends ApiResponseBase {
  /**
   * If just one state requested
   */
  value?: Object;

  /**
   * If multiple states requested
   */
  states?: Array<{
    name: string,
    value: Object
  }>;
}
