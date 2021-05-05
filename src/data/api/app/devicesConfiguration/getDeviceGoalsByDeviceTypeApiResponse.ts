import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetDeviceGoalsByDeviceTypeApiResponse extends ApiResponseBase {
  goals: Array<{
    /**
     * Goal ID
     */
    id: number;
    /**
     * Goal name
     */
    name: string;
    /**
     * Goal description including installation instructions
     */
    desc: string;
    /**
     * A comma-separated list of goal categories:
     * E - energy
     * S - security
     * C - care
     * L - lifestyle
     * H - health
     * W - wellness
     */
    categories: string;
    /**
     * Number of active devices, which use this goal
     */
    deviceUsage: number;
  }>;
}
