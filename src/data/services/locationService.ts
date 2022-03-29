import { inject, injectable } from '../../modules/common/di';
import { ApiResponseBase } from '../models/apiResponseBase';
import { LocationsApi } from '../api/app/locations/locationsApi';
import { UserService } from './userService';
import { BaseService } from './baseService';
import { GetCountriesApiResponse } from '../api/app/locations/getCountriesApiResponse';
import { LocationModel } from '../api/app/locations/editLocationApiResponse';
import { AuthService } from './authService';
import { GetLocationUsersApiResponse } from '../api/app/locations/getLocationUsersApiResponse';
import { LocationUsersModel } from '../api/app/locations/addLocationUsersApiResponse';
import { GetLocationStateApiResponse, LocationStateName } from '../api/app/locations/getLocationStateApiResponse';
import { GetLocationTimeStateApiResponse, LocationTimeStateAggregation } from '../api/app/locations/getLocationTimeStateApiResponse';
import { SetLocationStateApiResponse, SetLocationStateModel } from '../api/app/locations/setLocationStateApiResponse';
import { GetLocationScenesHistoryApiResponse } from '../api/app/locations/getLocationScenesHistoryApiResponse';
import { GetSpacesApiResponse } from '../api/app/locations/getSpacesApiResponse';
import { UpdateLocationSpaceApiResponse, UpdateLocationSpaceModel } from '../api/app/locations/updateSpaceApiResponse';
import { GetLocationPrioritiesApiResponse } from '../api/app/locations/getLocationPrioritiesApiResponse';
import { WsSubscriptionType } from '../../modules/wsHub/wsSubscriptionType';
import { WsSubscriptionOperation } from '../../modules/wsHub/wsSubscriptionOperation';
import { WsSubscription } from '../../modules/wsHub/wsSubscription';
import { WsHub } from '../../modules/wsHub/wsHub';

@injectable('LocationService')
export class LocationService extends BaseService {
  @inject('AuthService') protected readonly authService!: AuthService;
  @inject('LocationsApi') protected readonly locationsApi!: LocationsApi;
  @inject('UserService') protected readonly userService!: UserService;
  @inject('WsHub') protected readonly wsHub!: WsHub;

  constructor() {
    super();
  }

