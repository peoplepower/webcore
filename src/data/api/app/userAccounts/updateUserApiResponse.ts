import { ApiResponseBase } from '../../../models/apiResponseBase';
import { AccessibilityType, PhoneType } from './createUserAndLocationApiResponse';
import { GenderType } from './getUserInformationApiResponse'

export interface UpdateUserApiResponse extends ApiResponseBase {
}

export interface UserModel {
  /**
   *  If this is not set, then the email address will become the username.
   *  @type {string}
   */
  username?: string;

  /**
   *  Alternative (second) username.
   *  @type {string}
   */
  altUsername?: string;

  /**
   *  User's first name. Or, what do your friends call you?
   *  @type {string}
   */
  firstName?: string;

  /**
   *  User's last name(s).
   *  @type {string}
   */
  lastName?: string;

  /**
   *  User's community pseudo name.
   *  @type {string}
   */
  communityName?: string;

  /**
   *  An email address is required when registering a new user.
   *  @type {string}
   */
  email?: string;

  /**
   *  Update the user with emailResetStatus = true to reset
   *  the email address status to OK. This will allow
   *  the IoT Software Suite to continue attempting
   *  to deliver emails to the user's address.
   *  If the email delivery has a problem again,
   *  the cloud will update the email status back to an error state.
   *  @type {boolean}
   */
  emailResetStatus?: boolean;

  /**
   *  Reset user's phone number SMS status to unknown
   *  @type {boolean}
   */
  smsResetStatus?: boolean;

  /**
   *  Phone number
   *  @type {string}
   */
  phone?: string;

  /**
   * 0 - Unknown
   * 1 - Cell
   * 2 - Home
   * 3 - Work
   * 4 - Office
   *  @type {PhoneType}
   */
  phoneType?: PhoneType;

  /**
   *When the user sends messages in a community social network,
   * enabling this flag will cause their name to be hidden
   * when they send messages and on lists of individuals
   * who are part of a group inside an organization, etc.
   * Default is false.
   *  @type {boolean}
   */
  anonymous?: boolean;

  /**
   * User's preferred language. For example:
   *  - en - English
   *  - cn - Chinese
   * @type {string}
   */
  language?: string;

  /**
   * User's pronoun ID. See get pronouns API.
   * @type {number}
   */
  pronounId?: number;

  /**
   * A bitmask of the accessibility preferences.
   * @type {AccessibilityType}
   */
  accessibility?: AccessibilityType;

  /**
   * Year of birth.
   */
  birthYear?: number;

  /**
   * Gender.
   */
  gender?: GenderType;
}

export interface UpdateUserModel {
  user: UserModel;
}
