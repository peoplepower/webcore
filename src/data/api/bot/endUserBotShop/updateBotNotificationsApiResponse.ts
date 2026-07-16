import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UpdateBotNotificationsModel {
  groups: Array<{
    /**
     * Organization notification group ID.
     */
    groupId: number;

    /**
     * Bot notification entry ID.
     */
    notificationId: number;

    /**
     * Remove specified notification from the group.
     */
    delete?: boolean;
  }>;
}

export interface UpdateBotNotificationsApiResponse extends ApiResponseBase {}
