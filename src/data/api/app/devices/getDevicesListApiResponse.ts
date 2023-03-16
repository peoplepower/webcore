import { ApiResponseBase } from '../../../models/apiResponseBase';
import { DeviceSimulationStatus } from "./getDeviceByIdApiResponse";

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
