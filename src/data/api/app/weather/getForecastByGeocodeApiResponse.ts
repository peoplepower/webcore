import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Units for measurements, default value is "Metric".
 */
export enum Units {
  English = 'e',
  Metric = 'm',
  Hybrid = 'h', //UK
  MetricSI = 's' //Not available for all APIs
}

/**
 * Forecast depth in hours.
 * Available values are: 6, 12, 24, 48.
 * Default value is 24.
 */
export enum ForecastDepth {
  TwoDays = 48, //In hours
  OneDay = 24,
  HalfDay = 12,
  QuarterDay = 6
}

export interface GetForecastApiResponse extends ApiResponseBase {
  weather: {
    metadata: {
      language: string;
      transaction_id: string;
      version: string;
      latitude: number;
      longitude: number;
      units: string;
      expire_time_gmt: number;
      status_code: number;
    },
    forecasts: Array<{
      class: string;
      expire_time_gmt: number;
      fcst_valid: number;
      fcst_valid_local: string;
      num: number;
      day_ind: string;
      temp: number;
      dewpt: number;
      hi: number;
      wc: number;
      feels_like: number;
      icon_extd: number;
      wxman: string;
      icon_code: number;
      dow: string;
      phrase_12char: string;
      phrase_22char: string;
      phrase_32char: string;
      subphrase_pt1: string;
      subphrase_pt2: string;
      subphrase_pt3: string;
      pop: number;
      precip_type: string;
      qpf: number;
      snow_qpf: number;
      rh: number;
      wspd: number;
      wdir: number;
      wdir_cardinal: string;
      gust: string;
      clds: number;
      vis: number;
      mslp: number;
      uv_index_raw: number;
      uv_index: number;
      uv_warning: number;
      uv_desc: string;
      golf_index: number;
      golf_category: string;
      severity: number;
    }>;
  }
}

export interface GetForecastByGeocodeApiResponse extends GetForecastApiResponse {

}
