import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { AuthService } from './authService';
import { LocationsApi } from '../api/app/locations/locationsApi';
import {
  CreateOrUpdateNarrativeApiResponse,
  CreateOrUpdateNarrativeModel,
  NarrativePriority,
  NarrativeScope,
} from '../api/app/locations/createOrUpdateNarrativeApiResponse';
import { ApiResponseBase } from '../models/apiResponseBase';
import { GetNarrativesApiResponse, NarrativeType } from '../api/app/locations/getNarrativesApiResponse';

@injectable('NarrativeService')
export class NarrativeService extends BaseService {
  @inject('AuthService') protected readonly authService: AuthService;
  @inject('LocationsApi') protected readonly locationsApi: LocationsApi;

  /**
   * Create narrative. When a new narrative is created, the API returns the new record ID and narrativeTime in milliseconds.
   * But narrative time is always truncated to seconds by the API.
   * @param {number} locationId
   * @param {NarrativeScope} scope
   * @param {CreateOrUpdateNarrativeModel} narrative
   * @returns {Promise<NarrativeInfo>}
   */
  public createNarrative(
    locationId: number,
    scope: NarrativeScope,
    narrative: CreateOrUpdateNarrativeModel,
  ): Promise<NarrativeInfo> {
    return this.locationsApi.createOrUpdateNarrative(
      locationId,
      narrative,
      {
        scope: scope,
      },
    );
  }

  /**
   * Update Narrative. To update an existing narrative record both narrativeId and narrativeTime query parameters must be provided. The new value of
   * narrativeTime in milliseconds will be returned, if it has been changed.
   * @param {number} locationId
   * @param {NarrativeScope} scope
   * @param {CreateOrUpdateNarrativeModel} narrative
   * @param {number} narrativeId
   * @param {number} narrativeTime
   * @returns {Promise<NarrativeInfo>}
   */
  public updateNarrative(
    locationId: number,
    scope: NarrativeScope,
    narrative: CreateOrUpdateNarrativeModel,
    narrativeId: number,
    narrativeTime: number,
  ): Promise<NarrativeInfo> {
    return this.locationsApi.createOrUpdateNarrative(
      locationId,
      narrative,
      {
        scope: scope,
        narrativeId: narrativeId,
        narrativeTime: narrativeTime,
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
  public deleteNarrative(
    locationId: number,
    scope: NarrativeScope,
    narrativeId: number,
    narrativeTime: number,
  ): Promise<ApiResponseBase> {
    return this.locationsApi.deleteNarrative(
      locationId,
      {
        scope: scope,
        narrativeId: narrativeId,
        narrativeTime: narrativeTime,
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
   * @param params Request parameters
   * @param {number} params.rowCount Maximum number of elements per page
   * @param {number} [params.narrativeId] Filter by Narrative ID
   * @param {NarrativePriority} [params.priority] Filter by priority higher or equal than that
   * @param {NarrativePriority} [params.toPriority] Filter by priority less or equal than that
   * @param {NarrativeType | Array<NarrativeType>} [params.narrativeType] Filter by narrative type, multiple values allowed
   * @param {string} [params.searchBy] Filter by title or description. Use * for a wildcard.
   * @param {string} [params.startDate] Narrative date range start
   * @param {string} [params.endDate] Narrative date range end
   * @param {string} [params.pageMarker] Marker to the next page
   * @returns {Promise<GetNarrativesApiResponse>}
   */
  public getNarratives(locationId: number,
                       params: {
                         rowCount: number,
                         narrativeId?: number,
                         priority?: NarrativePriority,
                         toPriority?: NarrativePriority,
                         narrativeType?: NarrativeType | Array<NarrativeType>
                         searchBy?: string,
                         startDate?: string,
                         endDate?: string,
                         pageMarker?: string
                       }): Promise<NarrativesSearchResult> {
    return this.locationsApi.getNarratives(locationId, params);
  }

}

export interface NarrativeInfo extends CreateOrUpdateNarrativeApiResponse {
}

export interface NarrativesSearchResult extends GetNarrativesApiResponse {
}


