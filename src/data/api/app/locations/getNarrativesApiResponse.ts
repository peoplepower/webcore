import { ApiResponseBase } from '../../../models/apiResponseBase';
import { PhoneType } from '../userAccounts/createUserAndLocationApiResponse';
import { EmailVerificationStatus, PhoneVerificationStatus } from '../userAccounts/getUserInformationApiResponse';
import { NarrativePriority, NarrativeStatus } from './createOrUpdateNarrativeApiResponse';
import { LocationType } from "./editLocationApiResponse";

export interface GetNarrativesApiResponse extends ApiResponseBase {
  nextMarker: string;
  narratives: Narrative[];
}

export enum NarrativeType {
  /**
   * High-frequency time-series "observations", default
   */
  Default = 0,

  /**
   * Deleted user (organization)
   */
  UserDeleted = 1,

  /**
   * Deleted location (organization)
   */
  LocationDeleted = 2,

  /**
   * Moved location (organization)
   */
  LocationMoved = 3,

  /**
   * Low-frequency time-series "journal" (location)
   */
  Journal = 4,

  /**
   * Important "insights" (location)
   */
  Insight = 5,

  /**
   * Support ticket (location).
   */
  SupportTicket = 6,
}

export interface Narrative {
  id: number;
  narrativeType: NarrativeType;
  locationId: number;
  organizationId?: number;
  narrativeDate?: string;
  narrativeDateMs?: number;
  creationDate?: string;
  creationDateMs?: number;
  priority?: NarrativePriority;
  status?: NarrativeStatus;
  icon?: string;
  title?: string;
  description?: string;
  target?: {
    [field: string]: string;
  };

  /**
   * Returned if narrative posted by Bot.
   */
  appInstanceId?: number;

  /**
   * Returned for removal narrative types.
   */
  user?: {
    id: number;
    creationDate: string;
    creationDateMs: number;
    deleteDate: string;
    deleteDateMs: number;
    userName?: string;
    altUsername?: string;
    passwordSet: boolean;
    firstName?: string;
    lastName?: string;
    email?: {
      email?: string;
      verified: boolean;
      status: EmailVerificationStatus;
    };
    phone?: string;
    phoneType?: PhoneType;
    smsStatus?: PhoneVerificationStatus;
    language?: string;
  };

  location?: {
    id: number;
    name: string;
    type: LocationType;
    language: string;
    timezone: string;
    organizationId: number;
    groupId?: number;
    creationDate: string;
    creationDateMs: number;
  }
}
