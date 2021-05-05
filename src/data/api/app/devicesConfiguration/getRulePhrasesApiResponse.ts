import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleTemplate } from './createRulePhraseApiResponse';

export interface GetRulePhrasesApiResponse extends ApiResponseBase {
  ruleTemplates: Array<RuleTemplate>;
}
