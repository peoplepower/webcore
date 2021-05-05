import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDevicesListApiResponse extends ApiResponseBase {
  devices: Array<{
    id: string;
    type: number;
    typeCategory: number;
    goalId: number;
    locationId: number;
    desc: string;
    connected: boolean;
    newDevice: boolean;
    shared?: boolean;
    icon: string;
    proxyId?: string;
    lastDataReceivedDate?: string;
    lastDataReceivedDateMs?: number;
    lastMeasureDate?: string;
    lastMeasureDateMs?: number;
    lastConnectedDate?: string;
    lastConnectedDateMs?: number;
    typeAttributes?: Array<{
      name: string;
      value: string;
    }>;
    parameters?: Array<{
      name: string;
      value: string;
      index?: string;
      lastUpdatedTime: string;
      lastUpdatedTimeMs: number;
    }>;
    spaces?: Array<{
      id: number;
      type: number;
      name: string;
    }>;
    tags?: Array<{
      tag: string;
      appId?: number;
      appName?: string;
    }>;
  }>;
}
