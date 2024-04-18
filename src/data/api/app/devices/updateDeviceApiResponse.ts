import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdateDeviceModel {
  device?: {
    desc?: string;
    goalId?: number;
    modelId?: string;
    newDevice?: boolean;
    userId?: number;
  };
  location?: {
    id: number;
    startDate?: string;
  };
}

export interface UpdateDeviceApiResponse extends ApiResponseBase {
}
