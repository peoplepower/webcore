import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { UserCommunicationsApi } from '../api/app/userCommunications/userCommunicationsApi';
import { GetQuestionsApiResponse, QuestionStatus } from '../api/app/userCommunications/getQuestionsApiResponse';
import { AnswerQuestionsApiResponse, AnswerQuestionsModel } from '../api/app/userCommunications/answerQuestionsApiResponse';

@injectable('QuestionsService')
export class QuestionsService extends BaseService {
  @inject('UserCommunicationsApi') protected readonly userCommunicationsApi: UserCommunicationsApi;

  /**
   * Retrieve questions for specific location.
   * @param {number} locationId Location ID to get questions for.
   * @param [params] Additional request parameters.
   * @returns {Promise<GetQuestionsApiResponse>}
   */
  getLocationQuestions(locationId: number, params?: any): Promise<GetQuestionsApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    let parameters: {
      locationId: number,
      answerStatus?: QuestionStatus | QuestionStatus[],
      editable?: boolean,
      collectionName?: string,
      questionId?: number,
      appInstanceId?: number,
      lang?: string,
      limit?: number,
      sortCollection?: string,
      sortBy?: string,
      sortOrder?: string,
      firstRow?: number,
      rowCount?: number
    } = params || {};

    parameters.locationId = locationId;
    if (params && !parameters.sortCollection) {
      parameters.sortCollection = 'questions';
    }

    return this.userCommunicationsApi.getQuestions(params);
  }

  /**
   * Answer question(s).
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

}
