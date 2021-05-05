import { ApiResponseBase } from '../../../models/apiResponseBase';
import { Rule } from './getRulesApiResponse';

export interface GetRuleApiResponse extends ApiResponseBase {
  rules: Array<Rule>;
}
