import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum BadgeType {
  Message = 1,
  Challenge = 2,
  VideoAlert = 3,
  DeviceRegistration = 4,
}

export interface ResetBadgesApiResponse extends ApiResponseBase {
}
