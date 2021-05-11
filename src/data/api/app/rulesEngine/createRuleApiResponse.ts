import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleStatus } from '../devicesConfiguration/getDeviceTypeDefaultRulesApiResponse';

export interface RuleModel {
  name: string;
  status: RuleStatus;
  hidden: boolean;
  timeZone: string;
  trigger: {
    id: number;
    parameter: Array<{
      name: string;
      value: string;
    }>;
  };
  calendar: Array<{
    include: boolean;
    startTime?: number;
    endTime?: number;
    daysOfWeek?: number;
  }>;
  states: {
    state: Array<{
      id: number;
      parameter: Array<{
        name: string;
        value: string;
      }>;
    }>;
    and: Array<{
      state: Array<{
        id: number;
        parameter: Array<{
          name: string;
          value: string;
        }>;
      }>;
    }>;
  };
  actions: {
    action: Array<{
      id: number;
      parameter?: Array<{
        name: string;
        value: string;
      }>;
    }>;
  };
}

export interface CreateRuleModel {
  rule: RuleModel;
}

export interface CreateRuleApiResponse extends ApiResponseBase {
  rule: {
    id: number;
  };
}
