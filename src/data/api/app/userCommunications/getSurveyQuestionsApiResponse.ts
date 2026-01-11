import { ApiResponseBase } from '../../../models/apiResponseBase';
import { QuestionDisplayType, QuestionResponseOption, QuestionResponseType, SliderQuestionSettings } from './getQuestionsApiResponse';

export enum SurveyStatus {
  Inactive = 0,
  Active = 1,
}

export interface SurveyQuestion {
  /**
   * Question key uniqie within the survey
   */
  questionKey: string;

  /**
   * Section ID
   */
  sectionId?: number;

  /**
   * Ordering number within the the section
   */
  orderNum: number;

  /**
   * Question text
   */
  question: string;

  /**
   * The type of question answer expected
   */
  responseType: QuestionResponseType;

  /**
   * Application-layer display type for each type of question
   * (for example, yes/no vs. on/off switch, or a slider that
   * shows integers vs. a slider that shows minutes:seconds)
   */
  displayType: QuestionDisplayType<this['responseType']>;

  /**
   * Regular expression to validate answer format in UI
   */
  answerFormat?: string;

  /**
   * Settings for Slider (`responseType=7`) response type
   */
  slider: this['responseType'] extends QuestionResponseType.Slider ? SliderQuestionSettings : undefined;

  /**
   * For responseTypes 2 or 4
   */
  responseOptions?: QuestionResponseOption[];

  /**
   * Previous answer value
   */
  answer?: string;

  /**
   * Previous answer date
   */
  answerDate?: string;
  answerDateMs?: number;
}

export interface GetSurveyQuestionsApiResponse extends ApiResponseBase {
  survey: {
    /**
     * Unique survey key
     */
    surveyKey: string;

    /**
     * ID of organization, which is the owner of the survey
     */
    organizationId: number;

    /**
     * Survey status
     */
    status: SurveyStatus;

    /**
     * Title of the survey
     */
    title: string;

    /**
     * Description of the survey
     */
    description?: string;

    /**
     * Instructions for the survey
     */
    instructions?: string;

    /**
     * Pagination flag to display survey in UI by pages
     */
    pagination: boolean;

    /**
     * Answering process start date
     */
    startDate: string;
    startDateMs: number;

    /**
     * The last notification send date
     */
    notificationDate?: string;
    notificationDateMs?: number;

    /**
     * List of survey sections
     */
    sections?: Array<{
      sectionId: number;

      /**
       * Ordering number within the survey or the parent section
       */
      orderNum: number;

      parentSectionId?: number;
      title?: string;
    }>;

    /**
     * Survey questions
     */
    questions?: SurveyQuestion[];
  };
}
