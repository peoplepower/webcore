import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDeviceByIdApiResponse extends ApiResponseBase {
  device: {
    id: string;
    type: number;
    typeCategory: number;
    goalId: number;
    locationId: number;
    desc: string;
    connected: boolean;
    newDevice: boolean;
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
  };
  location: {
    id: number;
    name: string;
    startDate: string;
    startDateMs: number;
    event: string;
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
    size?: {
      unit: string;
      content: number;
    },
    appName?: string;
    type?: number;
  };
  // Tags returns only for admins
  tags?: Array<{
    tag: string;
    organizationId?: number;
    organizationName?: string;
    appId?: number;
    appName?: string;
  }>;
}
