import { ApiResponseBase } from '../../../models/apiResponseBase';
import { NewLocationModel } from '../locations/createLocationApiResponse';
import { GenderType } from './getUserInformationApiResponse'

export enum PhoneType {
  Unknown = 0,
  Cell = 1,
  Home = 2,
  Work = 3,
  Office = 4,
}

export enum AccessibilityType {
  None = 0,
  VisualImpairment = 1,
  HearingImpairment = 2,
  MobilityImpairment = 4,
  CommunicationImpairment = 8,
  PhysicalImpairment = 16,
  CognitiveImpairment = 32,
}

export interface CreateUserAndLocationApiResponse extends ApiResponseBase {
  /**
   * Id of the created user
   */
  userId: number;

  /**
   * Id of the created location
   */
  locationId: number;

  /**
   * New API Key for the user to login with
   */
  key: string;
}

export interface CreateUserAndLocationModel {
  /**
   * User Account
   * A user account represents a person who can use the services provided by Ensemble.
   * Ensemble enables developers to capture a wide range of information on a user, as needed to add value to the
   * application. All the user fields below are optional, except when otherwise specified by the API.
   * The user's password is always transmitted inside the HTTP body or header, allowing it to be encrypted.
   */
  user: {
    /**
     * If this is not set, then the email address will become the username.
     */
    username?: string;

    /**
     * Alternative username, could be just random string or phone number.
     * Used as alternative username to login by.
     */
    altUsername?: string;

    /**
     * User's password. If the password is not set, the user account will be created, but the user will not be able to
     * login and will have to go through the password renew process.
     */
    password?: string;

    /**
     * User's first name. Or, what do your friends call you?
     */
    firstName?: string;

    /**
     * User's last name(s).
     */
    lastName?: string;

    /**
     * An email address is required when registering a new user.
     */
    email?: string;

    /**
     * Phone number
     */
    phone?: string;

    /**
     * Phone type is better to set when phone parameter is existed.
     */
    phoneType?: PhoneType;

    /**
     * Unique application name.
     */
    appName: string;

    /**
     * When the user sends messages in a community social network, enabling this flag will cause their name to be
     * hidden when they send messages and on lists of individuals who are part of a group inside an organization, etc.
     * Default is false.
     */
    anonymous?: boolean;

    /**
     * User's preferred language. For example:
     * en - English
     * cn - Chinese
     * fr - French
     * etc
     */
    language?: string;

    /**
     * Bitmask representation of accessibility preferences.
     */
    accessibility?: AccessibilityType;

    /**
     * User's pronoun ID.
     * Use the Pronouns API to obtain a list of pronouns.
     */
    pronounId?: number;

    /**
     * Avatar file ID.
     * Use the Files API to upload an avatar image.
     */
    avatarFileId?: number;

    /**
     * Gender.
     */
    gender?: GenderType;

    /**
     * User birth date.
     * Format as yyyy-MM-dd.
     */
    birthDate?: string;
  };

  /**
   * Location information.
   * A location represents a physical place occupied by this person and where his or her devices can be installed. When
   * creating or updating location information in a user's account, all fields are optional.
   */
  location?: NewLocationModel;

  /**
   * Additional user properties. i.e.: 'admin: true'
   */
  model?: {
    [key: string]: string;
  };
}
