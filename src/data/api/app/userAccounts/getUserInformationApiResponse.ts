import { ApiResponseBase } from '../../../models/apiResponseBase';
import { PhoneType } from './createUserAndLocationApiResponse';
import { ResourceType } from '../paidServices/getSoftwareSubscriptionsApiResponse';
import { LocationAccessLevel, LocationNotificationsCategory } from '../locations/getLocationUsersApiResponse';
import { LocationType } from '../locations/editLocationApiResponse';

export enum PhoneVerificationStatus {
  Unknown = 0,
  Verified = 1,
  NotVerified = 2,
  Invalid = 3,
}

export enum EmailVerificationStatus {
  Okay = 0,
  HardBounce = 1,
  SpamComplaint = 2,
  BadAddress = 3,
  SpamNotification = 4,
}

export enum UserPermission {
  AccessAll = 0, // Access any data
  GrantRoles = 1, // Grant roles
  ReportsAccess = 2, // Access to any data in reports
  OrganizationAdmin = 3, // Access to users, locations, devices in specific organization (administrator)
  SuperAdmin = 4, // Create/update/delete organizations, groups, administrators
  PaidServices = 5, // Paid services administrator
  BotStoreAdmin = 6, // Bot store administrator
  SystemAdmin = 7, // System administrator
  CustomerServicesAdmin = 8, // Manage customer services
}

export enum LocationPriorityCategory {
  Empty = 0, // Empty location - typically ignore this location
  Okay = 1, // Home is running just fine
  Learning = 2, // Home is learning
  Incomplete = 3, // Incomplete installation (devices, people, etc.)
  Problem = 4, // Problems with the system (offline devices, low battery, abnormal device behaviors)
  Warning = 5, // Subjective warning (abnormal trends, sleeping too much, bathroom usage)
  Critical = 6, // Critical alert (falls, didn't wake up, water leak)
}

/**
 * By default, system automatically delete old files once location file storage is full.
 * N > 1 - automatically delete files created earlier than N days ago.
 */
export enum FileUploadPolicy {
  KeepOldFiles = 0,
  DeleteOldFiles = 1,
}

export interface LocationInfo {
  id: number;

  /**
   * Name of the location (i.e. "My House" or "Upstairs Bedroom")
   */
  name?: string;

  /**
   * Organization ID to which location belongs to.
   */
  organizationId?: number;
  organization?: {
    id: number;
    name: string;
    domainName: string;
    features: string;
    groupId?: number;
    groupName?: string;
  };

  /**
   * App name used to create this location.
   */
  appName?: string;

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
   * User's timezone ID. For example, "US/Pacific" or "GMT+0800". See the Date and Time Formats for more details.
   */
  timezone: {
    id: string;
    offset: number;
    dst: boolean;
    name: string;
  };

  /**
   * Location type
   * 10 - Residence
   * 20 - General business / Other
   * 21 - Municipal / Government
   * 22 - Hotel / Lodging
   * 23 - Restaurant
   * 24 - Retail
   * 25 - Office
   * @type {number}
   */
  type: LocationType;

  creationDate?: string;
  creationDateMs?: number;

  /**
   * State identifier. Use the Countries, states, and time zones API to obtain numeric identifiers for each state supported.
   */
  state: {
    id: number;
    name: string;
  };

  /**
   * Country identifier. Use the Countries, states, and time zones API to obtain numeric identifiers for each state supported.
   */
  country: {
    id: number;
    name: string;
    countryCode: string;
    currencyCode: string;
    currencySymbol: string;
    zipFormat: string;
    stateName: string;
    zipName: string;
  };

  /**
   * Zip / Postal Code
   */
  zip: string;

  /**
   * Phone number, where a user can send and receive SMS.
   */
  smsPhone?: string;

  /**
   * User's location access permissions:
   * 0 - none;
   * 10 - read location/device data;
   * 20 - control devices and location events;
   * 30 - update location information and manage devices.
   */
  locationAccess: LocationAccessLevel;

  /**
   * User's category in this location:
   * 0 - none;
   * 1 - owner/lives here;
   * 2 - supporter.
   */
  userCategory: LocationNotificationsCategory;

  /**
   * The latitude in degrees. Positive values indicate latitudes north of the equator. Negative values indicate
   * latitudes south of the equator.
   */
  latitude: string;

  /**
   * The longitude in degrees. Measurements are relative to the zero meridian, with positive values extending east of
   * the meridian and negative values extending west of the meridian.
   */
  longitude: string;