  /**
   * Change the scene at a Location.
   *
   * By changing the scene at a location, you may cause user-defined Rules to execute such as
   * "When I am home do something" or "When I am going to sleep turn of the TV".
   *
   * @param {number} locationId The Location ID for which to trigger an event
   * @param {string} scene Developer-defined name of the scene. For example, 'HOME', 'AWAY', 'SLEEP', 'VACATION'.
   * You can define any name you want. The name represents some state, and can be fed into Rules and
   * other areas of the app. Presence uses 'HOME', 'AWAY', 'SLEEP', and 'VACATION'.
   * @returns {Promise<SceneUpdateInfo>}
   */
  public setLocationScene(locationId: number, scene: string): Promise<SceneUpdateInfo> {
    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.setLocationScene(locationId, scene);
    });
  }

  /**
   * Get Location scenes history. Return location change schemes history in backward order (latest first).
   * @param {string} locationId The Location ID.
   * @param {string} [startDate] Optional. Start date to begin receiving data.
   * @param {string} [endDate] Optional. End date to stop receiving data. Default is the current date.
   * @returns {Promise<GetLocationScenesHistoryApiResponse>}
   */
  public getLocationScenesHistory(locationId: number, startDate?: string, endDate?: string): Promise<GetLocationScenesHistoryApiResponse> {
    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.getLocationScenesHistory(locationId, startDate, endDate);
    });
  }

  /**
   * Gets list of countries supported by Ensemble
   * @param {string|string[]} countryCode
   * @returns {Promise<CountriesList>}
   */
  public getCountries(countryCode?: string | string[]): Promise<CountriesList> {
    return this.locationsApi.getCountries({sortCollection: 'countries', sortBy: 'name', countryCode});
  }

  /**
   * Updates location with new location properties values.
   * @param {number} locationId
   * @param {LocationModel} location
   * @returns {Promise<ApiResponseBase>}
   */
  public updateLocation(locationId: number, location: LocationModel): Promise<ApiResponseBase> {
    return this.authService.ensureAuthenticated().then(() => this.locationsApi.editLocation({location: location}, locationId));
  }

  /**
   * Delete location completely.
   * @param {number} locationId Location ID to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteLocation(locationId: number): Promise<ApiResponseBase> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.deleteLocation(locationId);
    });
  }

  /**
   * Gets list of location users.
   * @param {number} locationId Location ID to get users from
   * @returns {Promise<LocationUsers>}
   */
  public getLocationUsers(locationId: number): Promise<LocationUsers> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.getLocationUsers(locationId);
    });
  }

  /**
   * Add/Update location users with specific access details.
   * @param {number} locationId Location ID to add users into
   * @param {LocationUsersModel} users Users to add/update
   * @returns {Promise<ApiResponseBase>}
   */
  public updateLocationUsers(locationId: number, users: LocationUsersModel): Promise<ApiResponseBase> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.addLocationUsers(locationId, users);
    });
  }

  /**
   * Removes user from location.
   * @param {number} locationId Location ID to delete user from
   * @param {number} userId User ID to delete from location
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteLocationUser(locationId: number, userId: number): Promise<ApiResponseBase> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (userId < 1 || isNaN(userId)) {
      return this.reject(`User ID is incorrect [${userId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.deleteLocationUser(locationId, userId);
    });
  }

  /**
   * Get state(s) of specified location.
   * A way for bots and users to read a current location state(s) by name.
   *
   * @param {number} locationId Location ID.
   * @param {LocationStateName|LocationStateName[]} name State name, multiple values supported.
   * @returns {Promise<GetLocationStateApiResponse>}
   */
  public getLocationState(locationId: number, name: LocationStateName | LocationStateName[]): Promise<GetLocationStateApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.getLocationState(locationId, name);
    });
  }

  /**
   * Subscribe for particular location state changes
   * @param {number} locationId Location ID.
   * @param {string} locationStateName State name
   * @returns {WsSubscription}
   */
  public subscribeForLocationStates(locationId: number, locationStateName: string): WsSubscription {
    return this.wsHub.subscribe(WsSubscriptionType.LOCATION_STATES, WsSubscriptionOperation.CREATE_OR_UPDATE_OR_DELETE, {
      locationId: locationId,
      name: locationStateName,
    });
  }

  /**
   * Set Location State.
   *
   * A way for bots and users to set named location states with flexible JSON object structure.
   * The state value can be an any valid JSON node. It can be a single value node (string, integer, etc) or an array or an object node {}.
   * To remove a location state set the value to null.
   * If the value is an object node, the API will read the current state value and try to update only changed fields.
   * To delete a field from the current value set it to null.
   *
   * @param {number} locationId Location ID.
   * @param {string} name State name.
   * @param {SetLocationStateModel} value any valid JSON node - string, integer, boolean, array, object, etc.
   * @param {boolean} [overwrite] Overwrite the entire state with completely new content.
   * @param {string} [analyticKey] Analytic Bot Key.
   * @returns {Promise<SetLocationStateApiResponse>}
   */
  public setLocationState(
    locationId: number,
    name: string,
    value: SetLocationStateModel,
    overwrite?: boolean,
    analyticKey?: string,
  ): Promise<SetLocationStateApiResponse> {
    const params: {
      name: string;
      overwrite?: boolean;
    } = {
      name: name,
    };

    if (overwrite) {
      params.overwrite = true;
    }

    if (analyticKey) {
      return this.locationsApi.setLocationState(locationId, params, value, analyticKey);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.setLocationState(locationId, params, value);
    });
  }

  /**
   * Get time-based state(s) of specified location.
   * A way for bots and users to read a current location time state(s) by name.
   *
   * @param {number} locationId Location ID.
   * @param {string|string[]} name State name, multiple values supported.
   * @param {string|number} startDate Return state(s) with dates greater or equal to this value.
   * @param {string|number} [endDate] Return states with dates less than this value.
   *   If not set, only states with dates exactly equal to startDate will be returned.
   * @returns {Promise<GetLocationTimeStateApiResponse>}
   */
  public getLocationTimeState(
    locationId: number,
    name: string,
    startDate: string | number,
    endDate?: string | number,
  ): Promise<GetLocationTimeStateApiResponse> {
    if (!startDate) {
      return this.reject(`Start date not specified [${startDate}].`);
    }

    const params: {
      name: string;
      startDate: string | number;
      endDate?: string | number;
    } = {
      name: name,
      startDate: startDate,
    };
    if (endDate) {
      params.endDate = endDate;
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.getLocationTimeState(locationId, params);
    });
  }

  /**
   * Get time state(s) historical data for specified location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-time-states/get-states}
   *
   * @param {number} locationId Location ID.
   * @param params Requested parameters.
   * @param {string|number} params.startDate Return states with dates greater or equal to this value.
   * @param {string|number} params.endDate Return states with dates less than this value.
   *   If not set, only states with dates exactly equal to startDate will be returned.
   * @param {string|string[]} params.name State name, multiple values supported.
   * @param {string|string[]} [params.field] State field to get or filter by.
   *   Multiple values are required for deeper object level.
   * @param {boolean} [params.keepParent] Use the field parameter only for filtering.
   * @param {LocationTimeStateAggregation} [params.aggregation] Aggregate field values by 1 = hour, 2 = day, 3 = month, 4 = week
   * @returns {Promise<GetLocationTimeStateApiResponse>}
   */
  public getLocationTimeStatesHistory(
    locationId: number,
    params: {
      startDate: string | number;
      endDate: string | number;
      name: string | string[];
      field?: string | string[];
      keepParent?: boolean;
      aggregation?: LocationTimeStateAggregation;
    },
  ): Promise<GetLocationTimeStateApiResponse> {
    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.getLocationTimeState(locationId, params);
    });
  }

  /**
   * Set location time state.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-time-states/set-state}
   *
   * A way for bots and users to set time based location states with flexible JSON object structure. To delete a field from the current value set it to null.
   *
   * @param {number} locationId Location ID.
   * @param params Requested parameters.
   * @param {string} params.name State name.
   * @param {string|number} params.date State date or time value.
   * @param {boolean} [params.overwrite] Overwrite the entire state with completely new content.
   * @param {SetLocationStateModel} value any valid JSON node - string, integer, boolean, array, object, etc.
   * @param {string} [analyticKey] Optional Bot Api key.
   * @returns {Promise<SetLocationStateApiResponse>}
   */
  setLocationTimeState(
    locationId: number,
    params: {
      name: string;
      date: string | number;
      overwrite?: boolean;
    },
    value: SetLocationStateModel,
    analyticKey?: string,
  ): Promise<SetLocationStateApiResponse> {
    if (analyticKey) {
      return this.locationsApi.setLocationState(locationId, params, value, analyticKey);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.setLocationState(locationId, params, value);
    });
  }

  /**
   * Get spaces of specified location.
   * @param {number} locationId Location ID.
   * @returns {Promise<GetSpacesApiResponse>}
   */
  public getLocationSpaces(locationId: number): Promise<GetSpacesApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.getSpaces(locationId);
    });
  }

  /**
   * Add new space to specified location.
   * @param {number} locationId Location ID.
   * @param {UpdateLocationSpaceModel} spaceModel
   * @returns {Promise<UpdateLocationSpaceApiResponse>}
   */
  public addLocationSpace(locationId: number, spaceModel: UpdateLocationSpaceModel) {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.updateSpace(locationId, spaceModel);
    });
  }

  /**
   * Update existing space at specified location.
   * @param {number} locationId Location ID.
   * @param {number} spaceId Space ID.
   * @param {UpdateLocationSpaceModel} spaceModel
   * @returns {Promise<UpdateLocationSpaceApiResponse>}
   */
  public updateLocationSpace(
    locationId: number,
    spaceId: number,
    spaceModel: UpdateLocationSpaceModel,
  ): Promise<UpdateLocationSpaceApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (spaceId < 1 || isNaN(spaceId)) {
      return this.reject(`Space ID is incorrect [${spaceId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.updateSpace(locationId, spaceModel, spaceId);
    });
  }

  /**
   * Get history of location priorities.
   * @param {number} locationId Location ID.
   * @param {Object} params Request parameters.
   * @param {string|number} params.startDate History date range start.
   * @param {string|number} [params.endDate] History date range end.
   * @param {number} [params.priority] Filter by priority.
   * @param {number} [params.rowCount] Maximum number of results.
   * @returns {Promise<GetLocationPrioritiesApiResponse>}
   */
  public getLocationPriorityHistory(
    locationId: number,
    params: {
      startDate: string | number;
      endDate?: string | number;
      priority?: number;
      rowCount?: number;
    },
  ): Promise<GetLocationPrioritiesApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (!params || !params.startDate) {
      return this.reject(`Start date not specified [${params.startDate}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationsApi.getLocationPriorityHistory(locationId, params);
    });
  }
}

export interface CountriesList extends GetCountriesApiResponse {
}

export interface SceneUpdateInfo extends ApiResponseBase {
}

export interface LocationUsers extends GetLocationUsersApiResponse {
}
