import { ApiResponseBase } from '../../../models/apiResponseBase';
import { TimezoneModel } from '../common/getApiSettingsApiResponse';
import { LocationType } from '../locations/editLocationApiResponse';
import { FileUploadPolicy, LocationPriorityCategory } from '../userAccounts/getUserInformationApiResponse';

export enum SimStatus {
  New = 0,
  Active = 1,
  Reserved = 2,
  Expired = 3,
  Suspended = 4,
  Deactivated = 5,
  Cancelled = 6,
  NotExist = 7,
}

export enum DeviceSimulationStatus {
  /**
   * Real device, which data copied to simulated device
   */
  Source = -1,

  /**
   * Real Device
   */
  None = 0,

  /**
   * Device instance simulated by cloud scheduler
   */
  SimulatedByCloudScheduler = 1,

  /**
   * Device copy
   */
  SimulatedCopy = 2,

  /**
   * Device instance simulated by "flexible" simulator
   */
  SimulatedByFlexibleSimulator = 3,
}

export interface GetDeviceByIdApiResponse extends ApiResponseBase {
  device: {
    id: string;
    type: number;
    typeCategory: number;
    locationId: number;

    /**
     * Assigned user for personal devices.
     */
    userId: number;

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
     * Firmware update group ID.
     */
    fwGroupId?: number;

    /**
     * Reported as 'true' to describe recently added device.
     */
    newDevice: boolean;

    /**
     * Device proxy ID (gateway)
     */
    proxyId?: string;

    /**
     * Device simulation status
     */
    simulated?: DeviceSimulationStatus,

    /**
     * If this real device is the source of data for the simulator
     * (the simulator is a copy of this device that receives an exact
     * copy of all data), then this field stores the ID prefixes of
     * all simulators separated by commas. That is, if this field
     * contains, for example, "SIM1_,SIM2_", then somewhere there
     * are (possibly) devices with IDs "SIM1_{DEVICE_ID}" and
     * "SIM2_{DEVICE_ID}", where `{DEVICE_ID}` - is the ID of the
     * current source device.
     */
    simulatedPrefix?: string,

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
    language?: string;

    /**
     * Location type.
     */
    type?: LocationType;

    /**
     * Location priority.
     */
    priorityCategory?: LocationPriorityCategory;
    priorityComment?: string;
    priorityDate?: string;
    priorityDateMs?: number;
    priorityRank?: number;

    /**
     * Location address and geo coordinates.
     */
    addrStreet1?: string;
    addrStreet2?: string;
    addrCity?: string;
    zip?: string;
    latitude?: string;
    longitude?: string;

    /**
     * Location state.
     */
    state?: {
      id: number;
    };

    /**
     * Location country.
     */
    country?: {
      id: number;
    };

    /**
     * Additional location attributes.
     */
    occupantsNumber?: number;
    salesTaxRate?: string;
    size?: {
      unit: string;
      content: number;
    };

    /**
     * Location timezone.
     */
    timezone?: TimezoneModel;

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
