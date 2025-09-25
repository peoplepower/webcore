import { ApiResponseBase } from '../../../models/apiResponseBase';
import { LocationSubType, LocationType } from './editLocationApiResponse';

export interface AddNewLocationToUserApiResponse extends ApiResponseBase {
  locationId: number;
}

export interface NewLocationModel {
  /**
   * Name of the location (i.e. "My House" or "Upstairs Bedroom")
   */
  name?: string;

  /**
   * Location type.
   */
  type?: LocationType;

  /**
   * Location configuration type.
   */
  subType?: LocationSubType;

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
}
