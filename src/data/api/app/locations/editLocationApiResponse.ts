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

export interface EditLocationApiResponse extends ApiResponseBase {
}

export interface LocationModel {
  name?: string;
  type?: LocationType;
  utilityAccountNo?: string;
  timezone?: {
    id: string;
  };
  addrStreet1?: string;
  addrStreet2?: string;
  addrCity?: string;
  state?: {
    id: number;
  };
  country?: {
    id: number;
  };
  zip?: string;
  latitude?: string;
  longitude?: string;
  salesTaxRate?: number;
  size?: {
    unit: string;
    content: number;
  };
  storiesNumber?: number;
  roomsNumber?: number;
  bathroomsNumber?: number;
  occupantsNumber?: number;
  occupantsRange?: Array<{
    start: number;
    end: number;
    number: number;
  }>;
  usagePeriod?: number;
  heatingType?: number;
  coolingType?: number;
  waterHeaterType?: number;
  thermostatType?: number;

  /* Determine if it's a test location */
  test?: boolean;
}

export interface EditLocationModel {
  location: LocationModel;
}
