import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface CreateDeviceTypeApiResponse extends ApiResponseBase {
  deviceType: {
    id: number;
    editable: boolean;
  };
}

export interface DeviceTypeModel {
  deviceType: {
    name: string;
    attr: Array<{
      name: string;
      content: string;
    }>;
  };
}
