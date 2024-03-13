import { Question } from "../../userCommunications/getQuestionsApiResponse";

export interface ServicesLocationState {
  cards?: ServicesLocationStateCard[];
}

export interface ServicesLocationStateCard {

  /**
   * Content of this card.  Contains all the information about all our services.
   */
  content?: Service[];

  /**
   * Type of card.
   * @deprecated Backwards compatibility requirement to support previous dashboard location state content.
   */
  type?: number;

  /**
   * Title of this card.
   * @deprecated Backwards compatibility requirement to support previous dashboard location state content.
   */
  title?: string;

  /**
   * Sorting weight of this card.
   * @deprecated Backwards compatibility requirement to support previous dashboard location state content.
   */
  weight?: number;

}

export interface Service {

  /**
   * Service ID
   */
  id: string;

  /**
   * Title of the service
   */
  title: string;

  /**
   * Comment to display under the title
   */
  comment?: string;

  /**
   * Description of the service. May contains Markdown markup.
   */
  description?: string;

  /**
   * Service icon
   */
  icon?: string;

  /**
   * Icon font name (e.g. "fas", "far", "iotr", etc.).
   * Default far if not provided
   */
  icon_font?: string;

  /**
   * Status of the service. Default is `ServiceStatus.Hidden` if not provided
   */
  status?: ServiceStatus;

  /**
   * Overall efficiency of the machine learning algorithms. The higher the percent, the more accurate the predictions.
   * Number, from 0 to 100.
   */
  percent?: number,

  /**
   * Active state of this service.
   * true - This service is enabled.
   * false - This service is disabled.
   */
  active?: boolean,

  /**
   * Status text representing the current state of the service (e.g. "ENABLED", "RUNNING", "DISABLED").
   */
  status_text?: string;

  /**
   * Sorting weight of this service.
   */
  weight?: number;

  /**
   * Question ID. Map by `question.key` field of the question.
   */
  question_id?: NonNullable<Question['key']>;

  /**
   * ID of the question collection. Map by `question.collection.name` field of question.
   * If available, link to the Collection of questions this is part of.
   */
  collection_id?: NonNullable<NonNullable<Question['collection']>['name']>;

  /**
   * ID of the question section. Map by "question.sectionId".
   * If available, link to the Collection of questions this is part of and show questions in this section.
   * Requires "collection_id".
   */
  section_id?: NonNullable<Question['sectionId']>;

  /**
   * Last updated timestamp of this service (in Unix epoch ms)
   */
  updated: number;
}

/**
 * Services Location State service status
 */
export enum ServiceStatus {

  /**
   * Hidden service is not displayed in the app.
   */
  Hidden = -1,
  NoIssues = 0,
  Warning = 1,
  Critical = 2
}
