import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleModel } from './createRuleApiResponse';

export interface UpdateRuleModel {
  rule: RuleModel;
}

export interface UpdateRuleApiResponse extends ApiResponseBase {

}
