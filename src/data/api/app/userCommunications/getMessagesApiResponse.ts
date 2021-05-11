import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum MessageStatus {
  SentMessages = 0,
  InboundUnreadMessages = 1,
  InboundReadMessages = 2,
  AllInboundMessages = 3,
}

export interface Message {
  id: number;
  originalMessageId: number;
  creationDate: string;
  creationDateMs: number;
  sendDate: string;
  sendDateMs: number;
  read: boolean;
  notReply: boolean;
  email: boolean;
  push: boolean;
  from: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  subject: string;
  type: number;
  text: string;
  challengeId: number;
  challengeParticipantStatus: number;
  recipients: Array<{
    organizationId?: number;
    organizationName?: string;
    groupId?: number;
    groupName?: string;
    userId?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    userTag?: string;
    deviceTag?: string;
  }>;
  parameters: {
    [key: string]: string;
  };
}

export interface GetMessagesApiResponse extends ApiResponseBase {
  messages: Array<Message>;
}
