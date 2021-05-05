import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetLocationPrioritiesApiResponse extends ApiResponseBase {
  priorities: Array<{
    /**
     * Priority category
     */
    category: number;

    /**
     * Priority rank
     */
    rank?: number;

    /**
     * Date of the record
     */
    changeDate: string;
    changeDateMs: number;

    /**
     * Priority comment
     */
    comment?: string;

    /**
     * Bot instance ID and bundle who changed priority
     */
    appInstanceId?: number;
    bundle?: string;

    /**
     * User ID who changed priority
     */
    userId?: number;
  }>
}
