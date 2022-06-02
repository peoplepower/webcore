import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetPrivateKeyApiResponse extends ApiResponseBase {
  privateKey: string;
}
