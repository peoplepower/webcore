import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum PasscodeMessagePrefix {
  Google = 1, // Google <#>
}

export interface SendPasscodeApiResponse extends ApiResponseBase {
}
