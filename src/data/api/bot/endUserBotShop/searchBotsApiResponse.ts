import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotCategoryCommaSeparated } from "./getListOfBotsApiResponse";

export enum BotType {
  Location = 0, // Intended for purchase by users for locations (default type)
  Organization = 1, // Intended for purchase by organization admins for their organizations
  OrgLocations = 2, // Intended for purchase for the organization locations only
}

export enum BotCoreClass {
  Default = 0, // No requirements (default)
  Positive = 1, // Provides Core functionality (core positive)
  Negative = -1, // Requires Core functionality (core negative)
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
    core: BotCoreClass;
    name?: string;
    author?: string;
    category?: BotCategoryCommaSeparated;
    description?: string;
    // rating?: number;
    compatible?: boolean;
  }>;
}
