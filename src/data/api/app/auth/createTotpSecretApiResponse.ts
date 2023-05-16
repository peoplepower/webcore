import { ApiResponseBase } from "../../../models/apiResponseBase";

export interface CreateTotpSecretApiResponse extends ApiResponseBase {
  /**
   * Generated 20-byte encoded secret value
   */
  secret: string;

  /**
   * QR code URL containing the secret and other information, which can be scanned by the app
   */
  url: string;

  /**
   * Time until the secret factor must be confirmed
   */
  maxConfirmationTime: string;

  /**
   * Time until the secret factor must be confirmed
   */
  maxConfirmationTimeMs: number;
}
