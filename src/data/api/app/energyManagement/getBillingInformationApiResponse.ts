import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum BillingInformationType {
  AllData = 0,
  DataForBillingDay = 1,
  DataForBudget = 2,
  AllRateInformation = 4,
  CurrentBillingRate = 8
}

export enum BillingRateType {
  Manual = -2,
  Unknown = -1,
  Both = 0,
  Residential = 1,
  Commercial = 2
}

export interface GetBillingInformationApiResponse extends ApiResponseBase {
  billingDay: number;
  budgets: Array<{
    month: number;
    budget: string;
  }>;
  utility: {
    id: number;
    name: string;
  };
  billingRate: {
    id: number;
    type: BillingRateType;
    typical: boolean;
    value: string;
  };
}
