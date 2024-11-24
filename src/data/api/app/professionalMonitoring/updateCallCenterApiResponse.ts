import { ApiResponseBase } from '../../../models/apiResponseBase';
import { CallCenterAlertStatus } from './getCallCenterApiResponse';
import { PhoneType } from '../userAccounts/createUserAndLocationApiResponse';

export interface UpdateCallCenterApiResponse extends ApiResponseBase {
}

export interface UpdateCallCenterModel {
  callCenter: {
    alertStatus?: CallCenterAlertStatus;
    userId?: number;
    contacts?: Array<{
      userId?: number;
      firstName: string;
      lastName: string;
      phone: string;
      phoneType: PhoneType;
      ecv?: boolean;
    }>;
    notDispatch?: boolean;
    codeword?: string;
    permit?: string;
  };
}
