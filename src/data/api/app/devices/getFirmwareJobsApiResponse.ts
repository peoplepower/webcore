import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetFirmwareJobsApiResponse extends ApiResponseBase {
  jobs: Array<{
    id: number;
    index: string;
    firmware: string;
    currentFirmware: string;
    status: FirmwareStatus;
    url: string,
    checkSum: string,
    notificationDate: string;
    notificationDateMs: number;
    startDate: string;
    startDateMs: number;
    device: {
      id: string;
      type: number;
      typeCategory: number;
      desc: string;
      lastDataReceivedDate: string;
      lastDataReceivedDateMs: number;
    }
  }>;
}

export enum FirmwareStatus {
  Available = 1,
  Approved = 2,
  Decline = 3,
  Started = 4
}
