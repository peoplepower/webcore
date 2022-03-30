import { TrendName } from "./trendsMetadataLocationState";

export type TrendsCategoryLocationState = {
  [trendName in TrendCategoryName]?: TrendCategory;
};

export type TrendCategoryName = string;

export interface TrendCategory {
  /**
   * Name of the category
   */
  title: string;

  /**
   * Description of the category
   */
  description: string;

  /**
   * Main trend for category
   */
  primary_trend: TrendName;

  /**
   * Title of the primary trend
   */
  primary_trend_title: string;

  /**
   * Additional trends associated with category
   */
  sub_trends?: TrendName[];
}
