import { ApiResponseBase } from '../../../models/apiResponseBase';
import { DashboardHeaderLocationState } from "./states/dashboardHeaderLocationState";
import { TasksLocationState } from "./states/tasksLocationState";
import { BehaviorsLocationState } from "./states/behaviorsLocationState";
import { ServicesLocationState } from "./states/servicesLocationState";
import { NowLocationState } from "./states/nowLocationState";
import { TrendsMetadataLocationState } from "./states/trendsMetadataLocationState";
import { TrendsCategoryLocationState } from "./states/trendsCategoryLocationState";
import { TrendsHighlightsLocationState } from "./states/trendsHighlightsLocationState";

export interface GetLocationStateApiResponse extends ApiResponseBase {
  /**
   * If just one state requested
   */
  value?: LocationStateValue<LocationStateName>;

  /**
   * If multiple states requested
   */
  states?: Array<LocationStateListEntry<LocationStateName>>;
}

export interface LocationStateListEntry<T extends LocationStateName> {
  name: T;
  value: LocationStateValue<T>;
}

export type LocationStateName = 'dashboard_header'
  | 'tasks'
  | 'behaviors'
  | 'services'
  | 'now'
  | 'trends_metadata'
  | 'trends_category'
  | 'trends_highlights'
  | string;

export type LocationStateValue<T extends LocationStateName> =
  T extends 'dashboard_header' ? DashboardHeaderLocationState : never
    | T extends 'tasks' ? TasksLocationState : never
    | T extends 'behaviors' ? BehaviorsLocationState : never
    | T extends 'services' ? ServicesLocationState : never
    | T extends 'now' ? NowLocationState : never
    | T extends 'trends_metadata' ? TrendsMetadataLocationState : never
    | T extends 'trends_category' ? TrendsCategoryLocationState : never
    | T extends 'trends_highlights' ? TrendsHighlightsLocationState : never
    | Object;
