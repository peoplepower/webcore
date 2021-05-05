import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum FilesAction {
  OldFileDeletedToStoreThisOne = 1,
  ThereIsNoSpaceForThisFile = 2
}

export interface UploadFileApiResponse extends ApiResponseBase {
  status: string;
  fileRef: number;
  filesAction: FilesAction;
  thumbnail: boolean;
  totalFilesSpace: number;
  usedFilesSpace: number;
  fragments: number;
  twitterShare: boolean;
  twitterAccount: string;
  contentUrl?: string;
  thumbnailUrl?: string;
}
