import { ApiResponseBase } from "../../../models/apiResponseBase";

export interface GetTotpFactorsApiResponse extends ApiResponseBase {
  factors?: TotpFactor[]
}

export interface TotpFactor {
  /**
   * Device name used to store the authentication factor
   */
  name: string;

  /**
   * The authentication factor's status.
   * The value 1 means that the factor is active and can be used.
   * Zero or negative value means that additional confirmations are required.
   * On each successful confirmation the status value is decremented starting from zero.
   */
  status: number;

  /**
   * TOTP Secret creation date
   */
  creationDate: string;

  /**
   * TOTP Secret creation date
   */
  creationDateMs: number;

  /**
   * Optional issuer returned in the QR code URL and be displayed in the app
   */
  issuer?: string;

  /**
   * Time until the secret factor must be confirmed
   */
  maxConfirmationTime: string;

  /**
   * Time until the secret factor must be confirmed
   */
  maxConfirmationTimeMs: number;
}
