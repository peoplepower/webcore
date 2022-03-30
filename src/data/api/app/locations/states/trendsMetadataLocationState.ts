import { TrendCategoryName } from "./trendsCategoryLocationState";

export type TrendsMetadataLocationState = {
  [trendName in TrendName]?: TrendMetadata;
};

export type TrendName = string;


export interface TrendMetadata {
  /**
   * Category ID for this trend.
   * Now non-hidden trends could not live without category
   */
  category?: TrendCategoryName,

  title: string;
  comment: string;
  units: string;

  /**
   * Set to 'true' if trend should be hidden from UI
   */
  hidden?: boolean;

  /**
   * Optional, trends may have additional hierarchy within own category (not used now)
   */
  parent_id?: TrendName;

  daily: boolean;
  icon: string;
  operation: number;
  services: string[];
  updated_ms: number;
  window: number;
}
