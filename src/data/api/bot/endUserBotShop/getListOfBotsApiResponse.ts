import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotInstanceStatus } from './configureBotApiResponse';
import { BotType } from './searchBotsApiResponse';

export interface GetListOfBotsApiResponse extends ApiResponseBase {
  apps: Array<{
    appInstanceId: number;
    status?: BotInstanceStatus;
    executionService?: number;
    development?: boolean;
    bundle?: string;
    locationId?: number;
    circleId?: number;
    purchaseDate?: string;
    purchaseDateMs?: number;
    nickname?: string;
    name?: string;
    author?: string;
    description?: string;
    category?: string;
    type?: BotType;
    timezone?: string;
    version?: string;
    badge?: number;
    condition?: string;
    trigger?: number;
    endDate?: string;
    endDateMs?: number;
    schedules?: {
      ID1?: string;
      WeeklyEmail?: string;
    };
    access?: Array<{
      category?: number;
      locationId?: number;
      excluded?: boolean;
      deviceId?: string;
      deviceType?: number;
      minOccurrence?: number;
      reason?: string;
    }>;
    communications?: Array<{
      category?: number;
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      msg?: boolean;
    }>;
  }>;
}
