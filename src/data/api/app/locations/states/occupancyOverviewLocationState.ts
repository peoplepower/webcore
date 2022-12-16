/**
 * Location state indicating location Occupancy Status (Absent Status).
 * Possible statuses: PRESENT, ABSENT or VACATION
 */
export type OccupancyOverviewLocationState = {
  /**
   * Indicate if status was overridden by API call
   */
  override?: boolean;

  /**
   * Start date in ms format
   */
  startDate?: number;

  /**
   * Location Occupancy Status. One of three values: PRESENT, ABSENT or VACATION
   */
  status: string;
};
