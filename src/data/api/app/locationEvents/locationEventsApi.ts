import { AppApiDal } from '../appApiDal';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { inject, injectable } from '../../../../modules/common/di';
import {
  CreateOrUpdateNarrativeApiResponse,
  CreateOrUpdateNarrativeModel,
  NarrativePriority,
  NarrativeScope,
  NarrativeStatus,
} from './createOrUpdateNarrativeApiResponse';
import { GetNarrativesApiResponse, NarrativeType } from './getNarrativesApiResponse';
import { GetLocationStateApiResponse, LocationStateName } from './getLocationStateApiResponse';
import { SetLocationStateApiResponse, SetLocationStateModel } from './setLocationStateApiResponse';
import { GetLocationTimeStateApiResponse, LocationTimeStateAggregation } from './getLocationTimeStateApiResponse';
import { EscalationPriority, EscalationStatus, EscalationType, GetEscalationsApiResponse } from './getEscalationsApiResponse';
import { UpdateEscalationModel } from './updateEscalationApiResponse';

/**
 * Location Events API.
 * Covers location narratives, location states / time states and escalations.
 * See {@link https://iotapps.docs.apiary.io/#reference/locations}
 */
@injectable('LocationEventsApi')
export class LocationEventsApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

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
  * @param {number} [params.escalationId] Filter by escalation ID.
   * @param {NarrativePriority} [params.priority] Filter by priority higher or equal than that.
   * @param {NarrativePriority} [params.toPriority] Filter by priority less or equal than that.
   * @param {number|number[]} [params.narrativeType] Filter by narrative type(s).
   * @param {NarrativeStatus} [params.status] Filter by status, deleted are not returned by default.
   * @param {string} [params.eventType] Filter by event type.
   * @param {string} [params.searchBy] Filter by title or description. Use * for a wildcard.
   * @param {string|number} [params.startDate] Narrative date range start.
   * @param {string|number} [params.endDate] Narrative date range end date.
   * @param {string} [params.pageMarker] Marker to the next page.
   * @param {number} [params.parentId] Filter by parent narrative ID.
   * @param {string} [params.sortCollection] Sort collection.
   * @param {string} [params.sortBy] Sort order collection by specific field.
   * @param {string} [params.sortOrder] Sort order, default is 'asc'.
   * @returns {Promise<GetNarrativesApiResponse>}
   */
  getNarratives(
    locationId: number,
    params: {
      rowCount: number;
      narrativeId?: number;
      escalationId?: number;
      priority?: NarrativePriority;
      toPriority?: NarrativePriority;
      narrativeType?: NarrativeType | NarrativeType[];
      status?: NarrativeStatus;
      eventType?: string;
      searchBy?: string;
      startDate?: string | number;
      endDate?: string | number;
      pageMarker?: string;
      parentId?: number;
      sortCollection?: string;
      sortBy?: string;
      sortOrder?: string;
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
   * @param {LocationStateName|LocationStateName[]} name State name, multiple values supported.
   * @returns {Promise<GetLocationStateApiResponse>}
   */
  getLocationState(locationId: number, name: LocationStateName | LocationStateName[]): Promise<GetLocationStateApiResponse> {
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

  // #region ------------------- Location Escalations -------------------

  /**
   * Get escalations.
   * Select escalations by search parameters.
   * See {@link https://sboxall.peoplepowerco.com/cloud/apidocs/yaml/cloud.yaml} (Location Events / Get Escalations)
   *
   * @param params Request parameters.
   * @param {number} [params.locationId] Location ID. Required for end-users or if the organizationId parameter is not provided.
   * @param {number} [params.organizationId] Organization ID. For admins only. Required if the locationId parameter is not provided.
   * @param {number} [params.escalationId] Escalation ID.
   * @param {string|number} [params.startDate] Search start date and time. Required if the escalationId parameter is not provided.
   * @param {string|number} [params.endDate] Search end date and time.
   * @param {EscalationStatus|EscalationStatus[]} [params.status] Escalation statuses. Multiple values supported.
   * @param {EscalationType|EscalationType[]} [params.escalationType] Escalation types. Multiple values supported.
   * @param {EscalationPriority|EscalationPriority[]} [params.priority] Priorities. Multiple values supported.
   * @param {string} [params.sortCollection] Sort collection.
   * @param {string} [params.sortBy] Sort collection by specific field.
   * @param {string} [params.sortOrder] Sort order, default is 'asc'.
   * @param {string} [analyticKey] Optional Bot Api key.
   * @returns {Promise<GetEscalationsApiResponse>}
   */
  getEscalations(
    params: {
      locationId?: number;
      organizationId?: number;
      escalationId?: number;
      startDate?: string | number;
      endDate?: string | number;
      status?: EscalationStatus | EscalationStatus[];
      escalationType?: EscalationType | EscalationType[];
      priority?: EscalationPriority | EscalationPriority[];
      sortCollection?: string;
      sortBy?: string;
      sortOrder?: string;
    },
    analyticKey?: string,
  ): Promise<GetEscalationsApiResponse> {
    return this.dal.get('escalations', {
      params: params,
      headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
    });
  }

  /**
   * Update escalation.
   * Update an escalation status and related fields.
   * See {@link https://sboxall.peoplepowerco.com/cloud/apidocs/yaml/cloud.yaml} (Location Events / Update Escalation)
   *
   * @param {number} locationId Location ID.
   * @param {number} escalationId Escalation ID.
   * @param {UpdateEscalationModel} model Escalation fields to update.
   * @param {string} [analyticKey] Optional Bot Api key.
   * @returns {Promise<ApiResponseBase>}
   */
  updateEscalation(locationId: number, escalationId: number, model: UpdateEscalationModel, analyticKey?: string): Promise<ApiResponseBase> {
    return this.dal.put('escalations', model, {
      params: {
        locationId: locationId,
        escalationId: escalationId,
      },
      headers: analyticKey ? {ANALYTIC_API_KEY: analyticKey} : {},
    });
  }

  // #endregion
}
