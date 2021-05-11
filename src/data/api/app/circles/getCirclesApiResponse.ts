import { ApiResponseBase } from '../../../models/apiResponseBase';
import { EmailVerificationStatus, PhoneVerificationStatus } from '../userAccounts/getUserInformationApiResponse';
import { PhoneType } from '../userAccounts/createUserAndLocationApiResponse';

export interface GetCirclesApiResponse extends ApiResponseBase {
  circles: Array<{
    id: number;
    name: string;
    admin?: boolean;
    status?: number;
    memberStatus?: number;
    memberCircleUserId?: string;
    creationDate?: string;
    creationDateMs?: number;
    monthlyDataIn?: number;
    monthlyDataMax?: number;
    members?: Array<{
      circleUserId?: number;
      userId: number;
      firstName: string;
      lastName?: string;
      nickname?: string;
      admin?: boolean;
      status?: number;
      avatarFileId?: number;
      email?: {
        email: string;
        verified: boolean;
        status: EmailVerificationStatus;
      };
      phone?: number;
      phoneType?: PhoneType;
      phoneStatus?: PhoneVerificationStatus;
    }>;
  }>;
}
