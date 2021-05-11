import { ApiResponseBase } from '../../../models/apiResponseBase';
import { PaymentType, SubscriptionType } from './getSoftwareSubscriptionsApiResponse';
import { SubscriptionStatus } from './getLocationSubscriptionsApiResponse';

export interface AssignServicesToLocationsApiResponse extends ApiResponseBase {
  results: Array<{
    locationId: number;
    resultCode: number;
    subscription?: {
      userPlanId: number;
      locationId: number;
      assignUserId: number;
      type: SubscriptionType;
      paymentType: PaymentType;
      status: SubscriptionStatus;
      issueDate: string;
      issueDateMs: number;
      startDate: string;
      startDateMs: number;
      endDate: string;
      endDateMs: number;
    };
  }>;
}

export interface AssignServicesToLocationsModel {
  locations: Array<{
    userId?: number;
    locationId: number;
    services?: Array<{
      name: string;
      resourceId: string;
    }>;
    bots?: Array<{
      bundle: string;
      resourceId: number;
    }>;
  }>;
}
