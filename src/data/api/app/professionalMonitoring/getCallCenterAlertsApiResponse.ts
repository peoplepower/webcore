import { ApiResponseBase } from '../../../models/apiResponseBase';
import { CallCenterAlertStatus } from './getCallCenterApiResponse';

export enum CallCenterAlertSourceType {
  Unknown = 0,
  RaisedByRule = 1,
  RaisedByComposerApp = 2,
  RaisedByAppApi = 3,
}

export interface GetCallCenterAlertsApiResponse extends ApiResponseBase {
  callCenterAlerts: Array<{
    alertDate: string;
    alertDateMs: string;
    alertStatus: CallCenterAlertStatus;
    signalType: string;
    signalMessage: string;
    alertSourceType: CallCenterAlertSourceType;
    device: {
      id: string;
      type: number;
      goalId: number;
      typeCategory: number;
      desc: string;
    };
  }>;
}
