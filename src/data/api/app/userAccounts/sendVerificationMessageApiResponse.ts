import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum VerificationType {
  Email = 0,
  SMS = 2
}

export interface SendVerificationMessageApiResponse extends ApiResponseBase {

}
