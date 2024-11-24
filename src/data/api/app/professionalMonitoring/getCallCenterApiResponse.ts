import { ApiResponseBase } from '../../../models/apiResponseBase';
import { PhoneType } from '../userAccounts/createUserAndLocationApiResponse';

/**
 * Call center registration can have these statuses
 */
export enum CallCenterStatus {
  /**
   * The service never purchased
   */
  Unavailable = 0,
  /**
   * The service purchased, but the user does not have enough information for registration
   */
  Available = 1,
  /**
   * The registration process has not been completed yet
   */
  RegistrationPending = 2,
  /**
   * Registration completed
   */
  Registered = 3,
  /**
   * The cancellation has not been completed yet
   */
  CancellationPending = 4,
  /**
   * Cancellation completed
   */
  Cancelled = 5,
}

/**
 * The alert status with the alert date is returned in a case of an emergency situation can have following values.
 */
export enum CallCenterAlertStatus {
  /**
   * An alert never raised
   */
  NeverRaised = 0,
  /**
   * An alert raised, but the call center not contacted yet
   */
  Raised = 1,
  /**
   * The alert reported to the call center
   */
  Reported = 3,
}

export enum CallCenterTestStatus {
  /**
   * Test pending
   */
  TestPending = 1,
  /**
   * Active or scheduled test
   */
  Active = 2,
  /**
   * Cancel test pending
   */
  Cancel = 3,
  /**
   * Test is off
   */
  Off = 4,
}

export interface GetCallCenterApiResponse extends ApiResponseBase {
  callCenter: {
    status: CallCenterStatus;
    code: string;
    userId: number;
    missingFields: Array<string>;
    contacts: Array<{
      userId: number;
      firstName: string;
      lastName: string;
      phone: string;
      phoneType: PhoneType;
      ecv: boolean;
    }>;
    codeword: string;
    notDispatch?: boolean;
    permit: string;
    alertStatus: CallCenterAlertStatus;
    alertDate: string;
    alertDateMs: number;
    alertStatusDate: string;
    alertStatusDateMs: number;

    /**
     * Call Center tests listing
     */
    tests?: Array<{
      testId: number;
      status: CallCenterTestStatus;
      startDate: string;
      startDateMs: number;
      endDate: string;
      endDateMs: number;
      comment: string;
      userId: number;
      externalTestId: number;
    }>;
  };
}
