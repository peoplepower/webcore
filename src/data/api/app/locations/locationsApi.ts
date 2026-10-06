import { AppApiDal } from '../appApiDal';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { inject, injectable } from '../../../../modules/common/di';
import { CreateLocationApiResponse, NewLocationModel } from './createLocationApiResponse';
import { EditLocationApiResponse, LocationModel } from './editLocationApiResponse';
import { GetLocationScenesHistoryApiResponse } from './getLocationScenesHistoryApiResponse';
import { GetCountriesApiResponse } from './getCountriesApiResponse';
import { GetLocationUsersApiResponse } from './getLocationUsersApiResponse';
import { AddLocationUsersApiResponse, AddLocationUsersModel } from './addLocationUsersApiResponse';
import { GetSpacesApiResponse } from './getSpacesApiResponse';
import { GetLocationTotalsApiResponse } from './getLocationTotalsApiResponse';
import { UpdateLocationSpaceApiResponse, UpdateLocationSpaceModel } from './updateSpaceApiResponse';
import { GetLocationPrioritiesApiResponse } from './getLocationPrioritiesApiResponse';
import { UpdateLocationUserApiResponse, UpdateLocationUserModel } from "./updateLocationUserApiResponse";

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
   * @param {NewLocationModel} location New Location.
   * @param {number} [userId] User ID. Optional parameter. This parameter is used by administrator accounts to update a specific user's account.
   * @param {number} [parentId] Parent location ID to assign the new location as a sub-location there.
   * @returns {Promise<CreateLocationApiResponse>}
   */
  createLocation(location: NewLocationModel, userId?: number, parentId?: number): Promise<CreateLocationApiResponse> {
    return this.dal.post('location', {location: location}, {params: {userId: userId, parentId: parentId}});
  }

  /**
   * Edit Location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/update-location/edit-location}
   *
   * @param {LocationModel} location Location.
   * @param {number} locationId Location ID to update.
   * @returns {Promise<EditLocationApiResponse>}
   */
  editLocation(location: LocationModel, locationId: number): Promise<EditLocationApiResponse> {
    return this.dal.put(`location/${encodeURIComponent(locationId.toString())}`, {location: location});
  }

  /**
   * Delete Location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/update-location/delete-location}
   *
   * @param {number} locationId Location ID to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteLocation(locationId: number): Promise<ApiResponseBase> {
    return this.dal.delete(`location/${encodeURIComponent(locationId.toString())}`);
  }

  /**
   * Add Sub-Location.
   * See {@link https://sboxall.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Locations/operation/Add%20Sub-Location}
   *
   * @param {number} locationId Parent Location ID to assign sub-location.
   * @param {number} subLocationId Existing Location ID to add as a sub-location.
   * @param {number} [startDate] Assignment start date otherwise set to now.
   * @returns {Promise<ApiResponseBase>}
   */
  addSubLocation(locationId: number, subLocationId: number, startDate?: number): Promise<ApiResponseBase> {
    return this.dal.put(`location/${encodeURIComponent(locationId.toString())}/subs`, { locationId: locationId }, {
      params: {
        subLocationId: subLocationId,
        startDate: startDate,
      },
    });
  }

  /**
   * Delete Sub-Location.
   * See {@link https://sboxall.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Locations/operation/Delete%20Sub-Location}
   *
   * @param {number} locationId Parent Location ID to remove sub-location from.
   * @param {number} subLocationId Existing Location ID to remove as a sub-location.
   * @param {number} [endDate] Assignment end date otherwise set to now.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteSubLocation(locationId: number, subLocationId: number, endDate?: number): Promise<ApiResponseBase> {
    return this.dal.delete(`location/${encodeURIComponent(locationId.toString())}/subs`, {
      params: {
        subLocationId: subLocationId,
        endDate: endDate,
      },
    });
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
   * @param {AddLocationUsersModel} users Users to add.
   * @returns {Promise<AddLocationUsersApiResponse>}
   */
  addLocationUsers(locationId: number, users: AddLocationUsersModel): Promise<AddLocationUsersApiResponse> {
    return this.dal.post(`location/${encodeURIComponent(locationId.toString())}/users`, users);
  }

  /**
   * Update location users on specified location.
   * See {@link https://iotapps.docs.apiary.io/#reference/locations/location-users/update-location-user}
   *
   * @param {number} locationId Location ID.
   * @param {UpdateLocationUserModel} user updated fields.
   * @returns {Promise<UpdateLocationUserApiResponse>}
   */
  updateLocationUser(locationId: number, user: UpdateLocationUserModel): Promise<UpdateLocationUserApiResponse> {
    return this.dal.put(`location/${encodeURIComponent(locationId.toString())}/users`, user);
  }

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
