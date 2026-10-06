import { ApiResponseBase } from '../../../models/apiResponseBase';
import { NarrativeType } from './getNarrativesApiResponse';

export enum NarrativeScope {
  Location = 1,
  Organization = 2,
}

export enum NarrativePriority {
  Analytics = -1,
  Details = 0,
  Info = 1,
  Warning = 2,
  Critical = 3,
}

export enum NarrativeStatus {
  Initial = 0,
  Deleted = 1,
  Resolved = 2,
}

export interface CreateOrUpdateNarrativeApiResponse extends ApiResponseBase {
  narrativeId: number;
  narrativeTime: number;
}

export interface CreateOrUpdateNarrativeModel {
  narrativeTime?: number;

  /**
   * Define parent narrative.
   */
  parentId?: number;
  parentNarrativeTime?: number;

  /**
   * Related escalation.
   */
  escalationId?: number;

  priority?: NarrativePriority;
  status?: NarrativeStatus;
  narrativeType?: NarrativeType;
  eventType?: string;

  /**
   * Define icon name and icon font collection.
   */
  icon?: string;
  iconFont?: string;

  title?: string;
  description?: string;

  /**
   * Free form synthetic data.
   */
  target?: {
    [field: string]: any;
  };
}
