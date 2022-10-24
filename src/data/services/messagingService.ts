import { inject, injectable } from '../../modules/common/di';
import { UserCommunicationsApi } from '../api/app/userCommunications/userCommunicationsApi';
import { GetMessagesApiResponse, MessageStatus } from '../api/app/userCommunications/getMessagesApiResponse';
import { Message } from '../api/app/userCommunications/sendMessageApiResponse';
import { GetNotificationSubscriptionsApiResponse } from '../api/app/userCommunications/getNotificationSubscriptionsApiResponse';
import { GetNotificationsApiResponse } from '../api/app/userCommunications/getNotificationsApiResponse';
import { ApiResponseBase } from '../models/apiResponseBase';
import { RequestSupportApiResponse, RequestSupportModel } from '../api/app/userCommunications/requestSupportApiResponse';
import { BaseService } from './baseService';
import { UpdateMessageModel } from '../api/app/userCommunications/updateMessageApiResponse';
import { PostSupportTicketApiResponse, PostSupportTicketModel } from '../api/app/userCommunications/postSupportTicketApiResponse';
import { AuthService } from './authService';

/**
 * Exposes interface to operate the messages that are send from user to user in the system.
 */
@injectable('MessagingService')
export class MessagingService extends BaseService {
  @inject('UserCommunicationsApi') protected readonly userCommunicationsApi!: UserCommunicationsApi;
  @inject('AuthService') protected readonly authService!: AuthService;

  constructor() {
    super();
  }

  /**
   * Gets messages for the currently logged in user.
   * @deprecated Functionality deprecated from Server v1.26
   *
   * @param [params] Request parameters.
   * @param {MessageStatus} [params.status] Status of the messages to get (receive).
   * @param {number} [params.messageId] Filter messages and replies by the original message ID.
   * @param {number} [params.userId] User ID to get messages for, for use by administrators only.
   * @param {number} [params.type] This field is available for the application developer to use as needed.
   * @param {number} [params.challengeId] Get messages linked to this challenge.
   * @param {string} [params.searchBy] Search by subject, text, from or recipient fields. Use * for a wildcard.
   * @returns {Promise<GetMessagesApiResponse>}
   */
  getMessages(params?: {
    status?: MessageStatus;
    messageId?: number;
    userId?: number;
    type?: number;
    challengeId?: number;
    searchBy?: string;
    sortBy?: string;
    sortOrder?: string;
    sortCollection?: string;
    rowCount?: number;
  }): Promise<GetMessagesApiResponse> {
    if (params && !params.rowCount) {
      params.rowCount = 300;
    }
    return this.userCommunicationsApi.getMessages(params);
  }

  /**
   * Gets messages and reply messages corresponding to the particular original messageId.
   * @deprecated Functionality deprecated from Server v1.26
   *
   * @param params Request parameters.
   * @param {MessageStatus} [params.status] Status of the messages to get (receive).
   * @param {number} params.messageId Filter messages and replies by the original message ID.
   * @param {number} [params.userId] User ID to get messages for, for use by administrators only.
   * @param {number} [params.type] This field is available for the application developer to use as needed. It is unused
   *     and undefined by Ensemble.
   * @param {number} [params.challengeId] Get messages linked to this challenge.
   * @param {string} [params.searchBy] Search by subject, text, from or recipient fields. Use * for a wildcard.
   * @returns {Promise<GetMessagesApiResponse>}
   */
  public getMessageChain(params: {
    messageId: number;
    status?: MessageStatus;
    userId?: number;
    type?: number;
    challengeId?: number;
    searchBy?: string;
    sortBy?: string;
    sortOrder?: string;
    sortCollection?: string;
    rowCount?: number;
  }): Promise<GetMessagesApiResponse> {
    if (!params || !params.messageId || params.messageId < 1) {
      return this.reject(`messageId parameter value is incorrect: ${params.messageId}`);
    }
    if (!params.sortBy) {
      params.sortBy = 'creationDate';
    }
    if (!params.sortOrder) {
      params.sortOrder = 'desc';
    }
    if (!params.rowCount) {
      params.rowCount = 300;
    }

    return this.userCommunicationsApi.getMessages(params);
  }

  /**
   * Gets messages for the specified user.
   * @deprecated Functionality deprecated from Server v1.26
   *
   * @param {number} userId
   * @param {MessageStatus} status
   * @param {string} searchBy
   * @param {number} type
   * @param {string} sortBy
   * @param {string} sortOrder
   * @returns {Promise<GetMessagesApiResponse>}
   */
  public getMessagesForUser(
    userId?: number,
    status?: MessageStatus,
    searchBy?: string,
    type?: number,
    sortBy: string = 'creationDate',
    sortOrder: string = 'desc',
  ): Promise<GetMessagesApiResponse> {
    if (!userId || userId < 1) {
      return this.reject(`userId parameter value is incorrect: ${userId}`);
    }

    return this.userCommunicationsApi.getMessages({
      userId: userId,
      status: status,
      type: type,
      sortCollection: 'messages',
      searchBy: searchBy,
      sortBy: sortBy,
      sortOrder: sortOrder,
      rowCount: 300, // magic number. Check CC-433 task
    });
  }

  /**
   * Sends the message and returns the sent message Id.
   * @deprecated Functionality deprecated from Server v1.26
   *
   * @param {Message} message
   * @returns {Promise<ApiResponseBase>}
   */
  public sendMessage(message: Message): Promise<ApiResponseBase> {
    if (!message) {
      return this.reject('Message to be sent can not be null.');
    }

    return this.userCommunicationsApi.sendMessage({message: message});
  }

