import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { UserCommunicationsApi } from '../api/app/userCommunications/userCommunicationsApi';
import { GetQuestionsApiResponse, QuestionStatus } from '../api/app/userCommunications/getQuestionsApiResponse';
import { AnswerQuestionsApiResponse, AnswerQuestionsModel } from '../api/app/userCommunications/answerQuestionsApiResponse';
import { GetSurveyQuestionsApiResponse } from '../api/app/userCommunications/getSurveyQuestionsApiResponse';
import {
  AnswerSurveyQuestionsApiResponse,
  AnswerSurveyQuestionsModel,
  SurveyQuestionStatus
} from '../api/app/userCommunications/answerSurveyQuestionsApiResponse';

@injectable('QuestionsService')
export class QuestionsService extends BaseService {
  @inject('UserCommunicationsApi') protected readonly userCommunicationsApi!: UserCommunicationsApi;

  /**
   * Retrieve requested questions.
   *
   * For an individual user, there should be at most one unanswered question available per day, unless the question is urgent.
   * For public users, there can be many questions as we are using this on public surveys during a sign-up process.
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/user-communications/questions/get-questions}
   *
   * @param {number} locationId Location ID to get questions.
   * @param [params] Requested parameters.
   * @param {QuestionStatus | QuestionStatus[]} [params.answerStatus] Return questions with requested answer statuses.
   *  By default, questions with statuses 2 and 3 are returned.
   *  Multiple values are supported.
   * @param {boolean} [params.editable] Filter answered questions:
   *   - true - return only editable answered questions,
   *   - false - return only not editable answered questions,
   *  otherwise return all answered questions.
   * @param {string} [params.collectionName] Questions collection name filter.
   * @param {number} [params.questionId] Extract a specific question ID.
   * @param {number} [params.appInstanceId] Only retrieve questions for a specific bot.
   * @param {string} [params.lang] Questions text language. If not set, user's or default language will be used.
   * @param {number} [params.limit] Maximum number of questions to return. The default is unlimited.
   * @returns {Promise<GetQuestionsApiResponse>}
   */
  getLocationQuestions(
    locationId: number,
    params?: {
      answerStatus?: QuestionStatus | QuestionStatus[];
      editable?: boolean;
      collectionName?: string;
      questionId?: number;
      appInstanceId?: number;
      lang?: string;
      limit?: number;
      sortCollection?: string;
      sortBy?: string;
      sortOrder?: string;
      firstRow?: number;
      rowCount?: number;
    }): Promise<GetQuestionsApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    let parameters = {
      locationId,
      sortCollection: 'questions',
      ...params,
    }

    return this.userCommunicationsApi.getQuestions(parameters);
  }

  /**
   * Answer question(s).
   *
   * @param {number} locationId Location ID to answer question(s).
   * @param {AnswerQuestionsModel} model Body with answers.
   * @returns {Promise<AnswerQuestionsApiResponse>}
   */
  answerQuestions(locationId: number, model: AnswerQuestionsModel): Promise<AnswerQuestionsApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (!model) {
      return this.reject('No answers provided.');
    }

    return this.userCommunicationsApi.answerQuestions(locationId, model);
  }

  /**
   * Get survey questions.
   *
   * @param {string} token temporary API token for survey (should come in URL params)
   * @returns {Promise<GetSurveyQuestionsApiResponse>}
   */
  getSurveyQuestions(
    token: string
  ): Promise<GetSurveyQuestionsApiResponse> {
    return this.userCommunicationsApi.getSurveyQuestions(token);
  }

  /**
   * Answer survey questions which saves them historically for the specific user.
   * A user can submit a portion of answers in one API call. Some of the answers can overwrite previous.
   *
   * @param {string} token temporary API token for survey (should come in URL params)
   * @param {AnswerSurveyQuestionsModel} model Answers content.
   * @param [params] Requested parameters.
   * @param {SurveyQuestionStatus} [params.status] Change survey response status.
   * @returns {Promise<AnswerSurveyQuestionsApiResponse>}
   */
  answerSurveyQuestions(
    token: string,
    model: AnswerSurveyQuestionsModel,
    params?: {
      status?: SurveyQuestionStatus
    }
  ): Promise<AnswerSurveyQuestionsApiResponse> {
    if (!model) {
      return this.reject('No answers provided.');
    }

    return this.userCommunicationsApi.answerSurveyQuestions(token, model, params);
  }
}
