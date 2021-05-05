import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * How to aggregate / split the location energy usage data
 */
export enum EnergyUsageDataAggregation {
  DontSplit = 0,
  SplitByHour = 1,
  SplitByDay = 2,
  SplitByMonth = 3,
  SplitBySundayToSaturday = 4,
  SplitByMondayToFridayThenWeekend = 5,
  SplitByUserUtilityBillingPeriod = 7
}

/**
 * Define the preference for internal vs. external location energy usage data sources.
 */
export enum LocationEnergyUsageDataSourceType {
  PreferExternallyUploaded = 0,
  PreferInternallyGenerated = 1,
  ReturnOnlyExternallyUploaded = 2,
  ReturnOnlyInternallyGenerated = 3,
  ReturnBothInternalAndExternal = 4
}

export interface GetEnergyUsageForLocationApiResponse extends ApiResponseBase {
  usages: Array<{
    startDate: string;
    startDateMs: number;
    endDate: string;
    endDateMs: number;
    energy: string;
    cost: string;
    external: boolean;
  }>;
}
