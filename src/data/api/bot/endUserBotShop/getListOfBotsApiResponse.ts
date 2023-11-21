import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotInstanceStatus } from './configureBotApiResponse';
import { BotAccessCategory, BotCommunicationCategory } from './getBotInfoApiResponse';
import { BotCategory, BotCoreClass, BotType } from './searchBotsApiResponse';

export interface GetListOfBotsApiResponse extends ApiResponseBase {
  bots: Array<{

    /**
     * Bot instance ID.
     */
    appInstanceId: number;

    /**
     * Location ID.
     */
    locationId?: number;

    /**
     * Indicated whether the bot instance runs the latest version of the bot.
     * The attribute value is 'true' if the bot instance is owned by developer or beta tester.
     */
    development?: boolean;

    /**
     * Indicates whether the bot instance may be triggered at its current state.
     * This depends on the values of the attributes 'status', 'development', 'published', 'endDate'.
     */
    active?: boolean;

    /**
     * Bot Instance Status
     */
    status?: BotInstanceStatus;

    /**
     * The date when the bot instance can be automatically paused.
     * This only happens if 'development=true' and the latest bot version is not published yet.
     */
    endDate?: string;
    endDateMs?: number;

    /**
     * Bot instance timezone
     */
    timezone?: string;

    /**
     * Bot instance purchase date.
     */
    purchaseDate?: string;
    purchaseDateMs?: number;

    /**
     * Bot instance nickname.
     */
    nickname?: string;

    badge?: number;

    condition?: string;

    /**
     * Bot instance version information.
     */
    version: {
      id: number;

      /**
       * The release number of the parent bot version.
       */
      version: string,

      goalRule: boolean;

      /**
       * Bot version status.
       */
      status?: BotVersionStatus;

      statusDateMs?: number;

      /**
       * Version creation date.
       */
      creationDate: string;
      creationDateMs: number;

      /**
       * Bot instance trigger.
       */
      trigger?: number;

      /**
       * Bot instance schedules.
       */
      schedules?: {
        DAILY_MID_DAY?: string;
        DAILY_REMINDER?: string;
        HEALTH_ANALYSIS?: string;
        HOUR?: string;
        JOURNAL?: string;
        MIDNIGHT?: string;
        ML?: string;
        REMINDER?: string;
        SLEEP?: string;
        WAKE_UP?: string;
        WEEKLY_STOVETOP?: string;
      };

      /**
       * Decryption of the latest bot update.
       */
      whatsnew?: string;
    };

    /**
     * Bot instance bundle information.
     */
    bot: {

      /**
       * The marketing name of the bot.
       */
      name?: string;

      /**
       * Bot instance description.
       */
      description?: string;

      /**
       * Bot instance author.
       */
      author?: string;

      /**
       * The bundle ID of the parent bot.
       */
      bundle?: string;

      /**
       * Bot instance type.
       */
      type?: BotType;

      /**
       * Bot Category comma-separated string
       */
      category?: BotCategoryCommaSeparated;

      /**
       * Bot Core class
       */
      core?: BotCoreClass;
    };

    /**
     * Bot instance access rules.
     */
    access?: Array<{

      /**
       * Bot instance access category.
       */
      category?: BotAccessCategory

      trigger?: boolean;
      read?: boolean;
      control?: boolean;
      executed?: boolean;
      excluded?: boolean;

      /**
       * Specific device ID Bot instance have access to.
       */
      deviceId?: string;

      /**
       * Specific device type Bot instance have access to.
       */
      deviceType?: string;

      /**
       * Multilingual description.
       */
      reason?: {
        [key: string]: string;
      };
    }>;

    /**
     * Bot instance communication settings.
     */
    communications?: Array<{
      category?: BotCommunicationCategory;
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      msg?: boolean;
    }>;
  }>;
}

export enum BotVersionStatus {
  WaitingForUpload = 0,
  PrivatelyAvailable = 1,
  SubmittedForReview = 2,
  UnderReview = 3,
  PubliclyAvailable = 4,
  StoreOrSystemRejected = 5,
  DeveloperRejected = 6,
  Restorable = 7,
  Archived = 8
}

/**
 * Bot Category encoded in comma-separated string
 */
export type BotCategoryCommaSeparated = `${BotCategory}` |
  `${BotCategory},${BotCategory}` |
  `${BotCategory},${BotCategory},${BotCategory}` |
  `${BotCategory},${BotCategory},${BotCategory},${BotCategory}` |
  `${BotCategory},${BotCategory},${BotCategory},${BotCategory},${BotCategory}` |
  `${BotCategory},${BotCategory},${BotCategory},${BotCategory},${BotCategory},${BotCategory}`;
