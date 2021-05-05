import { ApiResponseBase } from '../../../models/apiResponseBase';
import { EmailVerificationStatus } from '../userAccounts/getUserInformationApiResponse';

export interface GetSupportedDeviceTypesApiResponse extends ApiResponseBase {
  /**
   * List of products / "device types" supported on this instance of the IoT Software Suite
   */
  deviceTypes: Array<{
    /**
     * Product ID / "device type"
     */
    id: number;
    /**
     * Name of the product
     */
    name: string;
    editable: boolean;
    /**
     * User created this device type
     */
    createdBy: {
      id: number;
      userName: string;
      firstName: string;
      lastName: string;
      email: {
        email: string;
        verified: boolean;
        status: EmailVerificationStatus;
      }
    };
    /**
     * The creation date
     */
    creationDate: string;
    /**
     * The creation date in milliseconds
     */
    creationDateMs: number;
    /**
     * List of attributes this product has
     */
    attributes: Array<{
      name: string;
      value: string;
    }>;

    /**
     * Device type excluded from workflow
     */
    nonOrganization: number;
  }>;
}
