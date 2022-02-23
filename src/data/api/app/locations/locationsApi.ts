import { AppApiDal } from '../appApiDal';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { inject, injectable } from '../../../../modules/common/di';
import { AddNewLocationToUserApiResponse, AddNewLocationToUserModel } from './addNewLocationToUserApiResponse';
import { EditLocationApiResponse, EditLocationModel } from './editLocationApiResponse';
import { GetLocationScenesHistoryApiResponse } from './getLocationScenesHistoryApiResponse';
import { GetCountriesApiResponse } from './getCountriesApiResponse';
import { GetLocationUsersApiResponse } from './getLocationUsersApiResponse';
import { AddLocationUsersApiResponse, LocationUsersModel } from './addLocationUsersApiResponse';
import { GetSpacesApiResponse } from './getSpacesApiResponse';
import {
  CreateOrUpdateNarrativeApiResponse,
  CreateOrUpdateNarrativeModel,
  NarrativePriority,
  NarrativeScope,
  NarrativeStatus,
} from './createOrUpdateNarrativeApiResponse';
import { GetNarrativesApiResponse } from './getNarrativesApiResponse';
import { GetLocationStateApiResponse } from './getLocationStateApiResponse';
import { GetLocationTotalsApiResponse } from './getLocationTotalsApiResponse';
import { SetLocationStateApiResponse, SetLocationStateModel } from './setLocationStateApiResponse';
import { GetLocationTimeStateApiResponse, LocationTimeStateAggregation } from './getLocationTimeStateApiResponse';
import { UpdateLocationSpaceApiResponse, UpdateLocationSpaceModel } from './updateSpaceApiResponse';
import { GetLocationPrioritiesApiResponse } from './getLocationPrioritiesApiResponse';

/**
 * Locations API.
 * See {@link https://iotapps.docs.apiary.io/#reference/locations}
 */
