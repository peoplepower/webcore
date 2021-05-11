import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum PhoneType {
  Unknown = 0,
  Cell = 1,
  Home = 2,
  Work = 3,
  Office = 4,
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

  /**
   * Expiration time of the API key
   */
  keyExpire: string;
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
     * ru - Russian
     * etc
     */
    language?: string;
  };

  /**
   * Location information.
   * A location represents a physical place occupied by this person and where his or her devices can be installed. When
   * creating or updating location information in a user's account, all fields are optional.
   */
  location?: {
    /**
     * Name of the location (i.e. "My House" or "Upstairs Bedroom")
     */
    name?: string;

    /**
     * Location type
     * 10 - Residence
     * 20 - General business / Other
     * 21 - Municipal / Government
     * 22 - Hotel / Lodging
     * 23 - Restaurant
     * 24 - Retail
     * 25 - Office
     */
    type?: number;

    /**
     * Unique domain name to register location in organization.
     */
    appName?: string;

    /**
     * Organization ID to register location.
     */
    organizationId?: number;

    /**
     * Utility account number, when this user account is linked to acquire data from a utility.
     */
    utilityAccountNo?: string;

    /**
     * User's timezone ID. For example, "US/Pacific" or "GMT+0800". See the Date and Time Formats for more details.
     */
    timezone?: {
      id: string;
    };

    /**
     * Address - Street 1
     */
    addrStreet1?: string;

    /**
     * Address - Street 2
     */
    addrStreet2?: string;

    /**
     * Address - City
     */
    addrCity?: string;

    /**
     * State identifier. Use the Countries, states, and time zones API to obtain numeric identifiers for each state supported on Ensemble.
     */
    state?: {
      id: number;
    };

    /**
     * Country identifier. Use the Countries, states, and time zones API to obtain numeric identifiers for each state supported on Ensemble.
     */
    country?: {
      id: number;
    };

    /**
     * Zip / Postal Code
     */
    zip?: string;

    /**
     * The latitude in degrees. Positive values indicate latitudes north of the equator. Negative values indicate latitudes south of the equator.
     */
    latitude?: string;

    /**
     * The longitude in degrees. Measurements are relative to the zero meridian, with positive values extending east of the meridian and negative values
     * extending west of the meridian.
     */
    longitude?: string;

    /**
     * Sales tax rate. The value must be positive and less than 1.
     */
    salesTaxRate?: number;

    /**
     * This represents the approximate size of the location. Size units: ft2 - Square Foot; m2 - Square Meter; For example: { unit: "ft2", content: 14000 }
     */
    size?: {
      unit: string;
      content: number;
    };

    /**
     * Number of stories in the home / building
     */
    storiesNumber?: number;

    /**
     * Number of rooms.
     */
    roomsNumber?: number;

    /**
     * Number of bathrooms.
     */
    bathroomsNumber?: number;

    /**
     * Total number of people living / working at this location.
     */
    occupantsNumber?: number;

    /**
     * Array of JSON objects describing age ranges in years, and the number of occupants in those age ranges.
     */
    occupantsRange?: Array<{
      start: number;
      end: number;
      number: number;
    }>;

    /**
     * Keeps a note about when the location is used by people.
     * 1 - Day
     * 2 - Night
     * 3 - Both
     */
    usagePeriod?: number;

    /**
     * This is a bitmap that describes the type of heating that is used at this location.
     * 1 - Electric
     * 2 - Natural Gas
     * 4 - Propane
     * 8 - Oil
     * 16 - Biomass
     * 128 - Other
     */
    heatingType?: number;

    /**
     * This is a bitmap that describes the type of cooling that is used at this location.
     * 1 - Central A/C
     * 2 - Window A/C
     * 4 - Open windows / fans
     * 128 - Other
     */
    coolingType?: number;

    /**
     * This is a bitmap that describes the type of water heating that is used at this location.
     * 1 - Electric
     * 2 - Natural Gas
     * 4 - Propane
     * 8 - Oil
     * 16 - Biomass
     * 32 - Solar
     * 128 - Other
     */
    waterHeaterType?: number;

    /**
     * This is a bitmap that describes the type of thermostat that is used at this location.
     * 1 - Non-programmable
     * 2 - Programmable
     * 3 - Internet Connected
     */
    thermostatType?: number;
  };

  /**
   * Additional user properties. i.e.: 'admin: true'
   */
  model?: {
    [key: string]: string;
  };
}