  /**
   * Sales tax rate. The value must be positive and less than 1.
   */
  salesTaxRate?: number;

  /**
   * The last user in location status like HOME, AWAY, SLEEP, VACATION, etc. It is used in analytic rules.
   */
  event: string;

  /**
   * Utility account number, when this user account is linked to acquire data from a utility.
   */
  utilityAccountNo?: string;

  /**
   * This represents the approximate size of the location. Please see the request example for more details. Size
   * units:
   * ft2 - Square Foot
   * m2 - Square Meter
   */
  size?: {
    unit: string;
    value: number;
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
  occupantsRanges?: Array<{
    start: number;
    end: number;
    number: number;
  }>;

  /**
   * Keeps a note about when the location is used by people.1 - Day
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
  startDate?: string;
  startDateMs?: number;

  /**
   * Location priority category
   * @type {number}
   */
  priorityCategory?: LocationPriorityCategory;
  priorityRank?: number;
  priorityComment?: string;

  auths?: Array<{
    locationId: number;
    appId: number;
    appName: string;
    active: boolean;
    expiry: string;
    expiryMs: number;
  }>;

  services?: Array<{
    name: string;
    desc: string;
    amount: number;
    resourceType: ResourceType;
    resourceId: string;
    startDate: string;
    startDateMs: number;
    endDate: string;
    endDateMs: number;
  }>;
}

export interface GetUserInformationApiResponse extends ApiResponseBase {
  user: {
    id: number;

    /**
     * If this is not set, then the email address will become the username.
     */
    userName: string;

    creationDate?: string;
    creationDateMs?: number;

    /**
     * Alternative username to allow user login with, typically phone number.
     */
    altUsername?: string;

    /**
     * User's first name. Or, what do your friends call you?
     */
    firstName?: string;

    /**
     * User's community pseudo name, nickname.
     */
    communityName?: string;

    /**
     * User's last name(s)
     */
    lastName?: string;

    email?: {
      /**
       * User's email.
       */
      email: string;

      /**
       * Return 'true' if the email address was verified.
       */
      verified: boolean;

      /**
       * Email address status reported by Ensemble.
       */
      status: EmailVerificationStatus;
    };

    /**
     * Additional user permissions:
     * 0 - access any objects
     * 1 - grant roles
     * 2 - reports access
     * 3 - organization admin
     * 4 - devices and users access
     * 5 - paid services administrator
     * 6 - bot store administrator
     * 7 - system administrator
     * 8 - manage customer services
     */
    permission?: Array<UserPermission>;

    role?: {
      id: number;
      name: string;
      description: string;
    };

    /**
     * When the user sends messages in a community social network, enabling this flag will cause their name to be
     * hidden when they send messages and on lists of individuals who are part of a group inside an organization, etc.
     * Default is false.
     */
    anonymous?: boolean;

    /**
     * Location file storage policy.
     */
    fileUploadPolicy: FileUploadPolicy | number;

    /**
     * Existence of user account password.
     */
    passwordSet: boolean;

    /**
     * Phone number
     */
    phone?: string;

    /**
     * Phone type.
     */
    phoneType?: PhoneType;

    /**
     * Unique application name.
     */
    appName?: string;

    /**
     * Avatar app file ID.
     */
    avatarFileId?: number;

    /**
     * User's phone number verification status.
     */
    smsStatus?: PhoneVerificationStatus;

    /**
     * User's preferred language. For example:
     * en - English
     * cn - Chinese
     * fr - French
     * ru - Russian
     * etc.
     */
    language: string;

    /**
     * User's pronoun ID. See get pronouns API.
     * @type {number}
     */
    pronounId: number;

    auths?: Array<{
      appId: number;
      appName: string;
      userName: string;
      active: boolean;
      expiry: string;
      autoRefresh: boolean;
    }>;

    authClients?: Array<{
      appId: string;
      appName: string;
      expiry: string;
      autoRefresh: boolean;
    }>;

    /**
     * The administrator can only see device, location and user tags, but not file tags.
     * Users can only see file tags but not other tags.
     * File tags would be used to help them as they search for one of their private files.
     */
    tags?: Array<{
      tag: string;
      organizationId?: number;
      organizationName?: string;
      appId?: number;
      appName?: string;
    }>;
  };

  /**
   * Location information.
   */
  locations: Array<LocationInfo>;

  /**
   * Additional user properties. i.e.: 'admin: true'
   */
  model?: {
    [key: string]: string;
  };
}
