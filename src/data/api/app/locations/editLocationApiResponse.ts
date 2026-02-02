import { ApiResponseBase } from '../../../models/apiResponseBase';

export enum LocationType {
  Residence = 10,
  RentalUnit = 11,
  GeneralBusinessOrOther = 20,
  MunicipalOrGovernment = 21,
  HotelOrLodging = 22,
  Restaurant = 23,
  Retail = 24,
  Office = 25,
  CommonArea = 30,
  Elevator = 31,
  Hall = 32,
  Stairway = 33,
  Entrance = 34,
  Laundry = 35,
  ParkingOrGarage = 36,
  AmenityArea = 40,
  Gym = 41,
  PoolOrSpa = 42,
  UtilityArea = 50,
  StaffRoom = 51,
  Entertainment = 52,
}

/**
 * Location configuration type:
 * All - Location can have users, devices, subscriptions, bots, etc. (representing residential space or residents).
 * Devices Only - Location can only have devices (representing physical spaces).
 */
export enum LocationSubType {
  All = 0,
  DevicesOnly = 1,
}

export interface EditLocationApiResponse extends ApiResponseBase {
}

export interface LocationModel {

  /**
   * Name of the location
   * Example: "My House" or "Upstairs Bedroom".
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
   * Timezone ID. See the Date and Time Formats for more details.
   * Example: "US/Pacific" or "GMT+0800".
   */
  timezone?: {
    id: string;
  };

  /**
   * External system ID
   */
  externalId?: string;

  /**
   * Location address.
   */
  addrStreet1?: string;
  addrStreet2?: string;
  addrCity?: string;
  zip?: string;

  /**
   * Country state ID.
   * Use the Countries and TZ API to obtain numeric identifiers for each state.
   */
  state?: {
    id: number;
  };

  /**
   * Country ID.
   * Use the Countries API to obtain numeric identifiers for supported countries.
   */
  country?: {
    id: number;
  };

  /**
   * The latitude in degrees. Positive values indicate latitudes north of the equator,
   * negative values indicate latitudes south of the equator.
   */
  latitude?: string;

  /**
   * The longitude in degrees. Measurements are relative to the zero meridian,
   * with positive values extending east of the meridian and negative values extending west of the meridian.
   */
  longitude?: string;

  /**
   * Sales tax rate. The value must be positive and less than 1.
   * NOTE: Remove this field (deprecated).
   */
  salesTaxRate?: number;

  /**
   * This represents the approximate size of the location.
   * Size units: ft2 - Square Foot; m2 - Square Meter; For example: { unit: "ft2", content: 14000 }
   * NOTE: Remove this field (deprecated).
   */
  size?: {
    unit: string;
    content: number;
  };

  /**
   * Number of stories in the home / building.
   * NOTE: Remove this field (deprecated).
   */
  storiesNumber?: number;

  /**
   * Number of rooms.
   * NOTE: Remove this field (deprecated).
   */
  roomsNumber?: number;

  /**
   * Number of bathrooms.
   * NOTE: Remove this field (deprecated).
   */
  bathroomsNumber?: number;

  /**
   * Total number of people living / working at this location.
   * NOTE: Remove this field (deprecated).
   */
  occupantsNumber?: number;

  /**
   * Array of JSON objects describing age ranges in years, and the number of occupants in those age ranges.
   * NOTE: Remove this field (deprecated).
   */
  occupantsRange?: Array<{
    start: number;
    end: number;
    number: number;
  }>;

  /**
   * Keeps a note about when the location is used by people.
   * 1 - Day, 2 - Night, 3 - Both.
   * NOTE: Remove this field (deprecated).
   */
  usagePeriod?: number;

  /**
   * This is a bitmap that describes the type of heating that is used at this location.
   * 1 - Electric, 2 - Natural Gas, 4 - Propane, 8 - Oil, 16 - Biomass, 128 - Other.
   * NOTE: Remove this field (deprecated).
   */
  heatingType?: number;

  /**
   * This is a bitmap that describes the type of cooling that is used at this location.
   * 1 - Central A/C, 2 - Window A/C, 4 - Open windows / fans, 128 - Other.
   * NOTE: Remove this field (deprecated).
   */
  coolingType?: number;

  /**
   * This is a bitmap that describes the type of water heating that is used at this location.
   * 1 - Electric, 2 - Natural Gas, 4 - Propane, 8 - Oil, 16 - Biomass, 32 - Solar, 128 - Other.
   * NOTE: Remove this field (deprecated).
   */
  waterHeaterType?: number;

  /**
   * This is a bitmap that describes the type of thermostat that is used at this location.
   * 1 - Non-programmable, 2 - Programmable, 3 - Internet Connected.
   * NOTE: Remove this field (deprecated).
   */
  thermostatType?: number;

  /**
   * Test location flag.
   */
  test?: boolean;
}
