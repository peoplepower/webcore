import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface AddMembersApiResponse extends ApiResponseBase {
}

export interface CircleMembersModel {
  members: Array<{
    email?: string;
    phone?: string;
    nickname?: string;
  }>;
}
