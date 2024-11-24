import { ApiResponseBase } from "../../../models/apiResponseBase"

export interface CreateCallCenterTestApiResponse extends ApiResponseBase {
}

export interface CreateCallCenterTestModel {
  startDate?: string;
  endDate?: string;
  comment: string;
}
