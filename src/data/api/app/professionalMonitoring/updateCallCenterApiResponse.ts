import { ApiResponseBase } from '../../../models/apiResponseBase';
import { CallCenterAlertStatus } from './getCallCenterApiResponse';
import { PhoneType } from '../userAccounts/createUserAndLocationApiResponse';

export interface UpdateCallCenterApiResponse extends ApiResponseBase {}

export interface UpdateCallCenterModel {
  callCenter: {
    alertStatus?: CallCenterAlertStatus;
    contacts?: Array<{
      firstName: string;
      lastName: string;
      phone: string;
      phoneType: PhoneType;
    }>;
    notDispatch?: boolean;
    codeword?: string;
    permit?: string;
  };
}
