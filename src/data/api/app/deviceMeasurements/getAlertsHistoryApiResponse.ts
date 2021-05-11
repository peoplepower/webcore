import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetAlertsHistoryApiResponse extends ApiResponseBase {
  alerts: Array<{
    /**
     * Device ID
     */
    deviceId: string;

    /**
     * Available alert types: "factoryReset", "status", "motion", "person"
     */
    alertType: string;
    receivingDate: string;
    receivingDateMs: number;
    params: Array<{ name: string; value: string }>;
  }>;
}
