import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetQuestionsApiResponse extends ApiResponseBase {
  questions?: Question[];
}

export interface Question {

  /**
   * Question ID assigned by the system
   */
  id: number;

  /**
   * Question status
   */
  status: QuestionStatus;

  /**
   * The same as status
   * @deprecated used for backward compatibility
   */
  answerStatus: QuestionStatus;

  /**
   * The actual text of the question to ask.
   */
  question: string;

  /**
   * Creation timestamp
   */
  creationDate: string;
  creationDateMs: number;

  /**
   * If the message is editable, then that means it will show up in a place
   * in the bot where the user can reconfigure the question later.
   * This is typically used by bots to enable a UI for settings to configure
   * the bot through questions.
   */
  editable: boolean;

  /**
   * The type of question
   */
  responseType: QuestionResponseType;

  /**
   * Application-layer display type for each type of question
   * (for example, yes/no vs. on/off switch, or a slider that
   * shows integers vs. a slider that shows minutes:seconds)
   */
  displayType: QuestionDisplayType<this['responseType']>;

  /**
   * User's answer.
   *  - Boolean: 0 = No, 1 = Yes
   *  - Multi-choice Single-select: ID of the radio button
   *  - Multi-choice Multi-select: Bitmask representing response options
   *  - Slider value
   *  - Text entered by the user
   *  - Day (or days) of the week are represented by a bitmask:
   *     1 - Sunday (1 << 0)
   *     2 - Monday (1 << 1)
   *     4 - Tuesday (1 << 2)
   *     8 - Wednesday (1 << 3)
   *     16 - Thursday (1 << 4)
   *     32 - Friday (1 << 5)
   *     64 - Saturday (1 << 6)
   */
  answer?: string;

  /**
   * Pre-populated default values for question responses, or force-change the user's response.
   */
  defaultAnswer?: string;

  /**
   * For responseTypes 2 or 4
   */
  responseOptions?: QuestionResponseOption[];

  /**
   * Regular expression to validate answer format in UI.
   */
  answerFormat?: string;

  /**
   * When the user has answered this question.
   */
  answerDate?: string;

  /**
   * When the user has answered this question.
   */
  answerDateMs?: number;

  /**
   * Indicate if the original answer has been modified by other user.
   */
  answerModified?: boolean;

  /**
   * The position of a single question within a group.
   * The higher the weight, the lower down on the list the question appears relative to other questions
   */
  questionWeight?: number;

  /**
   * The bot instance ID, that asks the question.
   */
  appInstanceId?: number;

  /**
   * Icon to show next to the question, if any
   */
  icon?: string;

  /**
   * Unique key to identify this context of this question later, regardless of the description or language of the question itself.
   * Used to link with Services Location State
   */
  key?: string;

  /**
   * A placeholder for this question
   */
  placeholder?: string;

  /**
   * The ID of a group of questions, and the order in which to display this group
   */
  sectionId?: number;

  /**
   * The title of a group of questions
   */
  sectionTitle?: string;

  /**
   * Question Collection
   */
  collection?: QuestionCollection;

  /**
   * The name of collection the question belongs to (can be null).
   * @deprecated Use `collection` instead
   */
  collectionName?: string;

  /**
   * Device ID referenced by this question, if any.
   */
  deviceId?: string;

  /**
   * Settings for Slider (`responseType=7`) response type.
   */
  slider: this['responseType'] extends QuestionResponseType.Slider ? SliderQuestionSettings : undefined;

  /**
   * Reference to some kind of S3 media to play/associate with the question
   */
  media?: string;
}

export enum QuestionStatus {
  /**
   * Replaced by a new question (of the same key)
   */
  Replaced = 0,

  /**
   * Obsolete question
   */
  Obsolete = 1,

  /**
   * Available, waiting for an answer
   */
  Available = 2,

  /**
   * Skipped, the user is going to answer it later
   */
  Skipped = 3,

  /**
   * Answered
   */
  Answered = 4,

  /**
   * No answer, the user is not going to answer on it
   */
  NoAnswer = 5,
}

export interface QuestionCollection {
  /**
   * A unique name for referencing this collection.
   */
  name: string;

  /**
   * Multi-lingual collection name.
   */
  mlName?: {
    [key: string]: string;
  };

  /**
   * The title of the group
   */
  description?: string;

  /**
   * Multi-lingual collection description.
   */
  mlDescription?: {
    [key: string]: string;
  };

  /**
   * Icon to show next to the collection, if any.
   */
  icon?: string;

  /**
   * The weight of the collection, for sorting
   */
  weight?: number;

  /**
   * Media object to display for the collection.
   */
  media?: string;

  /**
   * The content type of the media object.
   */
  mediaContentType?: string;
}

export interface SliderQuestionSettings {
  /**
   * Slider question minimum value
   */
  min: number;

  /**
   * Slider question maximum value
   */
  max: number;

  /**
   *  Slider question incremental slider value
   */
  inc: number;

  /**
   * Description of slider question minimum value
   */
  minDesc?: string;

  /**
   * Description of slider question maximum value
   */
  maxDesc?: string;

  /**
   * Description of slider question units of measurement
   */
  unitsDesc?: string;
}

export interface QuestionResponseOption {
  /**
   * ID number for types of questions that feature a list of options
   */
  id: number;

