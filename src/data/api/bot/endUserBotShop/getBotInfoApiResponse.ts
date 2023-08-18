import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotCategory } from './searchBotsApiResponse';

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
    category?: BotCategory;
    marketing?: {
      name?: string;
      author?: string;
      copyright?: string;
      description?: string;
    };
    instancesSummary?: string;
    rating?: {
      total?: number;
      average?: number;
    };
    versions?: Array<{
      version?: string;
      statusChangeDate?: string;
      statusChangeDateMs?: number;
      whatsnew?: string;
      rating?: {
        total?: number;
        average?: number;
      };
    }>;
    trigger?: number;
    schedules?: Array<Object>;
    deviceTypes?: Array<{
      id: number;
      minOccurrence?: number;
      reason?: string;
    }>;
    access?: Array<{
      category: BotAccessCategory;
      reason?: string;
    }>;
    communications?: Array<{
      category: BotCommunicationCategory;
      email: boolean;
      push: boolean;
      sms: boolean;
      msg?: boolean;
    }>;
  };
}
