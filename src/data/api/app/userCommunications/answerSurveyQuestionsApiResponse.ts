import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum SurveyQuestionStatus {
  /**
   * Close survey for answering
   */
  Closed = 1,
}

export interface AnswerSurveyQuestionsModel {
  questions: Array<{
    /**
     * Question key
     */
    questionKey: string;

    /**
     * Question answer
     */
    answer?: string;
  }>;
}

export interface AnswerSurveyQuestionsApiResponse extends ApiResponseBase {
}
