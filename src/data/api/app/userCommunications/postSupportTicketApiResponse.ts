import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface PostSupportTicketApiResponse extends ApiResponseBase {
}

export interface PostSupportTicketModel {
  brand?: string;
  ticket: {

    /**
     * Type of the support ticket.
     */
    type: SupportTicketType;

    /**
     * Support priority.
     */
    priority: SupportPriority;

    /**
     * Subject of the ticket.
     */
    subject: string;

    /**
     * Detailed information.
     */
    comment: string;

    /**
     * Custom fields for ticketing system.
     */
    customFields?: Array<{
      [field: string]: string | number;
    }>;
  };
}

export enum SupportTicketType {
  Problem = 1,
  Incident = 2,
  Question = 3,
  Task = 4,
}

export enum SupportPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}
