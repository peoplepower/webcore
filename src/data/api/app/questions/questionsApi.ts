import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetSurveyQuestionsApiResponse, SurveyStatus } from './getSurveyQuestionsApiResponse';
import { GetQuestionsApiResponse, QuestionStatus } from './getQuestionsApiResponse';
import { AnswerQuestionsApiResponse, AnswerQuestionsModel } from './answerQuestionsApiResponse';
import { AnswerSurveyQuestionsApiResponse, AnswerSurveyQuestionsModel, SurveyQuestionStatus } from './answerSurveyQuestionsApiResponse';
import { StartSurveyAnsweringApiResponse, StartSurveyAnsweringModel } from './startSurveyAnsweringApiResponse';
import { GetSurveyAnswersApiResponse } from './getSurveyAnswersApiResponse';

/**
 * This set of APIs allows end-users to answer bot or survey questions.
 * See {@link https://app.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions}
 */
@injectable('QuestionsApi')
export class QuestionsApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  // #region -------------------- Location Questions ------------------

  /**
   * Retrieve location question(s).
   * Questions enable bidirectional conversations to take place between the users' location and data analytics services. Questions enable the user to add context to the data.
   * For an individual user, there should be at most one unanswered question available per day, unless the question is urgent.
   * See {@link https://app.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions/operation/Get%20Bot%20Questions}
   *
   * @param params Requested parameters.
   * @param {number} params.locationId Location ID to get questions.
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
  getQuestions(params: {
    locationId: number;
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
    return this.dal.get('questions', {params: params});
  }

  /**
   * Answer question(s).
   * The body and response is designed to handle answers to multiple questions simultaneously.
   * See {@link https://sboxall.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions/operation/Answer%20Bot%20Questions}
   *
   * @param {number} locationId Location ID to answer question(s).
   * @param {AnswerQuestionsModel} model Answers content.
   * @returns {Promise<AnswerQuestionsApiResponse>}
   */
  answerQuestions(locationId: number, model: AnswerQuestionsModel): Promise<AnswerQuestionsApiResponse> {
    const parameters = {
      params: {
        locationId: locationId,
      },
      headers: {'Content-Type': 'application/json'},
    };
    return this.dal.put('questions', model, parameters);
  }

  // #endregion

  // #region -------------------- Survey Questions --------------------

  /**
   * Get survey answers.
   * Returns available survey information, and history of previous answers submitted for the user.
   * See {@link https://app.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions/operation/Get%20Survey%20Answers}
   *
   * @param {object} params Request parameters.
   * @param {number} params.locationId Location ID to get survey answers.
   * @param {number} [params.userId] User ID to get survey answers for. If not set, current user is used.
   * @param {string} [params.surveyKey] Unique survey key to filter answers.
   * @param {string} [params.startDate] Start date to filter answers (ISO 8601 format).
   * @param {string} [params.endDate] End date to filter answers (ISO 8601 format).
   * @param {SurveyStatus} [params.status] Survey answer status to filter answers.
   * @returns {Promise<GetSurveyAnswersApiResponse>}
   */
  getSurveyAnswers(params: {
    locationId: number;
    userId?: number;
    surveyKey?: string;
    startDate?: string;
    endDate?: string;
    status?: SurveyStatus;
  }): Promise<GetSurveyAnswersApiResponse> {
    return this.dal.get('surveyAnswers', { params: params });
  }

  /**
   * Initialize new survey answering session (instance of survey).
   * Creates a new survey answer record for the requested user.
   * A user or a bot can submit answers to some survey questions in this request. Or question answers can be copied from a previously submitted survey by ID.
   * See {@link https://app.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions/operation/Start%20Answering%20Survey}
   *
   * @param {StartSurveyAnsweringModel} [model] Optionally pre-answer provided question(s).
   * @param {object} params Request parameters.
   * @param {number} params.locationId Location ID where the survey is being answered.
   * @param {string} params.surveyKey Unique survey key.
   * @param {number} params.userId User ID who should answer the survey.
   * @param {number} [params.preAnswerId] Copy question answers from this answer record.
   * @param {boolean} [params.sendToUser] If true, a notification will be sent to the user with a link to the survey.
   * @param {number} [params.notificationCategory] Send the email to organization notification user with this category.
   * @returns {Promise<StartSurveyAnsweringApiResponse>}
   */
  startSurveyAnswering(
    model: StartSurveyAnsweringModel | undefined,
    params: {
      locationId: number,
      surveyKey: string,
      userId: number,
      preAnswerId?: number,
      sendToUser?: boolean,
      notificationCategory?: number,
    },
  ): Promise<StartSurveyAnsweringApiResponse> {
    return this.dal.post('surveyAnswers', model, { params: params });
  }

  /**
   * Return open organization survey details, sections, questions, and previously submitted answers.
   * Used by unauthenticated users with a token, or by authenticated users with additional parameters.
   *
   * @param {string} [token] Unique API token for survey.
   * @param {object} [params] Request parameters.
   * @param {number} params.locationId Location ID when a user is authenticated.
   * @param {number} params.answerId Specific answer ID to retrieve when a user is authenticated.
   *
   * @returns {Promise<GetSurveyQuestionsApiResponse>}
   */
  getSurveyQuestions(
    token?: string,
    params?: {
      locationId: number,
      answerId: number,
    },
  ): Promise<GetSurveyQuestionsApiResponse> {
    let headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.dal.get(
      'surveyQuestions',
      {
        headers: headers,
        params: params,
        noAuth: !!token,
      }
    );
  }

  /**
   * Answer survey questions which saves them historically for the specific user.
   * A user can submit a portion of answers in one API call. Some of answers can overwrite previous.
   *
   * @param {string} [token] Unique API token for survey.
   * @param {AnswerSurveyQuestionsModel} [model] Answers content.
   * @param {object} [params] Request parameters.
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
    let headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.dal.put(
      'surveyQuestions',
      model,
      {
        params: params,
        headers: headers,
        noAuth: !!token,
      }
    );
  }

  // #endregion
}
