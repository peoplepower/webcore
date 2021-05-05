import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface SendMessageApiResponse extends ApiResponseBase {
  messageId: number;
}

export interface Message {
  /**
   * Subject line of the message
   */
  subject: string;
  /**
   * The developer can use this field to store any value needed to assist the app. Its contents are unused and
   * undefined by Ensemble.
   */
  type: number;
  /**
   * Specific date to send this message. Optional. i.e.: 2016-05-08
   */
  sendDate?: string;
  /**
   * Message body. Data can also be delivered in base-64 encoding, but it must be interpreted by the application.
   */
  text: string;
  /**
   * Indicates whether the message needs to be delivered also over email.
   */
  email: boolean;
  /**
   * Indicates whether the message needs to be delivered also over push message channel.
   */
  push: boolean;
  /**
   * Instructs whether replies to this thread are allowed or not.
   */
  notReply: boolean;
  /**
   * Array of recipients
   */
  recipient: Array<{
    /**
     * Deliver message to entire organization ID if no groupId and userId specified
     */
    organizationId?: number;
    /**
     * Deliver message to entire group ID if no userId specified
     */
    groupId?: number;
    /**
     * Deliver message to the specified user Id
     */
    userId?: number;
    /**
     * Send the message to a tagged group of users
     */
    userTag?: string;

    deviceTag?: string;
  }>;
  /**
   * Send a message to participants of this challenge
   */
  challengeId?: number;
  /**
   * A bitmask for the challenge participant statuses:
   * 1 - Not responded
   * 2 - Opted In
   * 4 - Opted Out
   */
  challengeParticipantStatus?: ChallengeParticipantStatus;
  /**
   * A key/value pairs map containing string parameters
   */
  parameters?: {
    [key: string]: string;
  };
}

export interface SendMessageModel {
  /**
   * Message to be sent
   */
  message: Message;
}

/**
 * A bitmask for the challenge participant statuses:
 * 1 - Not responded
 * 2 - Opted In
 * 4 - Opted Out
 */
export enum ChallengeParticipantStatus {
  NotResponded = 1,
  OptedIn = 2,
  OptedOut = 4
}
