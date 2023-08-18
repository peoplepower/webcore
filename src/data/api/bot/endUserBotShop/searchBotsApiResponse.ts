import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum BotType {
  Location = 0, // Intended for purchase by users for locations (default type)
  Organization = 1, // Intended for purchase by organization admins for their organizations
  OrgLocations = 2, // Intended for purchase for the organization locations only
}

export enum BotCategory {
  Energy = 'E',
  Security = 'S',
  Care = 'C',
  Lifestyle = 'L',
  Health = 'H',
  Wellness = 'W',
}

export interface SearchBotsApiResponse extends ApiResponseBase {
  apps?: Array<{
    bundle: string;
    type: BotType;
    name?: string;
    author?: string;
    category?: string;
    description?: string;
    rating?: number;
    compatible?: boolean;
  }>;
}
