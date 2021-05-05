import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface RequestSupportApiResponse extends ApiResponseBase {

}

export interface RequestSupportModel {
  /**
   * First name (what do your friends call you?)
   */
  firstName: string;
  /**
   * Last name
   */
  lastName: string;
  /**
   * Reply email address
   */
  email: string;
  /**
   * Subject line, short description of the issue
   */
  subject: string;
  /**
   * The actual comments from the user
   */
  text: string;
  /**
   * Text describing whether or not the user wants to subscribe to newsletters, etc. It's a manual process on the
   * backend.
   */
  subscribe: string;
}
