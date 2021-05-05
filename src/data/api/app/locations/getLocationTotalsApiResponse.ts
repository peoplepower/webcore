import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetLocationTotalsApiResponse extends ApiResponseBase {
  devicesTotal: number;
  filesTotal: number;
  rulesTotal: number;
}
