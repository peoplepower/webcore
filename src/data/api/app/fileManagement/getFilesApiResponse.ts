import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum FileType {
  Any = 0,
  Video = 1,
  Image = 2,
  Audio = 3,
  BitmapMask = 4,
  TextLog = 5,
}

export enum FileOwningType {
  OwnFilesOnly = 1,
  SharedFilesOnly = 2,
  OwnAndShared = 3,
  DeletedFilesOnly = 4,
}

export enum FileSharingType {
  NotShared = 0,
  SharedNonRemovable = 1,
  SharedRemovable = 2,
}

export interface GetFilesApiResponse extends ApiResponseBase {
  collectionTotalSize?: number;
  totalFilesSpace?: number;
  usedFilesSpace?: number;
  tempKey: string;
  tempKeyExpire: string;
  filesCount?: number;
  files: Array<{
    id: number;
    creationDate: string;
    creationTime: number;
    type: FileType;
    size: number;
    duration?: number;
    thumbnail: boolean;
    viewed: boolean;
    favourite: boolean;
    name?: string;
    rotate: number;
    incomplete: boolean;
    viewCount: number;
    publicAccess: boolean;
    shared?: FileSharingType;
    device: {
      id: string;
      type: number;
      desc: string;
    };
    tags?: Array<{
      tag: string;
      appId?: number;
      appName?: string;
    }>;
    user?: {
      id: number;
      firstName?: string;
      lastName?: string;
      email?: {
        email?: string;
      };
    };
  }>;
}
