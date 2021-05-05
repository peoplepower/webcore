import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface ConfigureBotApiResponse extends ApiResponseBase {
}

export enum BotInstanceStatus {
  Incomplete = 0,
  Active = 1,
  Inactive = 2,
  Error = 5
}

export interface ConfigureBotBody {
  app?: {
    nickname?: string;
    timezone?: string;
    access?: Array<{
      category: number;
      locationId?: number;
      deviceId?: string;
      excluded?: boolean;
    }>;
    communications?: Array<{
      category: number;
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      msg?: boolean;
    }>;
  };
}
