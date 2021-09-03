import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum PasscodeNotificationType {
  SMS = 2,
}

export enum PasscodeMessagePrefix {
  Google = 1, // Google <#>
}

export interface SendPasscodeApiResponse extends ApiResponseBase {
}
