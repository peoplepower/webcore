import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { DeleteMessageApiResponse } from './deleteMessageApiResponse';
import { GetCrowdFeedbackByIdApiResponse } from './getCrowdFeedbackByIdApiResponse';
import { GetMessagesApiResponse, MessageStatus } from './getMessagesApiResponse';
import { GetNotificationSubscriptionsApiResponse, NotificationType } from './getNotificationSubscriptionsApiResponse';
import { CrowdFeedbackType, PostCrowdFeedbackApiResponse, PostCrowdFeedbackModel } from './postCrowdFeedbackApiResponse';
import { ReplyToMessageApiResponse, ReplyToMessageModel } from './replyToMessageApiResponse';
import { RequestSupportApiResponse, RequestSupportModel } from './requestSupportApiResponse';
import { SearchCrowdFeedbackApiResponse } from './searchCrowdFeedbackApiResponse';
import { SendMessageApiResponse, SendMessageModel } from './sendMessageApiResponse';
import { SendNotificationApiResponse, SendNotificationModel } from './sendNotificationApiResponse';
import { GetNotificationsApiResponse } from './getNotificationsApiResponse';
import { UpdateCrowdFeedbackApiResponse, UpdateCrowdFeedbackModel } from './updateCrowdFeedbackApiResponse';
import { UpdateMessageApiResponse, UpdateMessageModel } from './updateMessageApiResponse';
import { VoteForCrowdFeedbackApiResponse } from './voteForCrowdFeedbackApiResponse';
import { GetQuestionsApiResponse } from './getQuestionsApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { AnswerQuestionsApiResponse, AnswerQuestionsModel } from './answerQuestionsApiResponse';

/**
 * User Communications.
 * See {@link http://docs.iotapps.apiary.io/#reference/user-communications}
 *
 * It is extremely important to communicate with your user base, and Ensemble enables communications more
 * comprehensively than any other IoT platform in existence today. Whether it's sending messages to your users, allowing
 * your users to talk to each other, or gather quantified feedback from the crowd to drive your roadmap, Ensemble takes user communications very seriously
 * and provides a well rounded set of APIs to manage communications.Ensemble supports the following types of user communications:
 * - Email notifications with customizable, Velocity-scriptable templates (welcome emails, email address confirmations, password reset, alerts, etc.)
 * - Push notifications (alerts, badges, etc.)
 * - SMS notifications
 * - In-app messaging (from admin to users and groups, users to other users and groups, replies, etc.)
 * - Support requests
 * - Crowd feedback - very powerful CTO-level tool to quantify feature requests and issues across the user base
 */
