import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetCurrentWeatherApiResponse extends ApiResponseBase {
  weather: {
    metadata: {
      language: string;
      transaction_id: string;
      version: number;
      latitude: number;
      longitude: number;
      units: string;
      expire_time_gmt: number;
      status_code: number;
    };
    observation: {
      class: string;
      expire_time_gmt: number;
      obs_time: number;
      obs_time_local: string;
      wdir: number;
      icon_code: number;
      icon_extd: number;
      sunrise: string;
      sunset: string;
      day_ind: string;
      uv_index: number;
      uv_warning: number;
      wxman: string;
      obs_qualifier_code: any;
      ptend_code: number;
      dow: string;
      wdir_cardinal: string;
      uv_desc: string;
      phrase_12char: string;
      phrase_22char: string;
      phrase_32char: string;
      ptend_desc: string;
      sky_cover: string;
      clds: string;
      obs_qualifier_severity: any;
      vocal_key: string;
      metric: {
        wspd: number;
        gust: any;
        vis: number;
        mslp: number;
        altimeter: number;
        temp: number;
        dewpt: number;
        rh: number;
        wc: number;
        hi: number;
        temp_change_24hour: number;
        temp_max_24hour: number;
        temp_min_24hour: number;
        pchange: number;
        feels_like: number;
        snow_1hour: number;
        snow_6hour: number;
        snow_24hour: number;
        snow_mtd: any;
        snow_season: any;
        snow_ytd: any;
        snow_2day: any;
        snow_3day: any;
        snow_7day: any;
        ceiling: any;
        precip_1hour: number;
        precip_6hour: number;
        precip_24hour: number;
        precip_mtd: any;
        precip_ytd: any;
        precip_2day: any;
        precip_3day: any;
        precip_7day: any;
        obs_qualifier_100char: any;
        obs_qualifier_50char: any;
        obs_qualifier_32char: any;
      };
    };
  };
}

export interface GetCurrentWeatherByGeocodeApiResponse extends GetCurrentWeatherApiResponse {
}
