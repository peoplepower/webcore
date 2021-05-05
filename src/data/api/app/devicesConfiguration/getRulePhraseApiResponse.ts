import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleTemplate } from './createRulePhraseApiResponse';

export interface GetRulePhraseApiResponse extends ApiResponseBase {
  ruleTemplate: RuleTemplate;
}
