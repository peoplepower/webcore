import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotCategoryCommaSeparated } from './getListOfBotsApiResponse';
import { BotCoreClass, BotType } from './searchBotsApiResponse';

export interface GetBotNotificationsApiResponse extends ApiResponseBase {
  apps?: Array<{
    appId: number;
    bundle: string;
    name: string;
    author: string;
    category: BotCategoryCommaSeparated;
    description: string;
    type: BotType;
    core: BotCoreClass;

    /**
     * List of notifications.
     */
    notifications: Array<{
      notificationId: number;

      /**
       * Title of the notification, multilingual.
       */
      title: {
        [key: string]: string;
      };

      /**
       * Description of the notification, multilingual.
       */
      description: {
        [key: string]: string;
      };

      /**
       * Service plan name.
       */
      serviceName?: string;

      exampleObjectName?: string;

      /**
       * List of notification groups associated with the notification.
       * Groups could be returned from nested sub-organizations.
       */
      groups?: Array<{
        groupId: number;
        organizationId: number;
        name?: string;
        description?: string;
      }>;

    }>;
  }>;
}
