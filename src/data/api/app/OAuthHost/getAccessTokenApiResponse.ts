import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetAccessTokenApiResponse extends ApiResponseBase {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}
