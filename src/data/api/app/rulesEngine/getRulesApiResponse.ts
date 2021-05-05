import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleActionType, RuleStateType, RuleStatus, RuleTriggerType } from '../devicesConfiguration/getDeviceTypeDefaultRulesApiResponse';
import { RuleParameterCategory } from '../devicesConfiguration/createRulePhraseApiResponse';

export interface RuleState {
  id: number;
  name: string;
  type: RuleStateType;
  display: number;
  timezone: boolean;
  desc: string;
  past: string;
  functionGroup?: string;
  parameters: Array<{
    name: string;
    category: RuleParameterCategory;
    value: string;
    unit?: string;
  }>;
}

export interface RuleAction {
  id: number;
  name: string;
  type: RuleActionType;
  display: number;
  timezone: boolean;
  desc: string;
  parameters: Array<{
    name: string;
    category: RuleParameterCategory;
    value: string;
  }>;
}

export interface RuleTrigger {
  id: number;
  name: string;
  type: RuleTriggerType;
  display: number;
  timezone: boolean;
  desc: string;
  past: string;
  parameters: Array<{
    name: string;
    category: RuleParameterCategory
    value: string;
  }>;
}

export interface Rule {
  id: number;
  name: string;
  status: RuleStatus;
  hidden: boolean;
  default: boolean;
  goalId: number;
  trigger: RuleTrigger;
  states: {
    state: Array<RuleState>;
    and: {
      state: Array<RuleState>;
    }
  };
  actions: Array<RuleAction>;
}

export interface GetRulesApiResponse extends ApiResponseBase {
  rules: Array<Rule>;
}
