import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetSpacesApiResponse extends ApiResponseBase {
  spaces?: Array<{
    id: number;
    type: number;
    name: string;
  }>;
}
