import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { ForecastDepth, GetForecastByGeocodeApiResponse, Units } from './getForecastByGeocodeApiResponse';
import { GetForecastByLocationApiResponse } from './getForecastByLocationApiResponse';
import { GetCurrentWeatherByGeocodeApiResponse } from './getCurrentWeatherByGeocodeApiResponse';
import { GetCurrentWeatherByLocationApiResponse } from './getCurrentWeatherByLocationApiResponse';

/**
 * These API's are avaialabe for certain organizations only.
 * See {@link http://docs.iotapps.apiary.io/#reference/weather}
 */
@injectable('WeatherApi')
export class WeatherApi {
  @inject('AppApiDal') protected readonly dal: AppApiDal;

  /**
   * Retrieve weather forecust at certain point by latitude and longitude.
   * See {@link http://docs.iotapps.apiary.io/#reference/weather/forecast-by-geocode/get-forecast-by-geocode}
   *
   * @param {number} latitude Latitude.
   * @param {number} longitude Longitude.
   * @param [params] Request parameters.
   * @param {Units} [params.units] Units for measurements, default value is "Metric".
   * @param {ForecastDepth} [params.hours] Forecast depth in hours.
   * @param {number} [params.organizationId] For specific organization. Used by administrator only.
   * @returns {Promise<GetForecastByGeocodeApiResponse>}
   */
  getForecastByGeocode(
    latitude: number,
    longitude: number,
    params?: {
      units?: Units;
      hours?: ForecastDepth;
      organizationId?: number;
    },
  ): Promise<GetForecastByGeocodeApiResponse> {
    return this.dal.get(`weather/forecast/geocode/${encodeURIComponent(latitude.toString())}/${encodeURIComponent(longitude.toString())}`, {
      params: params,
    });
  }

  /**
   * Retrieve weather forecast by the location address.
   * See {@link http://docs.iotapps.apiary.io/#reference/weather/forecast-by-location/get-forecast-by-location}
   *
   * @param {number} locationId ID of location to get forecast for
   * @param [params] Request parameters
   * @param {Units} [params.units] Units for measurements, default value is "Metric".
   * @param {ForecastDepth} [params.hours] Forecast depth in hours.
   * @param {number} [params.organizationId] For specific organization. Used by administrator only.
   * @returns {Promise<GetForecastByLocationApiResponse>}
   */
  getForecastByLocation(locationId: number, params?: { units?: Units; hours?: ForecastDepth }): Promise<GetForecastByLocationApiResponse> {
    return this.dal.get(`weather/forecast/location/${encodeURIComponent(locationId.toString())}`, { params: params });
  }

  /**
   * Retrieve current weather at certain point by latitude and longitude.
   * See {@link http://docs.iotapps.apiary.io/#reference/weather/current-weather-by-geocode/get-current-weather-by-geocode}
   *
   * @param {number} latitude Latitude
   * @param {number} longitude Longitude
   * @param [params] Request parameters
   * @param {Units} [params.units] Units for measurements, default value is "Metric".
   * @param {number} [params.organizationId] For specific organization. Used by administrator only.
   * @returns {Promise<GetCurrentWeatherByGeocodeApiResponse>}
   */
  getCurrentWeatherByGeocode(
    latitude: number,
    longitude: number,
    params?: {
      units?: Units;
      organizationId?: number;
    },
  ): Promise<GetCurrentWeatherByGeocodeApiResponse> {
    return this.dal.get(`weather/current/geocode/${encodeURIComponent(latitude.toString())}/${encodeURIComponent(longitude.toString())}`, {
      params: params,
    });
  }

  /**
   * Retrieve current weather at the specific location.
   * See {@link http://docs.iotapps.apiary.io/#reference/weather/current-weather-by-location/get-current-weather-by-location}
   *
   * @param {number} locationId ID of location to get forecast for
   * @param [params] Request parameters
   * @param {Units} [params.units] Units for measurements, default value is "Metric".
   * @returns {Promise<GetCurrentWeatherByLocationApiResponse>}
   */
  getCurrentWeatherByLocation(locationId: number, params?: { units?: Units }): Promise<GetCurrentWeatherByLocationApiResponse> {
    return this.dal.get(`weather/current/location/${encodeURIComponent(locationId.toString())}`, { params: params });
  }
}
