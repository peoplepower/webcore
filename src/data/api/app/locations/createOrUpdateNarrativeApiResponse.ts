import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum NarrativeScope {
  Location = 1,
  Organization = 2
}

export enum NarrativePriority {
  Details = 0,
  Info = 1,
  Warning = 2,
  Critical = 3
}

export enum NarrativeStatus {
  Initial = 0,
  Deleted = 1,
  Resolved = 2
}

export interface CreateOrUpdateNarrativeApiResponse extends ApiResponseBase {
  narrativeId: number;
  narrativeTime: number;
}

export interface CreateOrUpdateNarrativeModel {
  narrativeTime?: number;
  priority?: NarrativePriority;
  status?: NarrativeStatus;
  icon?: string;
  title?: string;
  description?: string;
  target?: {
    fileIDs?: number[];
    field?: string;
  };
}
