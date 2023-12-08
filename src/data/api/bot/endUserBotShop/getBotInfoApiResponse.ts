import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotCoreClass, BotObject, BotType } from './searchBotsApiResponse';
import { BotCategoryCommaSeparated, BotVersionStatus } from "./getListOfBotsApiResponse";

export enum BotAccessCategory {
  Locations = 1,
  DeviceFiles = 2,
  CallCenter = 3,
  Devices = 4,
  Challenges = 5,
  Rules = 6,
}

export enum BotCommunicationCategory {
  LocationUsers = 0,
  SpecificAddress = 1,
  OrganizationUsers = 2,
  OrganizationAdmins = 4,
}

export interface GetBotInfoApiResponse extends ApiResponseBase {
  app: {
    bundle: string;
    category?: BotCategoryCommaSeparated;
    type?: BotType;
    core?: BotCoreClass;
    instancesSummary?: string;
    trigger?: number;

    objects?: BotObject[]

    marketing?: {
      name?: string;
      author?: string;
      copyright?: string;
      description?: string;
      marketingUrl?: string;
      supportUrl?: string;
      videoUrl?: string;
      privacyUrl?: string;
    };

    versions?: Array<{
      version?: string;
      creationDate: string;
      creationDateMs: number;
      status?: BotVersionStatus;
      statusDate?: string;
      statusDateMs?: number;
      whatsnew?: string;
    }>;

    schedules?: Array<Object>;

    deviceTypes?: Array<{
      id: number;
      minOccurrence?: number;
      reason?: string;
    }>;

    access?: Array<{
      category: BotAccessCategory;
      reason?: string;
      trigger?: boolean;
      read?: boolean;
      control?: boolean;
    }>;

    communications?: Array<{
      category: BotCommunicationCategory;
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      msg?: boolean;
    }>;
  };
}