  /**
   * String for an option on a type of question that features a list of options
   */
  text: string;
}


export enum QuestionResponseType {
  /**
   * Boolean, 0 = False, 1 = True.
   */
  Boolean = 1,

  /**
   * Multiple choice - Single select,
   * The answer is the ID of the response option.
   */
  SingleSelect = 2,

  /**
   * Multiple choice - Multiple select.
   * A list of checkbox options. Requires the "responses" array to list the possible responses.
   * Users can select multiple responses.
   * Available for anonymous aggregated public reporting.
   * The answer is a bitmask of selected choices.
   */
  MultipleSelect = 4,

  /**
   * Day (or days, depending on DisplayType) of the week input.
   * The answer is a bitmask value:
   * SUN=1
   * MON=2
   * TUE=4
   * WED=8
   * THU=16
   * FRI=32
   * SAT=64
   * Numbers can be summed together to specify multiple days of the week.
   */
  DayOfWeek = 6,

  /**
   * Answer is the number selected. For time, the answer is in integer seconds.
   */
  Slider = 7,

  /**
   * Time in seconds since midnight
   */
  TimeSeconds = 8,

  /**
   * Date and Time in ISO 8601.
   * The answer is in ISO 8601 format, `YYYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]`
   */
  DateTime = 9,

  /**
   * Open-ended question.
   * For example, if you were to ask, "Who just walked by the camera?"
   *
   * The answer is a string of text.
   */
  TextBox = 10,
}


// #region Question Response Display Types

export type QuestionDisplayType<QRT extends QuestionResponseType> =
  QRT extends QuestionResponseType.Boolean ? BooleanResponseDisplayType :
    QRT extends QuestionResponseType.SingleSelect ? SingleSelectResponseDisplayType :
      QRT extends QuestionResponseType.MultipleSelect ? MultipleSelectResponseDisplayType :
        QRT extends QuestionResponseType.DayOfWeek ? DayOfWeekResponseDisplayType :
          QRT extends QuestionResponseType.Slider ? SliderResponseDisplayType :
            QRT extends QuestionResponseType.TimeSeconds ? TimeSecondsResponseDisplayType :
              QRT extends QuestionResponseType.DateTime ? DateTimeResponseDisplayType :
                QRT extends QuestionResponseType.TextBox ? TextBoxResponseDisplayType :
                  undefined;


export enum BooleanResponseDisplayType {
  /**
   * On/Off Switch - default.
   */
  OnOff = 0,

  /**
   * Yes/No buttons
   */
  YesNo = 1,

  /**
   * Single 'Yes' button only, the question's default value is applied to the button's text.
   * Used to trigger bot actions from the UI.
   */
  Yes = 2,

  /**
   * Thumbs-up / Thumbs-down icon buttons
   */
  Thumbs = 3,
}

export enum SingleSelectResponseDisplayType {
  /**
   * Radio buttons - default.
   * A list of radio buttons.
   * Requires the "responses" array to list the possible responses.
   * Users can only select one response.
   * Available for anonymous aggregated public reporting.
   */
  RadioButtons = 0,

  /**
   * Drop-down list / Picker.
   * A dropdown list. Same as radio buttons, but can contain more items.
   * UI could implement search feature if there are too much options.
   */
  DropDown = 1,

  /**
   * Slider UI view with predefined stops as an options.
   */
  Slider = 2,

  /**
   * Modal Bottom Action Sheet.
   * Multiple-choice buttons that slide up from the bottom of the modal screen.
   */
  Buttons = 3

}

export type MultipleSelectResponseDisplayType = undefined;

/**
 * Day of week response display type
 * The answer is a bitmask value:
 * SUN=1
 * MON=2
 * TUE=4
 * WED=8
 * THU=16
 * FRI=32
 * SAT=64
 */
export enum DayOfWeekResponseDisplayType {
  /**
   * Select multiple days simultaneously.
   * Numbers above can be summed together to specify multiple days of the week.
   */
  Multiple = 0,

  /**
   * Pick a single day only.
   */
  Single = 1
}

export enum SliderResponseDisplayType {
  /**
   * Integer select - default.
   * Slider, with a defined minimum and maximum.
   * By default, minimum = 0 and maximum = 100.
   */
  Integer = 0,

  /**
   * Floating point select
   */
  Float = 1,

  /**
   * The answer is in integer seconds
   */
  Seconds = 2,
}

/**
 * Time in seconds since midnight
 */
export enum TimeSecondsResponseDisplayType {
  /**
   * Input format: hours:minutes:seconds (am|pm).
   * Default option
   */
  HMS = 0,

  /**
   * Input format: hours:minutes (am|pm).
   */
  HM = 1,
}

/**
 * Datetime selector. The answer is in ISO 8601 format
 */
export enum DateTimeResponseDisplayType {
  /**
   * Select date and time
   */
  DateTime = 0,

  /**
   * Select date only
   */
  Date = 1
}

export enum TextBoxResponseDisplayType {
  /**
   * Text input field
   */
  TextInput = 0,

  /**
   * Phone number with country code and phone number
   */
  PhoneNumber = 1,

  /**
   * Text area (default to 3 rows)
   */
  TextArea = 2,
};

// #endregion
