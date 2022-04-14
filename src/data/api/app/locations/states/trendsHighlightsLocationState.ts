import { TrendCategoryName } from "./trendsCategoryLocationState";

export type TrendsHighlightsLocationState = {
  /**
   * Most common values are '0', '15', '30', '45', '60', '90'
   */
  [groupName: string]: {
    [trendName: string]: TrendHighlight;
  };
  now: {
    [trendName: string]: TrendCategoryHighlight;
  };
}

export interface TrendCategoryHighlight {
  trend_category?: TrendCategoryName;
  value?: number;
  zscore?: number;
  avg?: number;
  std?: number;
  updated_ms: number;
}

export interface TrendHighlight {
  avg?: number;
  n?: number;
  std?: number;
}
