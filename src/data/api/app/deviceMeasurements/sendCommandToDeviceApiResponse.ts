import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface SendCommandToDeviceApiResponse extends ApiResponseBase {
  commands?: Array<{
    id: string;
    deviceId: string;
  }>;
}

export interface CommandParametersModel {
  params: Array<{
    name: string;
    index?: number;
    value: string;
    unit?: string;
  }>;
  commandTimeout?: number;
  comment?: string;
}
