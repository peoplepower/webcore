import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetSubscriptionTransactionsApiResponse extends ApiResponseBase {
  transactions: Array<{
    transactionId: string;
    gatewayId: string;
    status: number;
    issueDate: string;
    issueDateMs: number;
    startDate: string;
    startDateMs: number;
    endDate: string;
    endDateMs: number;
    amount: number;
    priceId: number;
    prevPriceId?: number;
    plan?: Array<{
      id: number;
      name: string;
      desc?: string;
    }>;
    prevPlan?: Array<{
      id: number;
      name: string;
      desc?: string;
    }>;
  }>;
}
