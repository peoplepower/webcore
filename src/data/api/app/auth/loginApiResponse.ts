import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum ApiKeyType {
  NormalApiKey = 0,
  TemporaryApiKey = 1,
  AdminApiKey = 11,
}

export interface LoginApiResponse extends ApiResponseBase {
  /**
   * API Key. Use the API key in the API_KEY header in future API calls for this user.
   */
  key: string;

  /**
   * User ID.
   */
  userId: number;
}
