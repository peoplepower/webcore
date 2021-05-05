import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDeviceEnergyUsageApiResponse extends ApiResponseBase {
  power: {
    amountPerHour: string;
    watts: string;
    currentRate: string;
    lastUpdateDate: string;
    lastUpdateDateMs: number;
  };
  energy: {
    amount: string;
    kwh: string;
    amountYTD: string;
    kwhYTD: string;
    amountDTD: string;
    kwhDTD: string;
  };
}
