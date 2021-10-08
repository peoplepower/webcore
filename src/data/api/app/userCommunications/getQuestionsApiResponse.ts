import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum QuestionStatus {
  Replaced = 0,
  Obsolete = 1,
  Available = 2,
  Skipped = 3,
  Answered = 4,
  NoAnswer = 5,
}

export enum QuestionResponseTypes {
  Boolean = 1,
  SingleSelect = 2,
  MultipleSelect = 3,
  DayOfWeek = 4,
  Slider = 7,
  TimeSeconds = 8,
  DateTime = 9,
  TextBox = 10,
}

export interface QuestionCollection {
  name: string;
  description?: string;
  icon?: string;
  weight?: number;
  media?: string;
  mediaContentType?: string;
}

export interface QuestionSlider {
  min: number;
  max: number;
  inc: number;
  minDesc?: string;
  maxDesc?: string;
  unitsDesc?: string;
}

export interface GetQuestionsApiResponse extends ApiResponseBase {
  questions: Array<{
    /**
     * Question ID assigned by the system
     */
    id: number;
    /**
     * Question status
     */
    status: QuestionStatus;
    /**
     * The actual text of the question to ask.
     */
    question: string;
    creationDate: string;
    creationDateMs: number;
    /**
     * Answer can be edited
     */
    editable: boolean;
    /**
     * Application-layer display type for each type of question
     */
    displayType: number;
    responseType: QuestionResponseTypes;
    /**
     * User's answer
     */
    answer?: string;
    /**
     * Pre-populated default values for question responses
     */
    defaultAnswer?: string;
    /**
     * For responseTypes 2 or 4
     */
    responseOptions?: Array<{
      id: number;
      text: string;
    }>;
    /**
     * Regular expression to validate answer format in UI
     */
    answerFormat?: string;
    answerDate?: string;
    answerDateMs?: number;
    /**
     * Indicate if the original answer has been modified
     */
    answerModified?: boolean;
    /**
     * The position of a single question within a group
     */
    questionWeight?: number;
    /**
     * Bot instance ID, that asks the question
     */
    appInstanceId?: number;
    /**
     * Icon to show next to the question, if any
     */
    icon?: string;
    /**
     * Unique key to identify this context of this question later
     */
    key?: string;
    /**
     * A placeholder for this question
     */
    placeholder?: string;
    /**
     * The ID of a group of questions, and the order
     */
    sectionId?: number;
    /**
     * The title of a group of questions
     */
    sectionTitle?: string;
    collection?: QuestionCollection;
    /**
     * Device ID referenced by this question, if any
     */
    deviceId?: string;
    /**
     * For responseType 7 only
     */
    slider?: QuestionSlider;
    /**
     * Reference to some kind of S3 media to play/associate with the question
     */
    media?: string;
  }>;
}
