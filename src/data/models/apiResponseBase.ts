import { ApiKeyType } from '../api/app/auth/loginApiResponse';

export interface ApiResponseBase {
  resultCode: number;
  resultCodeDesc?: string;
  resultCodeMessage?: string;

  /**
   * Expiration timestamp xsd:dateTime formatted [YYYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm].
   */
  keyExpire?: string;

  /**
   * Expiration timestamp in milliseconds since UNIX epoch
   */
  keyExpireMs?: number;

  /**
   * API key type: 0 - User (default), 11 - Admin
   */
  keyType?: ApiKeyType;

  /**
   * Sorted collection size
   */
  collectionTotalSize?: number;
}