@injectable('LocationsApi')
export class LocationsApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Add a new Location to an existing User.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/new-location/add-a-new-location-to-an-existing-user}
   *
   * @param {AddNewLocationToUserModel} location New Location.
   * @param {number} [userId] User ID. Optional parameter. This parameter is used by administrator accounts to update a specific user's account.
   * @returns {Promise<AddNewLocationToUserApiResponse>}
   */
  addNewLocationToUser(location: AddNewLocationToUserModel, userId?: number): Promise<AddNewLocationToUserApiResponse> {
    return this.dal.post('location', location, {params: {userId: userId}});
  }

  /**
   * Edit location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/update-location/edit-location}
   *
   * @param {EditLocationModel} location Location.
   * @param {number} locationId Location ID to update.
   * @returns {Promise<EditLocationApiResponse>}
   */
  editLocation(location: EditLocationModel, locationId: number): Promise<EditLocationApiResponse> {
    return this.dal.put(`location/${encodeURIComponent(locationId.toString())}`, location);
  }

  /**
   * Delete location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/update-location/delete-location}
   *
   * @param {number} locationId Location ID to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteLocation(locationId: number): Promise<ApiResponseBase> {
    return this.dal.delete(`location/${encodeURIComponent(locationId.toString())}`);
  }

  // #region -------------------- Location Scenes --------------------

  /**
   * Change the scene at a Location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/set-location-scene/change-the-scene-at-a-location}
   *
   * By changing the scene at a location, you may cause user-defined Rules to execute such as
   * "When I am home do something" or "When I am going to sleep turn of the TV".
   *
   * @param {number} locationId The Location ID for which to trigger an event.
   * @param {string} eventName Developer-defined name of the scene. For example, 'HOME', 'AWAY', 'SLEEP'.
   * @returns {Promise<ApiResponseBase>}
   */
  setLocationScene(locationId: number, eventName: string): Promise<ApiResponseBase> {
    return this.dal.post(`location/${encodeURIComponent(locationId.toString())}/event/${encodeURIComponent(eventName)}`, {});
  }

  /**
   * Get Location scenes history. Return location change schemes history in backward order (latest first).
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-scenes/location-scenes-history}
   *
   * @param {string} locationId The Location ID.
   * @param {string} [startDate] Optional. Start date to begin receiving data.
   * @param {string} [endDate] Optional. End date to stop receiving data. Default is the current date.
   * @returns {Promise<GetLocationScenesHistoryApiResponse>}
   */
  getLocationScenesHistory(locationId: number, startDate?: string, endDate?: string): Promise<GetLocationScenesHistoryApiResponse> {
    return this.dal.get('location/' + encodeURIComponent(locationId.toString()) + '/events', {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
  }

  // #endregion

  /**
   * Return a list of countries currently supported on Ensemble. The Country ID is used when referencing this country in other API calls.
   * @param [params] Parameters
   * @param {number} [params.organizationId] Filter response by the organization ID
   * @param {string|string[]} [params.countryCode] Filter response by country codes. You may specify multiple 'countryCode' URL params.
   * @param {string} [params.lang] Use for language specific response.
   * @returns {Promise<GetCountriesApiResponse>}
   */
  getCountries(params?: {
    organizationId?: number;
    countryCode?: string | string[];
    lang?: string;
    sortCollection?: string;
    sortBy?: string;
  }): Promise<GetCountriesApiResponse> {
    return this.dal.get('countries', {params: params});
  }

  // #region --------------------- Location Users -----------------------

  /**
   * Returns users who have access to specific location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-users/get-location-users}
   *
   * An administrator of a location can assign other existing users to access to the location and devices on it.
   * Added users will receive notifications related to this location depends of notification category..
   *
   * @param {number} locationId Location ID.
   * @param {string} [analyticKey] Optional Bot Api key.
   * @returns {Promise<GetLocationUsersApiResponse>}
   */
  getLocationUsers(locationId: number, analyticKey?: string): Promise<GetLocationUsersApiResponse> {
    return this.dal.get(`location/${encodeURIComponent(locationId.toString())}/users`, {
      headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
    });
  }

  /**
   * Add existing users lo specified location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-users/add-location-users}
   *
   * @param {number} locationId Location ID.
   * @param {LocationUsersModel} users Users to add.
   * @returns {Promise<AddLocationUsersApiResponse>}
   */
  addLocationUsers(locationId: number, users: LocationUsersModel): Promise<AddLocationUsersApiResponse> {
    return this.dal.post(`location/${encodeURIComponent(locationId.toString())}/users`, users);
  }

  // TODO(max): Add update location user API, see Apiary.
  // https://iotapps.docs.apiary.io/#reference/locations/location-users/update-location-user

  /**
   * Removes user(s) access from specified location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-users/delete-location-user}
   *
   * @param {number} locationId Location ID.
   * @param {(number|number[])} userId User ID to remove from location. You may specify multiple 'userId' URL parameters at once.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteLocationUser(locationId: number, userId: number | number[]): Promise<ApiResponseBase> {
    return this.dal.delete(`location/${encodeURIComponent(locationId.toString())}/users`, {
      params: {
        userId: userId,
      },
    });
  }

  // #endregion

  // #region --------------------- Location Spaces ----------------------

  /**
   * Returns location spaces in specifies location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-spaces/get-spaces}
   *
   * A user can define location zones called spaces. A space has a type and name.
   *
   * @param {number} locationId Location ID.
   * @returns {Promise<GetSpacesApiResponse>}
   */
  getSpaces(locationId: number): Promise<GetSpacesApiResponse> {
    return this.dal.get(`location/${encodeURIComponent(locationId.toString())}/spaces`);
  }

  /**
   * Add new or modify existing space at the location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-spaces/update-space}
   *
   * @param {number} locationId Location ID.
   * @param {UpdateLocationSpaceModel} spaceModel
   * @param {number} [spaceId] Space type ID.
   * @returns {Promise<UpdateLocationSpaceApiResponse>}
   */
  updateSpace(locationId: number, spaceModel: UpdateLocationSpaceModel, spaceId?: number): Promise<UpdateLocationSpaceApiResponse> {
    return this.dal.post(`location/${encodeURIComponent(locationId.toString())}/spaces`, spaceModel, {
      params: {
        spaceId: spaceId,
      },
    });
  }

  /**
   * Delete location space.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-spaces/delete-space}
   *
   * @param {number} locationId Location ID to delete.
   * @param {number} spaceId Space ID to delete;
   * @returns {Promise<ApiResponseBase>}
   */
  deleteSpace(locationId: number, spaceId: number): Promise<ApiResponseBase> {
    return this.dal.delete(`location/${encodeURIComponent(locationId.toString())}/spaces`, {
      params: {
        spaceId: spaceId,
      },
    });
  }

  // #endregion

  // #region ------------------- Location Narratives --------------------

  /**
   * Create/Update a narrative.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/narratives/create/update-a-narrative}
   *
   * When a new narrative is created, the API returns the new record ID and narrativeTime in milliseconds.
   * To update an existing narrative both narrativeId and narrativeTime query parameters must be provided.
   * The new value of narrativeTime in milliseconds will be returned, if it has been changed.
   *
   * @param {number} locationId Location ID.
   * @param {CreateOrUpdateNarrativeModel} narrative Narrative.
   * @param {string} [analyticKey] Analytic Bot Key.
   * @param params Request parameters.
   * @param {NarrativeScope} params.scope Type of narrative.
   * @param {number} [params.narrativeId] Optional ID of narrative - required for update.
   * @param {number} [params.narrativeTime] Optional narrative time as returned from the API - required for update.
   * @returns {Promise<CreateOrUpdateNarrativeApiResponse>}
   */
  createOrUpdateNarrative(
    locationId: number,
    narrative: CreateOrUpdateNarrativeModel,
    params: { scope: NarrativeScope; narrativeId?: number; narrativeTime?: number },
    analyticKey?: string,
  ): Promise<CreateOrUpdateNarrativeApiResponse> {
    return this.dal.put(
      `locations/${encodeURIComponent(locationId.toString())}/narratives`,
      {narrative: narrative},
      {
        params: params,
        headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
      },
    );
  }

  /**
   * Delete a narrative.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/narratives/delete-a-narrative}
   *
   * @param {number} locationId Location ID to add narrative.
   * @param params Request parameters.
   * @param {NarrativeScope} params.scope Type of narrative.
   * @param {number} params.narrativeId ID of narrative to delete.
   * @param {number} params.narrativeTime Narrative time in milliseconds.
   * @param {string} [analyticKey] Analytic Bot Api Key.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteNarrative(
    locationId: number,
    params: { scope: NarrativeScope; narrativeId: number; narrativeTime: number },
    analyticKey?: string,
  ): Promise<ApiResponseBase> {
    return this.dal.delete(`locations/${encodeURIComponent(locationId.toString())}/narratives`, {
      params: params,
      headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
    });
  }

  /**
   * Returns list of narratives.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/narratives/get-narratives}
   *
   * The rowCount parameter specifies the maximum number of elements per page.
   * The result may include the 'nextMarker' property - this means that there are more pages for the current search criteria.
   * To get the next page, the value of "nextMarker" must be passed to the 'pageMarker' parameter on the next API call.
   *
   * @param {number} locationId Location ID.
   * @param {string} [analyticKey] Analytic Bot Api Key.
   *
   * @param params Request parameters.
   * @param {number} params.rowCount Maximum number of elements per page.
   * @param {number} [params.narrativeId] Filter by Narrative ID.
   * @param {NarrativePriority} [params.priority] Filter by priority higher or equal than that.
   * @param {NarrativePriority} [params.toPriority] Filter by priority less or equal than that.
   * @param {NarrativeStatus} [params.status] Filter by status, deleted are not returned by default.
   * @param {string} [params.searchBy] Filter by title or description. Use * for a wildcard.
   * @param {string} [params.startDate] Narrative date range start.
   * @param {string} [params.endDate] Narrative date range end date.
   * @param {string} [params.pageMarker] Marker to the next page.
   * @returns {Promise<GetNarrativesApiResponse>}
   */
  getNarratives(
    locationId: number,
    params: {
      rowCount: number;
      narrativeId?: number;
      priority?: NarrativePriority;
      toPriority?: NarrativePriority;
      status?: NarrativeStatus;
      searchBy?: string;
      startDate?: string;
      endDate?: string;
      pageMarker?: string;
    },
    analyticKey?: string,
  ): Promise<GetNarrativesApiResponse> {
    return this.dal.get(`locations/${encodeURIComponent(locationId.toString())}/narratives`, {
      params: params,
      headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
    });
  }

  // #endregion

  // #region --------------------- Location States ----------------------

  /**
   * Get state(s) for specified location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-states/get-state}
   *
   * A way to read specified location state(s) by name.
   *
   * @param {number} locationId Location ID.
   * @param {string|string[]} name State name, multiple values supported.
   * @returns {Promise<GetLocationStateApiResponse>}
   */
  getLocationState(locationId: number, name: string | string[]): Promise<GetLocationStateApiResponse> {
    return this.dal.get(`locations/${encodeURIComponent(locationId.toString())}/state`, {
      params: {
        name: name,
      },
    });
  }

  /**
   * Set location state.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-states/set-state}
   *
   * A way for bots and users to set named location states with flexible JSON object structure.
   * The state value can be an any valid JSON node. It can be a single value node (string, integer, etc) or an array or an object node {}.
   * To remove a location state set the value to null.
   *
   * If the value is an object node, the API will read the current state value and try to update only changed fields. To delete a field from the current value
   * set it to null.
   * @param {number} locationId Location ID.
   * @param params Requested parameters.
   * @param {string} params.name State name.
   * @param {boolean} [params.overwrite] Overwrite the entire state with completely new content.
   * @param {SetLocationStateModel} value any valid JSON node - string, integer, boolean, array, object, etc.
   * @param {string} [analyticKey] Optional Bot Api key.
   * @returns {Promise<SetLocationStateApiResponse>}
   */
  setLocationState(
    locationId: number,
    params: {
      name: string;
      overwrite?: boolean;
    },
    value: SetLocationStateModel,
    analyticKey?: string,
  ): Promise<SetLocationStateApiResponse> {
    return this.dal.put(`locations/${encodeURIComponent(locationId.toString())}/state`, value || {}, {
      params: params,
      headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
    });
  }

  /**
   * Get time state(s) for specified location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-time-states/get-states}
   *
   * A way to read specified location time-based state(s) by name.
   * @param {number} locationId Location ID.
   * @param params Requested parameters.
   * @param {string|number} params.startDate Return states with dates greater or equal to this value.
   * @param {string|number} [params.endDate] Return states with dates less than this value.
   *   If not set, only states with dates exactly equal to startDate will be returned.
   * @param {string|string[]} [params.name] State name, multiple values supported.
   * @param {string|string[]} [params.field] State field to get or filter by.
   *   Multiple values are required for deeper object level.
   * @param {boolean} [params.keepParent] Use the field parameter only for filtering.
   * @param {LocationTimeStateAggregation} [params.aggregation] Aggregate field values by 1 = hour, 2 = day, 3 = month, 4 = week
   * @returns {Promise<GetLocationTimeStateApiResponse>}
   */
  getLocationTimeState(
    locationId: number,
    params: {
      startDate: string | number;
      endDate?: string | number;
      name?: string | string[];
      field?: string | string[];
      keepParent?: boolean;
      aggregation?: LocationTimeStateAggregation;
    },
  ): Promise<GetLocationTimeStateApiResponse> {
    return this.dal.get(`locations/${encodeURIComponent(locationId.toString())}/timeStates`, {
      params: params,
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
    return this.dal.put(`locations/${encodeURIComponent(locationId.toString())}/timeStates`, value || {}, {
      params: params,
      headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
    });
  }

  // #endregion

  /**
   * For the location landing page we are displaying the location's total files, devices and rules.
   * This is a single API to request total numbers.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-totals/get-totals}
   *
   * @param params Request parameters.
   * @param {number} params.locationId Location ID to get totals from.
   * @param {boolean} [params.devices] Return total devices number.
   * @param {boolean} [params.files] Return total files number.
   * @param {boolean} [params.rules] Return total rules number
   * @returns {Promise<GetLocationTotalsApiResponse>}
   */
  getLocationTotals(params: {
    locationId: number;
    devices?: boolean;
    files?: boolean;
    rules?: boolean;
  }): Promise<GetLocationTotalsApiResponse> {
    return this.dal.get('locationTotals', {params: params});
  }

  /**
   * Return location priorities history.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-scenes/location-priorities-history}
   *
   * @param {number} locationId Location ID to get history of priorities.
   * @param {Object} params Request parameters.
   * @param {string|number} params.startDate History date range start.
   * @param {string|number} [params.endDate] History date range end.
   * @param {number} [params.priority] Filter by priority.
   * @param {number} [params.rowCount] Maximum number of results.
   * @returns {Promise<GetLocationPrioritiesApiResponse>}
   */
  getLocationPriorityHistory(
    locationId: number,
    params: {
      startDate: string | number;
      endDate?: string | number;
      priority?: number;
      rowCount?: number;
    },
  ): Promise<GetLocationPrioritiesApiResponse> {
    return this.dal.get(`location/${encodeURIComponent(locationId.toString())}/priorities`, {
      params: params,
    });
  }
}
