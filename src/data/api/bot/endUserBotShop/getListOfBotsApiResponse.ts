import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotInstanceStatus } from './configureBotApiResponse';
import { BotAccessCategory, BotCommunicationCategory } from './getBotInfoApiResponse';
import { BotType } from './searchBotsApiResponse';

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
     * Indicates whether the parent bot version has been published.
     */
    published?: boolean;

    /**
     * Bot instance nickname.
     */
    nickname?: string;

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
       * Bot instance status.
       */
      status?: BotInstanceStatus;
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
        HOUR?: string;
        MIDNIGHT?: string;
        ML?: string;
        SLEEP?: string;
        WAKE_UP?: string;
      };
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
    };

    /**
     * Bot instance access rueles.
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

      /**
       * Specific device ID Bot instance have an access to.
       */
      deviceId?: string;

      /**
       * Specific device type Bot instance have an access to.
       */
      deviceType?: string;

      /**
       * Multilanguage description.
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
