import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface AddNewLocationToUserApiResponse extends ApiResponseBase {
  locationId: number;
}

export interface AddNewLocationToUserModel {
  location: {
    name?: string;
    type?: number;
    appName?: string;
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
  };
}
