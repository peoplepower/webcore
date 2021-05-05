import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetTotalDeviceAlertsApiResponse extends ApiResponseBase {
  alerts: Array<{
    alertType: string;
    count: number;
  }>;
}
