import { ApiResponseBase } from '../../../models/apiResponseBase';
import { TimezoneModel } from '../common/getApiSettingsApiResponse';
import { FileUploadPolicy, LocationPriorityCategory } from '../userAccounts/getUserInformationApiResponse';

export enum SimStatus {
  New = 0,
  Active = 1,
  Reserved = 2,
  Expired = 3,
}

export interface GetDeviceByIdApiResponse extends ApiResponseBase {
  device: {
    id: string;
    type: number;
    typeCategory: number;
    locationId: number;

    /**
     * Current device connection status.
     * Properly reported only if related query parameter provided.
     */
    connected: boolean;

    /**
     * Custom device name.
     */
    desc: string;

    /**
     * Device icon by model/type.
     */
    icon?: string;

    /**
     * Model ID returned when it's surely confirmed by Server.
     */
    modelId?: number;

    /**
     * Returned only if goal set for the device.
     */
    goalId?: number;

    /**
     * Reported as 'true' to describe recently added device.
     */
    newDevice: boolean;

    /**
     * Device proxy ID (gateway)
     */
    proxyId?: string;

    startDate: string;
    startDateMs: number;
    lastDataReceivedDate?: string;
    lastDataReceivedDateMs?: number;
    lastMeasureDate?: string;
    lastMeasureDateMs?: number;
    lastConnectedDate?: string;
    lastConnectedDateMs?: number;

    /**
     * Device type attributes.
     */
    typeAttributes?: Array<{
      name: string;
      value: string;
    }>;

    /**
     * Device parameters.
     */
    parameters?: Array<{
      name: string;
      value: string;
      index?: string;
      lastUpdatedTime: string;
      lastUpdatedTimeMs: number;
    }>;

  };

  /**
   * Location where device installed.
   */
  location: {
    id: number;
    name: string;
    creationDate: string;
    creationDateMs: number;
    event?: string;
    appName?: string;
    organizationId?: number;

    /**
     * Location type.
     */
    type?: number;

    /**
     * Location priority.
     */
    priorityCategory?: LocationPriorityCategory;
    priorityComment?: string;
    priorityDate?: string;
    priorityDateMs?: number;
    priorityRank?: number;

    addrStreet1?: string;
    addrStreet2?: string;
    addrCity?: string;
    state?: {
      id: number;
    };
    country?: {
      id: number;
    };
    zip?: string;
    latitude?: string;
    longitude?: string;
    timezone?: TimezoneModel;
    size?: {
      unit: string;
      content: number;
    };

    /**
     * Location file storage policy.
     */
    fileUploadPolicy: FileUploadPolicy | number;
  };

  /**
   * Device tags.
   * Returned only for admins.
   */
  tags?: Array<{
    tag: string;
    organizationId?: number;
    organizationName?: string;
    appId?: number;
    appName?: string;
  }>;

  /**
   * Location spaces (rooms) set for the device.
   */
  spaces?: Array<{
    id: number;
    type: number;
    name: string;
  }>;

  /**
   * SIM cards information.
   * Returned only if device has a Cellular connection.
   */
  simCards?: Array<{
    id: string;
    activationDateMs: number;
    serialNumber: string;
    carrier: string;
    carrierName: string;

    /**
     * Registered SIM phone number.
     */
    lineNumber: string;

    /**
     * Current status of the SIM card.
     */
    status: SimStatus;

    /**
     * Current balance in bytes.
     */
    dataBalance: number;

    /**
     * Date of the last update of the balance and usage.
     */
    balanceDate: number;

    /**
     * Data usage in bytes.
     */
    dataUsage: number;

    activationMessage?: string;
    activationCode?: string;

    /**
     * Provider status.
     */
    lifecycleStatus: string;
  }>;

}
