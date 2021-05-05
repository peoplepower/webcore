import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleActionType, RuleStateType, RuleTriggerType } from '../devicesConfiguration/getDeviceTypeDefaultRulesApiResponse';
import { RuleParameterCategory, RuleParameterValueType } from '../devicesConfiguration/createRulePhraseApiResponse';

export interface GetRulePhrasesApiResponse extends ApiResponseBase {
  triggers: Array<{
    id: number;
    name: string;
    type: RuleTriggerType;
    display: number;
    timezone: boolean;
    desc: string;
    past: string;
    functionGroup?: string;
    parameters?: Array<{
      name: string;
      category: RuleParameterCategory,
      optional: boolean;
      desc: string;
      values?: Array<{
        id: string;
        name: string;
      }>;
      value?: string;
      valueType?: RuleParameterValueType;
      unit?: string;
      minValue?: string;
      maxValue?: string;
    }>;
  }>;
  states: Array<{
    id: number;
    name: string;
    type: RuleStateType;
    display: number;
    timezone: boolean;
    desc: string;
    past: string;
    functionGroup?: string;
    parameters?: Array<{
      name: string;
      category: RuleParameterCategory,
      optional: boolean;
      desc: string;
      values?: Array<{
        id: string;
        name: string;
      }>;
      value?: string;
      valueType?: RuleParameterValueType;
      unit?: string;
      minValue?: string;
      maxValue?: string;
    }>;
  }>;
  actions: Array<{
    id: number;
    name: string;
    type: RuleActionType;
    display: number;
    timezone: boolean;
    desc: string;
    past: string;
    parameters: Array<{
      name: string;
      category: RuleParameterCategory;
      optional: boolean;
      desc: string;
      value?: string;
      values?: Array<{
        id: string;
        name: string;
        selectorValue: string;
      }>;
    }>;
  }>;
}
