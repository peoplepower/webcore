import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { UserCommunicationsApi } from '../api/app/userCommunications/userCommunicationsApi';
import { QuestionsApi } from '../api/app/questions/questionsApi';
import { GetQuestionsApiResponse, QuestionStatus } from '../api/app/questions/getQuestionsApiResponse';
import { AnswerQuestionsApiResponse, AnswerQuestionsModel } from '../api/app/questions/answerQuestionsApiResponse';
import { GetSurveyQuestionsApiResponse } from '../api/app/questions/getSurveyQuestionsApiResponse';
import {
  AnswerSurveyQuestionsApiResponse,
  AnswerSurveyQuestionsModel,
  SurveyQuestionStatus
} from '../api/app/questions/answerSurveyQuestionsApiResponse';

@injectable('QuestionsService')
export class QuestionsService extends BaseService {
  @inject('UserCommunicationsApi') protected readonly userCommunicationsApi!: UserCommunicationsApi;
  @inject('QuestionsApi') protected readonly questionsApi!: QuestionsApi;

  constructor() {
    super();
  }

  // #region Location Questions

  /**
   * Retrieve location question(s).
   * For an individual user, there should be at most one unanswered question available per day, unless the question is urgent.
   * For public users, there can be many questions as we are using this on public surveys during a sign-up process.
   * See {@link https://app.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions/operation/Get%20Bot%20Questions}
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

    return this.questionsApi.getQuestions(parameters);
  }

  /**
   * Answer question(s).
   * The body and response is designed to handle answers to multiple questions simultaneously.
   * See {@link https://sboxall.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions/operation/Answer%20Bot%20Questions}
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

    return this.questionsApi.answerQuestions(locationId, model);
  }

  // #endregion

  // #region Survey Questions

  /**
   * Get survey questions without user authorization.
   * Requires a unique survey token.
   *
   * @param {string} token Unique API token for survey (should come in URL params).
   * @returns {Promise<GetSurveyQuestionsApiResponse>}
   */
  getSurveyQuestions(
    token: string
  ): Promise<GetSurveyQuestionsApiResponse>;

  /**
   * Get survey questions for an authenticated user.
   * Requires additional mandatory parameters.
   *
   * @param {string} [token] Temporary API token for survey (should come in URL params).
   * @param params Requested parameters.
   * @param {number} params.locationId Mandatory location ID when a user is authenticated.
   * @param {number} params.answerId Specific answer ID to retrieve when a user is authenticated.
   * @returns {Promise<GetSurveyQuestionsApiResponse>}
   */
  getSurveyQuestions(
    token: undefined,
    params: {
      locationId: number,
      answerId: number,
    },
  ): Promise<GetSurveyQuestionsApiResponse>;

  /**
   * Get survey questions.
   * Can be called by unauthenticated users with a token, or by authenticated users with additional parameters.
   *
   * @param {string} [token] Temporary API token for survey (should come in URL params).
   * @param [params] Requested parameters.
   * @param {number} params.locationId Mandatory location ID when a user is authenticated.
   * @param {number} params.answerId Specific answer ID to retrieve when a user is authenticated.
   * @returns {Promise<GetSurveyQuestionsApiResponse>}
   */
  getSurveyQuestions(
    token?: string,
    params?: {
      locationId: number,
      answerId: number,
    },
  ): Promise<GetSurveyQuestionsApiResponse> {
    return this.questionsApi.getSurveyQuestions(token, params);
  }

  /**
   * Answer survey questions as unauthenticated user.
   * Requires mandatory unique token.
   *
   * @param {AnswerSurveyQuestionsModel} model Answers content.
   * @param {string} token Temporary API token for survey (should come in URL params).
   * @param [params] Requested parameters.
   * @param {SurveyQuestionStatus} [params.status] Change survey response status.
   * @returns {Promise<AnswerSurveyQuestionsApiResponse>}
   */
  answerSurveyQuestions(
    model: AnswerSurveyQuestionsModel,
    token: string,
    params?: {
      status?: SurveyQuestionStatus
    }
  ): Promise<AnswerSurveyQuestionsApiResponse>;

  /**
   * Answer survey questions for an authenticated user.
   * Requires mandatory parameters if the user is authenticated.
   *
   * @param {AnswerSurveyQuestionsModel} model Answers content.
   * @param params Requested parameters.
   * @param {number} params.locationId Mandatory location ID when a user is authenticated.
   * @param {number} params.answerId Specific answer ID to retrieve when a user is authenticated.
   * @param {SurveyQuestionStatus} [params.status] Change survey response status.
   * @returns {Promise<AnswerSurveyQuestionsApiResponse>}
   */
  answerSurveyQuestions(
    model: AnswerSurveyQuestionsModel,
    token: undefined,
    params: {
      locationId: number;
      answerId: number;
      status?: SurveyQuestionStatus
    }
  ): Promise<AnswerSurveyQuestionsApiResponse>;

  /**
   * Answer survey questions which saves them historically for the specific user.
   * A user can submit a portion of answers in one API call. Some of the answers can overwrite previous.
   *
   * @param {string} [token] Temporary API token for survey (should come in URL params)
   * @param {AnswerSurveyQuestionsModel} model Answers content.
   * @param [params] Requested parameters.
   * @param {number} [params.locationId] Location ID when a user is authenticated.
   * @param {number} [params.answerId] Specific answer ID to retrieve when a user is authenticated.
   * @param {SurveyQuestionStatus} [params.status] Change survey response status.
   * @returns {Promise<AnswerSurveyQuestionsApiResponse>}
   */
  answerSurveyQuestions(
    model: AnswerSurveyQuestionsModel,
    token?: string,
    params?: {
      locationId?: number;
      answerId?: number;
      status?: SurveyQuestionStatus
    }
  ): Promise<AnswerSurveyQuestionsApiResponse> {
    if (!model) {
      return this.reject('No answers provided.');
    }

    return this.questionsApi.answerSurveyQuestions(model, token, params);
  }

  // #endregion
}
