import { ApiResponseBase } from '../../../models/apiResponseBase';
import { LocationModel } from './editLocationApiResponse';

export interface CreateLocationApiResponse extends ApiResponseBase {
  locationId: number;
}

export interface NewLocationModel extends LocationModel {
  /**
   * Unique domain name to register location in organization.
   */
  appName?: string;
}
