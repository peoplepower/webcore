import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface SetFirmwareUpdateStatusApiResponse extends ApiResponseBase {}

export enum FirmwareUpdateStatus {
  Approved = 2,
  Declined = 3,
}
