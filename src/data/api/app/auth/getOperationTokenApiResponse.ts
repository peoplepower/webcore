import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum OperationTokenType {
  UserRegistration = 1,
}

export interface GetOperationTokenApiResponse extends ApiResponseBase {
  token: string;
  tokenType: OperationTokenType;
  validFrom: number;
  expire: number;
}
