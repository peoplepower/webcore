import { ApiResponseBase } from '../../../models/apiResponseBase';
import { SurveyAnswerStatus, SurveyStatus } from './getSurveyQuestionsApiResponse';

export interface GetSurveyAnswersApiResponse extends ApiResponseBase {
  answers?: Array<{
    /**
     * Unique answer record ID
     */
    answerId: number;

    /**
     * Survey answer status
     */
    status: SurveyAnswerStatus;

    /**
     * ID of the user who submitted the answers
     */
    userId: number;

    /**
     * Location ID where the survey was answered
     */
    locationId: number;

    /**
     * Answering start date
     */
    startDate: string;
    startDateMs: number;

    /**
     * Last notification send date
     */
    notificationDate?: string;
    notificationDateMs?: number;

    /**
     * Answering end date
     */
    endDate?: string;
    endDateMs?: number;

    survey: Array<{

      /**
       * Unique survey key
       */
      surveyKey: string;

      /**
       * Organization ID (origin of the survey)
       */
      organizationId: number;

      /**
       * Survey status
       */
      status: SurveyStatus;

      /**
       * Survey title
       */
      title: string;

      /**
       * Survey description
       */
      description?: string;
    }>;
  }>;
}
