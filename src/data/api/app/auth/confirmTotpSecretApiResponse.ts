import { ApiResponseBase } from "../../../models/apiResponseBase";

export interface ConfirmTotpSecretApiResponse extends ApiResponseBase {

  /**
   * The authentication factor's status.
   * The value 1 means that the factor is active and can be used.
   * Zero or negative value means that additional confirmations are required.
   * On each successful confirmation the status value is decremented starting from zero.
   */
  status: number;

  /**
   * Time until the secret factor must be confirmed
   */
  maxConfirmationTime: string;

  /**
   * Time until the secret factor must be confirmed
   */
  maxConfirmationTimeMs: number;
}
