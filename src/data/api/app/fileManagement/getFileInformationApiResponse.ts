import { ApiResponseBase } from '../../../models/apiResponseBase';
import { FileType } from './getFilesApiResponse';

export interface GetFileInformationApiResponse extends ApiResponseBase {
  tempKey: string;
  tempKeyExpire: string;
  tempKeyExpireMs: number;
  file: {
    id: number;
    type: FileType;
    name: string;
    thumbnail: boolean;
    viewed: boolean;
    favourite: boolean;
    viewCount: number;
    publicAccess: boolean;
    creationDate: string;
    creationDateMs: number;
    size: number;
    duration: number;
    rotate: number;
    incomplete: number;
    device: {
      id: string;
      type: number;
      desc: string;
    },
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: {
        email: string;
      }
    },
    tags: Array<{
      tag: string;
      appId?: number;
      appName?: string;
    }>;
  };
}
