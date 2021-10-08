import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDevicesListApiResponse extends ApiResponseBase {
  devices: Array<{
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

    /**
     * Location spaces (rooms) set for the device.
     */
    spaces?: Array<{
      id: number;
      type: number;
      name: string;
    }>;

    /**
     * Device tags.
     * Returned only for admins.
     */
    tags?: Array<{
      tag: string;
      appId?: number;
      appName?: string;
    }>;

  }>;
}