@injectable('UserCommunicationsApi')
export class UserCommunicationsApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Allows to delete previously submitted message.
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/manage-a-message/delete-a-message}
   * @param {number} messageId Id of the message to delete.
   * @returns {Promise<DeleteMessageApiResponse>}
   */
  deleteMessage(messageId: number): Promise<DeleteMessageApiResponse> {
    return this.dal.delete('messages/' + encodeURIComponent(messageId.toString()));
  }

  /**
   * Gets crowd feedback entry by its Id.
   * See {@link
    * http://docs.iotapps.apiary.io/#reference/user-communications/post-crowd-feedback/get-specific-crowd-feedback}
   *
   * @returns {Promise<GetCrowdFeedbackByIdApiResponse>}
   */
  getCrowdFeedbackById(feedbackId: number): Promise<GetCrowdFeedbackByIdApiResponse> {
    return this.dal.get('feedback/' + encodeURIComponent(feedbackId.toString()));
  }

  /**
   * It is possible for a user to get sent messages while remaining anonymous to other people within the Community
   * Social Network. See <user updates> section to specify anonymity.
   *
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/in-app-messaging/receive-messages}
   *
   * @param [params] Request parameters.
   * @param {MessageStatus} [params.status] Status of the messages to get (receive).
   * @param {number} [params.messageId] Filter messages and replies by the original message ID.
   * @param {number} [params.userId] User ID to get messages for, for use by administrators only.
   * @param {number} [params.type] This field is available for the application developer to use as needed. It is unused
   *     and undefined by Ensemble.
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
    return this.dal.get('messages', {params: params});
  }

  /**
   * A user may subscribe or unsubscribe from certain types of push and email notifications, or set boundaries on how
   * many notifications their account can receive within a specified amount of time. This method allows to get the
   * current user subscriptions.
   *
   * Ensemble supports following subscriptions:
   * Type  |  Description  |  Default value, if not set
   * 0 - Allow to unsubscribe from all communications - true
   * 1 - Marketing messages - true
   * 2 - Device sharing - true
   * 3 - organizations - true
   * 4 - Analytic apps - true
   * 6 - Account creation follow up - false
   * 7 - Device alerts - true
   * 8 - External notification by API call - true
   *
   * See {@link
    * http://docs.iotapps.apiary.io/#reference/user-communications/get-notification-subscriptions/get-my-notification-subscriptions}
   *
   * @param [params] Request parameters.
   * @param {number} [params.userId] User ID for administrators.
   * @returns {Promise<GetNotificationSubscriptionsApiResponse>}
   */
  getNotificationSubscriptions(params?: { userId?: number }): Promise<GetNotificationSubscriptionsApiResponse> {
    return this.dal.get('notificationSubscriptions', {params: params});
  }

  /**
   * Crowd feedback is first delivered to a support email for moderation. If the feedback is unique, then the support
   * staff will make it public for other users to vote on.
   *
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/post-crowd-feedback/post-crowd-feedback}
   *
   * @returns {Promise<PostCrowdFeedbackApiResponse>}
   */
  postCrowdFeedback(model: PostCrowdFeedbackModel): Promise<PostCrowdFeedbackApiResponse> {
    return this.dal.post('feedback', model);
  }

  /**
   * Allows to reply to the particular message.
   *
   * When replying to a message, the body may specify whether to also delivery the reply over email and push
   * notification, to notify the recipient.
   *
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/manage-a-message/reply-to-a-message}
   *
   * @param {number} messageId Id of the message to reply to.
   * @param {ReplyToMessageModel} model Message to send
   * @returns {Promise<ReplyToMessageApiResponse>}
   */
  replyToMessage(messageId: number, model: ReplyToMessageModel): Promise<ReplyToMessageApiResponse> {
    return this.dal.post(`messages/${encodeURIComponent(messageId.toString())}`, model);
  }

  /**
   * Allows a user to request support from PeoplePowerCo
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/request-support/request-support}
   *
   * @param {RequestSupportModel} [model] Request support model
   * @param [params] Request parameters
   * @param {string} [params.appName] App name to forward the support request
   * @returns {Promise<RequestSupportApiResponse>}
   */
  requestSupport(model: RequestSupportModel, params?: { appName?: string }): Promise<RequestSupportApiResponse> {
    return this.dal.post('support', model, {params: params});
  }

  /**
   * Search crowd feedback entries according to supplied parameters.
   * See {@link
    * http://docs.iotapps.apiary.io/#reference/user-communications/get-crowd-feedback-by-searching/get-crowd-feedback-by-searching}
   *
   * @param {string} appName Unique name / identifier of the app or product, selected by the developer
   * @param {CrowdFeedbackType} type Type of the feedback entry (1 - New feature request, 2 - Problem report)
   * @param [params] Request parameters
   * @param {number} [params.startPos] Index of the first record to be returned.
   * @param {number} [params.length] Number of records to return.
   * @param {number|number[]} [params.productId] Filter the response by product ID. You may include multiple of these
   *     parameters to filter by multiple product IDs.
   * @param {number|number[]} [params.productCategory] Filter the response by product category. You may include
   *     multiple of these parameters to filter by multiple product categories.
   * @param {boolean} [params.disabled] Return return not enabled feedbacks as well.
   * @returns {Promise<SearchCrowdFeedbackApiResponse>}
   */
  searchCrowdFeedback(
    appName: string,
    type: CrowdFeedbackType,
    params?: {
      startPos?: number;
      length?: number;
      productId?: number | number[];
      productCategory?: number | number[];
      disabled?: boolean;
    },
  ): Promise<SearchCrowdFeedbackApiResponse> {
    return this.dal.get(`feedback/${encodeURIComponent(appName)}/${encodeURIComponent(type.toString())}`, {params: params});
  }

  /**
   * It is possible for a user to send a message while remaining anonymous to other people within the Community Social
   * Network. See <user updates> section to specify anonymity.
   *
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/in-app-messaging/send-a-message}
   *
   * @param {SendMessageModel} model Model containing message's data to be sent
   * @returns {Promise<SendMessageApiResponse>}
   */
  sendMessage(model: SendMessageModel): Promise<SendMessageApiResponse> {
    return this.dal.post('messages', model);
  }

  /**
   * Sends an arbitrary push notification or email to the user. If you're sending an email, you may include a subject
   * and specify whether the email is in HTML format or plain text. Push notification messages are limited by the
   * standard push notification payload size, usually ~120 characters max is OK.This API allows to include inline
   * graphics as an attachment. All attachment fields are mandatory. The content field contains the Base64 encoded
   * binary image content. The generated by the app email content or the template should include correct references to
   * inline graphics content ID's with "cid:" prefixes. For example <img src="cid:inlineImageId">.
   *
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/send-a-notification/send-a-notification}
   *
   * @param {SendNotificationModel} model Notification
   * @param [params] Request parameters
   * @param {number} [params.userId] Send a notification to this user by an administrator
   * @param {number} [params.organizationId] Use templates of specific organization specified by its Id
   * @returns {Promise<SendNotificationApiResponse>}
   */
  sendNotification(
    model: SendNotificationModel,
    params?: {
      userId?: number;
      organizationId?: number;
    },
  ): Promise<SendNotificationApiResponse> {
    return this.dal.post('notifications', model, {params: params});
  }

  /**
   * Gets notifications.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-communications/send-a-notification/get-notifications}
   *
   * @param params Request parameters
   * @param {string} params.startDate Start date to select notifications
   * @param {number} [params.userId] Get notifications for this user by an administrator
   * @param {string} [params.endDate] End date to select notifications. Default is the current date
   * @param {number} [params.locationId] Get notifications related to this location
   * @returns {Promise<SendNotificationApiResponse>}
   */
  getNotifications(params: {
    startDate: string;
    userId?: number;
    endDate?: string;
    locationId?: number;
  }): Promise<GetNotificationsApiResponse> {
    return this.dal.get('notifications', {params: params});
  }

  /**
   * A user may subscribe or unsubscribe from certain types of push and email notifications, or set boundaries on how many notifications their account can
   * receive within a specified amount of time. This method allows to set the current user subscriptions.
   *
   * See {@link
    * http://docs.iotapps.apiary.io/#reference/user-communications/get-notification-subscriptions/get-my-notification-subscriptions}
   *
   * @param {NotificationType} type Type of notification, as defined by Ensemble during the request to Get Subscription Notifications.
   * @param params Request parameters
   * @param {number} [params.userId] User ID for bots and administrators
   * @param {number} [params.locationId] Location ID
   * @param {boolean} [params.email] Enable or disable email notifications
   * @param {boolean} [params.push] Enable or disable push notifications
   * @param {boolean} [params.sms] Enable or disable sms notifications
   * @param {number} [params.emailPeriod] Minimum number of seconds between email notifications
   * @param {number} [params.pushPeriod] Minimum number of seconds between push notifications
   * @param {number} [params.smsPeriod] Minimum number of seconds between SMS notifications
   * @returns {Promise<ApiResponseBase>}
   */
  setNotificationSubscriptions(
    type: NotificationType,
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
    return this.dal.put(`notificationSubscriptions/${encodeURIComponent(type.toString())}`, {}, {params: params});
  }

  /**
   * Updates particular crowd feedback entry.
   * See {@link
    * http://docs.iotapps.apiary.io/#reference/user-communications/get-specific-crowd-feedback/update-feedback}
   *
   * @param {number} feedbackId Feedback ID to update
   * @param {UpdateCrowdFeedbackModel} model Feedback Crowd Feedback Model
   * @returns {Promise<UpdateCrowdFeedbackApiResponse>}
   */
  updateCrowdFeedback(feedbackId: number, model: UpdateCrowdFeedbackModel): Promise<UpdateCrowdFeedbackApiResponse> {
    return this.dal.put(`feedback/${encodeURIComponent(feedbackId.toString())}`, model);
  }

  /**
   * Allows to update message.
   * See {@link http://docs.iotapps.apiary.io/#reference/user-communications/manage-a-message/update-message-attributes}
   *
   * @param {number} messageId Id of the message to update attributes for.
   * @param {UpdateMessageModel} model Message model
   * @param [params] Request parameters.
   * @param {boolean} [params.read] Flag to specify whether we want to mark the message as read or unread
   * @returns {Promise<UpdateMessageApiResponse>}
   */
  updateMessage(
    messageId: number,
    model?: UpdateMessageModel,
    params?: {
      read?: boolean;
    },
  ): Promise<UpdateMessageApiResponse> {
    const parameters = {
      params: params,
      headers: {'Content-Type': 'application/json'}, //to explicitly tell the content type even if model is null
    };
    return this.dal.put('messages/' + encodeURIComponent(messageId.toString()), model, parameters);
  }

  /**
   * Updates particular crowd feedback entry.
   * See {@link
    * http://docs.iotapps.apiary.io/#reference/user-communications/get-specific-crowd-feedback/update-feedback}
   *
   * @param {number} feedbackId Feedback ID to vote on
   * @param {number} rank 1 to cast a vote, 0 to remove a vote.
   * @returns {Promise<VoteForCrowdFeedbackApiResponse>}
   */
  voteForCrowdFeedback(feedbackId: number, rank: number): Promise<VoteForCrowdFeedbackApiResponse> {
    return this.dal.put(`feedback/${encodeURIComponent(feedbackId.toString())}/${encodeURIComponent(rank.toString())}`);
  }

  /**
   * Retrieve requested questions for specific location.
   * See {@link https://iotapps.docs.apiary.io/#reference/user-communications/questions/get-questions}
   *
   * @param params Reuested parameters.
   * @param {number} params.locationId Location ID to get questions.
   * @param {number | number[]} [params.answerStatus] Return questions with requested answer statuses. By default questions with statuses 2 and 3 are returned.
   *   Multiple values are supported.
   * @param {boolean} [params.editable] Filter answered questions:
   *   - true - return only editable answered questions,
   *   - false - return only not editable answered questions,
   * otherwise return all answered questions.
   * @param {string} [params.collectionName] Questions collection name filter.
   * @param {number} [params.questionId] Extract a specific question ID.
   * @param {number} [params.appInstanceId] Only retrieve questions for a specific bot.
   * @param {string} [params.lang] Questions text language. If not set, user's or default language will be used.
   * @param {number} [params.limit] Maximum number of questions to return. The default is unlimited.
   * @returns {Promise<GetQuestionsApiResponse>}
   */
  getQuestions(params: {
    locationId: number;
    answerStatus?: number | number[];
    editable?: boolean;
    collectionName?: string;
    questionId?: number;
    appInstanceId?: number;
    lang?: string;
    limit?: number;
  }): Promise<GetQuestionsApiResponse> {
    return this.dal.get('questions', {params: params});
  }

  /**
   * Answer question(s)
   * See {@link https://iotapps.docs.apiary.io/#reference/user-communications/questions/answer-questions}
   * @param {number} locationId Location ID to answer question(s).
   * @param {AnswerQuestionsModel} model Answers content.
   * @returns {Promise<AnswerQuestionsApiResponse>}
   */
  answerQuestions(locationId: number, model: AnswerQuestionsModel): Promise<AnswerQuestionsApiResponse> {
    const parameters = {
      params: {
        locationId: locationId,
      },
      headers: {'Content-Type': 'application/json'},
    };
    return this.dal.put('questions', model, parameters);
  }
}
