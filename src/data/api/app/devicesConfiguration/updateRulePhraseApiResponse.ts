import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleTemplate } from './createRulePhraseApiResponse';

export interface UpdateRulePhraseApiResponse extends ApiResponseBase {
  ruleTemplate: RuleTemplate;
}

export interface UpdateRuleTemplateModel {
  ruleTemplate: RuleTemplate;
}
