import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum FilesAggregation {
  Hour = 1,
  Day = 2,
  Month = 3,
  SundayToSaturday7Days = 4,
}

export interface GetAggregatedFileListApiResponse extends ApiResponseBase {
  totalFilesSpace: number;
  usedFilesSpace: number;
  summaries: Array<{
    date: string;
    dateMs: number;
    total: number;
    size: number;
    duration: number;
    viewed: number;
    favourite: number;
  }>;
}
