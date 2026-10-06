import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { AuthService } from './authService';
import { LocationEventsApi } from '../api/app/locationEvents/locationEventsApi';
import {
  CreateOrUpdateNarrativeApiResponse,
  CreateOrUpdateNarrativeModel,
  NarrativePriority,
  NarrativeScope,
  NarrativeStatus,
} from '../api/app/locationEvents/createOrUpdateNarrativeApiResponse';
import { ApiResponseBase } from '../models/apiResponseBase';
import { GetNarrativesApiResponse, NarrativeType } from '../api/app/locationEvents/getNarrativesApiResponse';
import {
  EscalationPriority,
  EscalationStatus,
  EscalationType,
  GetEscalationsApiResponse,
} from '../api/app/locationEvents/getEscalationsApiResponse';
import { UpdateEscalationModel } from '../api/app/locationEvents/updateEscalationApiResponse';

/**
 * Events Service.
 * Location events: narratives and escalations.
 */
@injectable('EventsService')
export class EventsService extends BaseService {
  @inject('AuthService') protected readonly authService!: AuthService;
  @inject('LocationEventsApi') protected readonly locationEventsApi!: LocationEventsApi;

  // #region ------------------------- Narratives -------------------------

  /**
   * Create narrative. When a new narrative is created, the API returns the new record ID and narrativeTime in milliseconds.
   * But narrative time is always truncated to seconds by the API.
   * @param {number} locationId
   * @param {NarrativeScope} scope
   * @param {CreateOrUpdateNarrativeModel} narrative
   * @returns {Promise<CreateOrUpdateNarrativeApiResponse>}
   */
  public createNarrative(locationId: number, scope: NarrativeScope, narrative: CreateOrUpdateNarrativeModel): Promise<CreateOrUpdateNarrativeApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationEventsApi.createOrUpdateNarrative(locationId, narrative, {
        scope: scope,
      });
    });
  }

  /**
   * Update Narrative. To update an existing narrative record both narrativeId and narrativeTime query parameters must be provided. The new value of
   * narrativeTime in milliseconds will be returned, if it has been changed.
   * @param {number} locationId
   * @param {NarrativeScope} scope
   * @param {CreateOrUpdateNarrativeModel} narrative
   * @param {number} narrativeId
   * @param {number} narrativeTime
   * @returns {Promise<CreateOrUpdateNarrativeApiResponse>}
   */
  public updateNarrative(
    locationId: number,
    scope: NarrativeScope,
    narrative: CreateOrUpdateNarrativeModel,
    narrativeId: number,
    narrativeTime: number,
  ): Promise<CreateOrUpdateNarrativeApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (narrativeId < 1 || isNaN(narrativeId)) {
      return this.reject(`Narrative ID is incorrect [${narrativeId}].`);
    }
    if (narrativeTime < 1 || isNaN(narrativeTime)) {
      return this.reject(`Narrative time is incorrect [${narrativeTime}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationEventsApi.createOrUpdateNarrative(locationId, narrative, {
        scope: scope,
        narrativeId: narrativeId,
        narrativeTime: narrativeTime,
      });
    });
  }

  /**
   * Delete a narrative.
   * @param {number} locationId Location ID
   * @param {number} narrativeId ID of narrative to delete
   * @param {NarrativeScope} scope Narrative Scope (Location = 1, Organization = 2)
   * @param {number} narrativeTime Narrative time in milliseconds
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteNarrative(locationId: number, scope: NarrativeScope, narrativeId: number, narrativeTime: number): Promise<ApiResponseBase> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (narrativeId < 1 || isNaN(narrativeId)) {
      return this.reject(`Narrative ID is incorrect [${narrativeId}].`);
    }
    if (narrativeTime < 1 || isNaN(narrativeTime)) {
      return this.reject(`Narrative time is incorrect [${narrativeTime}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationEventsApi.deleteNarrative(locationId, {
        scope: scope,
        narrativeId: narrativeId,
        narrativeTime: narrativeTime,
      });
    });
  }

  /**
   * Search Narratives.
   *
   * The search results are organized by "pages". Each page contains a set of elements sorted by the 'narrativeTime' in descending order. The pages follow one
   * another in reverse chronological order.
   *
   * The rowCount parameter specifies the maximum number of elements per page. The result may include the "nextMarker" property - this means that there are
   * more pages for the current search criteria. To get the next page, the value of "nextMarker" must be passed to the "pageMarker" parameter on the next API
   * call.
   *
   * See {@link https://iotapps.docs.apiary.io/#reference/user-accounts/narratives/get-narratives}
   *
   * @param {number} locationId Location ID.
   * @param params Request parameters.
   * @param {number} params.rowCount Maximum number of elements per page.
   * @param {number} [params.narrativeId] Filter by Narrative ID.
   * @param {number} [params.escalationId] Filter by Escalation ID.
   * @param {number} [params.parentId] Filter by parent Narrative ID.
   * @param {NarrativePriority} [params.priority] Filter by priority higher or equal than that.
   * @param {NarrativePriority} [params.toPriority] Filter by priority less or equal than that.
   * @param {NarrativeType | Array<NarrativeType>} [params.narrativeType] Filter by narrative type, multiple values allowed.
   * @param {NarrativeStatus} [params.status] Filter by narrative status.
   * @param {string} [params.eventType] Filter by event type.
   * @param {string} [params.searchBy] Filter by title or description. Use * for a wildcard.
   * @param {string|number} [params.startDate] Narrative date range start.
   * @param {string|number} [params.endDate] Narrative date range end.
   * @param {string} [params.pageMarker] Marker to the next page.
   * @param {string} [params.sortCollection] Sort collection by field. Use 'narratives' to sort by fields.
   * @param {string} [params.sortBy] Sort collection by specific field.
   * @param {string} [params.sortOrder] Sort order. Default is 'asc'.
   * @returns {Promise<GetNarrativesApiResponse>}
   */
  public getNarratives(
    locationId: number,
    params: {
      rowCount: number;
      narrativeId?: number;
      escalationId?: number;
      parentId?: number;
      priority?: NarrativePriority;
      toPriority?: NarrativePriority;
      narrativeType?: NarrativeType | Array<NarrativeType>;
      status?: NarrativeStatus;
      eventType?: string;
      searchBy?: string;
      startDate?: string | number;
      endDate?: string | number;
      pageMarker?: string;
      sortCollection?: string;
      sortBy?: string;
      sortOrder?: string;
    },
  ): Promise<GetNarrativesApiResponse> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationEventsApi.getNarratives(locationId, params);
    });
  }

  // #endregion

  // #region ------------------------ Escalations ------------------------

  /**
   * Get escalations by search parameters.
   * Either locationId or organizationId must be provided. Either escalationId or startDate must be provided.
   *
   * @param params Request parameters.
   * @param {number} [params.locationId] Location ID. Required for end-users or if organizationId is not provided.
   * @param {number} [params.organizationId] Organization ID. For admins only. Required if locationId is not provided.
   * @param {number} [params.escalationId] Escalation ID.
   * @param {string|number} [params.startDate] Search start date and time. Required if escalationId is not provided.
   * @param {string|number} [params.endDate] Search end date and time.
   * @param {EscalationStatus|EscalationStatus[]} [params.status] Filter by escalation status(es).
   * @param {EscalationType|EscalationType[]} [params.escalationType] Filter by escalation type(s).
   * @param {EscalationPriority|EscalationPriority[]} [params.priority] Filter by priority(ies).
   * @param {string} [params.sortCollection] Sort collection by field. Use 'escalations' to sort by fields.
   * @param {string} [params.sortBy] Sort collection by specific field.
   * @param {string} [params.sortOrder] Sort order. Default is 'asc'.
   * @returns {Promise<GetEscalationsApiResponse>}
   */
  public getEscalations(params: {
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
  }): Promise<GetEscalationsApiResponse> {
    if (params.locationId == null && params.organizationId == null) {
      return this.reject('Either location ID or organization ID must be provided.');
    }
    if (params.escalationId == null && params.startDate == null) {
      return this.reject('Either escalation ID or startDate must be provided.');
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationEventsApi.getEscalations(params);
    });
  }

  /**
   * Update an escalation status and related fields.
   *
   * @param {number} locationId Location ID.
   * @param {number} escalationId Escalation ID.
   * @param {UpdateEscalationModel['escalation']} escalation Escalation fields to update.
   * @returns {Promise<ApiResponseBase>}
   */
  public updateEscalation(locationId: number, escalationId: number, escalation: UpdateEscalationModel['escalation']): Promise<ApiResponseBase> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (escalationId < 1 || isNaN(escalationId)) {
      return this.reject(`Escalation ID is incorrect [${escalationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.locationEventsApi.updateEscalation(locationId, escalationId, {escalation: escalation});
    });
  }

  // #endregion
}