  /**
   * Replies to the specified message.
   * @deprecated Functionality deprecated from Server v1.26
   *
   * @param {number} replyToMessageId Id of the message to reply to.
   * @param reply Reply model
   * @returns {Promise<ApiResponseBase>}
   */
  public replyToMessage(
    replyToMessageId: number,
    reply: {
      text: string;
      email: boolean;
      push: boolean;
    },
  ): Promise<ApiResponseBase> {
    if (!reply) {
      return this.reject('Reply message to be sent can not be null.');
    }

    return this.userCommunicationsApi.replyToMessage(replyToMessageId, {message: reply});
  }

  /**
   * Updates specified message with the supplied message properties.
   * @deprecated Functionality deprecated from Server v1.26
   *
   * @param {number} messageId
   * @param [messageProperties]
   * @param {boolean} [markAsRead]
   * @returns {Promise<ApiResponseBase>}
   */
  public updateMessage(
    messageId: number,
    markAsRead: boolean = false,
    messageProperties?: {
      subject?: string;
      text?: string;
      parameters?: {
        [key: string]: string;
      };
    },
  ): Promise<ApiResponseBase> {
    if (!messageId || messageId < 1) {
      return this.reject(`messageId parameter value is incorrect: ${messageId}`);
    }

    const messageModel: UpdateMessageModel | undefined = messageProperties ? {message: messageProperties} : undefined;
    return this.userCommunicationsApi.updateMessage(messageId, messageModel, {read: markAsRead});
  }

  /**
   * Deletes the specified message.
   * @deprecated Functionality deprecated from Server v1.26
   *
   * @param {number} messageId
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteMessage(messageId: number): Promise<ApiResponseBase> {
    if (!messageId || messageId < 1) {
      return this.reject(`messageId parameter value is incorrect: ${messageId}`);
    }

    return this.userCommunicationsApi.deleteMessage(messageId);
  }

  /**
   * Gets notification subscriptions for specific user.
   * @param {number} [userId] User ID for bots and administrators.
   * @returns {Promise<GetNotificationSubscriptionsApiResponse>}
   */
  public getNotificationSubscriptions(userId?: number): Promise<GetNotificationSubscriptionsApiResponse> {
    if (userId && (isNaN(userId) || userId < 1)) {
      return this.reject(`userId parameter value is incorrect: ${userId}`);
    }
    let params = userId ? {userId: userId} : undefined;
    return this.userCommunicationsApi.getNotificationSubscriptions(params);
  }

  /**
   * Updates notification subscription for specific user.
   * @param {number} type Type of notification.
   * @param params Requested parameters.
   * @param {number} [params.userId] User ID for bots and administrators.
   * @param {number} [params.locationId] Location ID.
   * @param {boolean} [params.email] Disable/enable Email notifications.
   * @param {boolean} [params.push] Disable/enable Push notifications.
   * @param {boolean} [params.sms] Disable/enable SMS notifications.
   * @param {number} [params.emailPeriod] Minimum number of seconds between email notifications.
   * @param {number} [params.pushPeriod] Minimum number of seconds between push notifications.
   * @param {number} [params.smsPeriod] Minimum number of seconds between sms notifications.
   * @returns {Promise<ApiResponseBase>}
   */
  public setNotificationSubscriptions(
    type: number,
    params?: {
      userId?: number;
      locationId?: number;
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      emailPeriod?: number;
      pushPeriod?: number;
      smsPeriod?: number;
    },
  ): Promise<ApiResponseBase> {
    if (isNaN(type) || type < 0) {
      return this.reject(`Type parameter value is incorrect: ${type}`);
    }
    return this.userCommunicationsApi.setNotificationSubscriptions(type, params);
  }

  /**
   * Gets notifications for specific user or location.
   * @param params Requested parameters.
   * @param {string} params.startDate Start date to select notifications.
   * @param {string} [params.endDate] End date to select notifications. Default is the current date.
   * @param {number} [params.userId] Get notifications for this user by an administrator.
   * @param {number} [params.locationId] Get notifications related to this location.
   * @returns {Promise<GetNotificationsApiResponse>}
   */
  public getNotifications(params: {
    startDate: string;
    endDate?: string;
    userId?: number;
    locationId?: number;
    rowCount?: number;
  }): Promise<GetNotificationsApiResponse> {
    if (!params || !params.startDate) {
      return this.reject(`startDate parameter is mandatory`);
    }
    if (params && !params.rowCount) {
      params.rowCount = 300;
    }
    return this.userCommunicationsApi.getNotifications(params);
  }

  /**
   * Sends a request to customer support.
   * @param {RequestSupportModel} model Request model.
   * @param {string} [appName] App name to forward the support request.
   * @returns {Promise<RequestSupportApiResponse>}
   */
  public requestSupport(model: RequestSupportModel, appName?: string): Promise<RequestSupportApiResponse> {
    let params = appName ? {appName: appName} : undefined;
    return this.userCommunicationsApi.requestSupport(model, params);
  }

  /**
   * Post support ticket.
   * The request is executed asynchronously. The user will be notified about created ticket.
   * @param model Support ticket model.
   * @param {number} [userId] Request support for this user by an administrator.
   * @returns
   */
  public postSupportTicket(
    model: PostSupportTicketModel,
    userId?: number,
  ): Promise<PostSupportTicketApiResponse> {
    let params: {
      userId?: number;
    } = {};

    if (userId) {
      if (userId < 1 || isNaN(userId)) {
        return this.reject(`User ID is incorrect [${userId}].`);
      }
      params.userId = userId;
    }

    return this.authService.ensureAuthenticated().then(() => this.userCommunicationsApi.postSupportTicket(model, params));
  }
}
