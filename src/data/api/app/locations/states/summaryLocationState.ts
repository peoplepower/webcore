/**
 * The summary state variable assists user interfaces by providing snapshots
 *  of 'scores' back in time which rank how well this location is doing or
 *  was doing. It can also include a 'badge' which may notify a person to pay
 *  more attention to this location, plus methods to clear or set ("Mark as
 *  unread") that badge.
 *
 * These location summaries are used when loading a list of locations where
 *  we want to identify the location we should focus human attention upon.
 */
export type SummaryLocationState = {

  /**
   * Show notification badge or not
   */
  badge: LocationSummaryBadgeStatus;

  /**
   * Show notification (unread) badge for narratives created after this date.
   */
  badgeDate: string;

  /**
   * Show notification (unread) badge for narratives created after this date.
   */
  badgeDateMs: number;

  /**
   * Latest snapshot
   */
  now: {
    value: number;
    diff: number; // Not sure, but it seems `diff` is always 0 for `now`
  },

  /**
   * 7-day averaged trends from the past 7-days
   */
  0?: LocationSummaryAverageTrend;

  /**
   * 7-day averaged trends from 15 days ago
   */
  15?: LocationSummaryAverageTrend;

  /**
   * 7-day averaged trends from 30 days ago
   */
  30?: LocationSummaryAverageTrend;

  /**
   * 7-day averaged trends from 45 days ago
   */
  45?: LocationSummaryAverageTrend;

  /**
   * 7-day averaged trends from 60 days ago
   */
  60?: LocationSummaryAverageTrend;

  /**
   * 7-day averaged trends from 90 days ago
   */
  90?: LocationSummaryAverageTrend;
};

export enum LocationSummaryBadgeStatus {
  NoNotification = 0,
  ShowNotification = 1
}

export interface LocationSummaryAverageTrend {
  value: {
    /**
     * Average value
     */
    avg: number;

    /**
     * Standard deviation
     */
    std: number;

    /**
     * Number of measurements that went into the average and standard deviation
     */
    n: number;
  },

  /**
   * Rounded difference between the latest snapshot and this past value
   */
  diff: number;
}
