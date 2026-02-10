import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface StartSurveyAnsweringModel {
  /**
   * Optionally pre-answer provided question(s).
   */
  questions?: Array<{
    /**
     * Question key
     */
    questionKey: string;

    /**
     * Question answer
     */
    answer: string;
  }>;

  /**
   * Optional parameters for notifications.
   */
  notificationModel?: {
    [key: string]: string;
  }
}

export interface StartSurveyAnsweringApiResponse extends ApiResponseBase {
  /**
   * URL generated for the survey answering session.
   * It can be used without authentication to submit survey answers.
   */
  surveyUrl: string;
}
