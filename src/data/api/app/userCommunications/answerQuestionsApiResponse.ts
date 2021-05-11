import { ApiResponseBase } from '../../../models/apiResponseBase';
import { QuestionStatus } from './getQuestionsApiResponse';

export interface AnswerQuestionsModel {
  questions: Array<{
    id: number;
    answer?: string | boolean | number;
    answerStatus?: QuestionStatus;
  }>;
}

export interface AnswerQuestionsApiResponse extends ApiResponseBase {
  questions: Array<{
    /**
     * Question ID to answer
     */
    id: number;
    /**
     * User's answer
     */
    answer?: string;
    /**
     * Indicate if the original answer has been modified
     */
    answerModified?: boolean;
    /**
     * Optionally change question status
     */
    answerStatus?: QuestionStatus;
    answerDate?: string;
    answerDateMs?: number;
  }>;
}
