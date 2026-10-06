import { TrendCategoryName } from "./trendsCategoryLocationState";
import { TrendName } from "./trendsMetadataLocationState";

export type TrendsHighlightsLocationState = {
  /**
   * 7-day averaged trends from the past 7-days
   */
  0?: TrendsAverageHighlights;

  /**
   * 7-day averaged trends from 15 days ago
   */
  15?: TrendsAverageHighlights;

  /**
   * 7-day averaged trends from 30 days ago
   */
  30?: TrendsAverageHighlights;

  /**
   * 7-day averaged trends from 45 days ago
   */
  45?: TrendsAverageHighlights;

  /**
   * 7-day averaged trends from 60 days ago
   */
  60?: TrendsAverageHighlights;

  /**
   * 7-day averaged trends from 90 days ago
   */
  90?: TrendsAverageHighlights;

  /**
   * Latest snapshot
   */
  now?: TrendsNowAverageHighlights;
}

export type TrendsAverageHighlights = {
  [trendName in TrendName]: TrendHighlight;
};

export type TrendsNowAverageHighlights = {
  [trendName in TrendName]: TrendNowHighlight;
};

export interface TrendHighlight {
  /**
   * Average value
   */
  avg?: number;

  /**
   * Number of measurements that went into the average and standard deviation
   */
  n?: number;

  /**
   * Standard deviation
   */
  std?: number;
}

export interface TrendNowHighlight {
  /**
   * Category of the trend
   */
  trend_category?: TrendCategoryName;

  /**
   * The newest value captured, pre-processed based on the applied operation
   */
  value?: number;

  /**
   * Z-Score of the current value relative to the historical data set.
   *  This is used to describe where the newest value is relative to the standard deviations
   */
  zscore?: number;

  /**
   * Average value
   */
  avg?: number;

  /**
   * Standard deviation
   */
  std?: number;

  /**
   * Last update date
   */
  updated_ms: number;
}
