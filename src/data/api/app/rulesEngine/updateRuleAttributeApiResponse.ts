import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdateRuleAttributeModel {
  rule: {
    name: string;
    status: number;
  };
}

export interface UpdateRuleAttributeApiResponse extends ApiResponseBase {

}
