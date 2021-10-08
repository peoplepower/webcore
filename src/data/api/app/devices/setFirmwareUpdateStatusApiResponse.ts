import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum FirmwareUpdateStatus {
  Approved = 2,
  Declined = 3,
}

export interface SetFirmwareUpdateStatusApiResponse extends ApiResponseBase {
}
