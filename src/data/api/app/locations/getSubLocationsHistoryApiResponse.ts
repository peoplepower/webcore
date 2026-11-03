import { ApiResponseBase } from '../../../models/apiResponseBase';
import { FileUploadPolicy, LocationPriorityCategory } from '../userAccounts/getUserInformationApiResponse';
import { LocationSubType, LocationType } from './editLocationApiResponse';

export enum SubLocationEndReason {
  ExistingRelationExtended = 1,
  ParentLocationDeleted = 2,
  ChildLocationDeleted = 3,
  RequestedDirectly = 4,
  ResidentDischarged = 5,
  ResidentTransfered = 6,
}

export interface SubLocationInfo {
  id: number;
  name?: string;

  /**
   * Organization ID.
   */
  organizationId?: number;

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
   * The last user in location status like HOME, AWAY, SLEEP, VACATION, etc.
   * It is used in analytic rules.
   */
  event: string;

  /**
   * Location priority category
   * @type {number}
   */
  priorityCategory?: LocationPriorityCategory;
  priorityRank?: number;
  priorityComment?: string;

  /**
   * Location's preferred language.
   */
  language: string;

  /**
   * Location file storage policy.
   */
  fileUploadPolicy: FileUploadPolicy | number;

  /**
   * Test location flag.
   */
  test?: boolean;
}

export interface GetSubLocationsHistoryApiResponse extends ApiResponseBase {
  locations?: Array<{

    /**
     * Association start date.
     */
    startDate: string;
    startDateMs: number;

    /**
     * Association end date.
     */
    endDate?: string;
    endDateMs?: number;

    /**
     * Association end reason.
     */
    endReason?: SubLocationEndReason;

    /**
     * Associated location details.
     */
    location: SubLocationInfo;
  }>;
}
