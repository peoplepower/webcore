import { EscalationSourceType, EscalationStatus } from "./getEscalationsApiResponse";

export interface UpdateEscalationModel {
  escalation: {

    /**
     * Escalation status.
     */
    status: EscalationStatus;

    /**
     * When escalation has been confirmed.
     * Will be set to the current time by default.
     */
    confirmationDate?: string;

    /**
     * User confirmed the escalation.
     * Used by admins to confirm escalation manually on behalf of staff member.
     */
    confirmUserId?: number;

    /**
     * When escalation has been resolved.
     * Will be set to the current time by default.
     */
    resolutionDate?: string;

    /**
     * Optional user, who resolved escalation.
     * Used by admins to resolve escalation manually on behalf of staff member.
     */
    resolveUserId?: number;

    /**
     * Optional resolve source type.
     * Default is user type who resolver escalation.
     */
    resolveSourceType?: EscalationSourceType;
  }
}
