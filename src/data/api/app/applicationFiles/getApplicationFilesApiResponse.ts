import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum AppFileType {
  UserImage = 1,
  LocationImage = 2,
  DeviceImage = 3,
  BitmapMask = 4,
  Any = 5
}

export interface GetApplicationFilesApiResponse extends ApiResponseBase {
  tempKey: string;
  tempKeyExpire: string;
  files: Array<{
    id: number;
    type: AppFileType;
    name: string;
    size: number;
    userId?: number;
    publicAccess: boolean;
    locationId?: number;
    deviceId?: string;
  }>;
}
