import { WeatherApi } from '../api/app/weather/weatherApi';
import { inject, injectable } from '../../modules/common/di';
import { GetCurrentWeatherApiResponse } from '../api/app/weather/getCurrentWeatherByGeocodeApiResponse';
import { UserService } from './userService';
import { Logger } from '../../modules/logger/logger';

@injectable('WeatherService')
export class WeatherService {
  @inject('WeatherApi') protected readonly weatherApi!: WeatherApi;
  @inject('UserService') protected readonly userService!: UserService;
  @inject('Logger') private readonly logger!: Logger;

  constructor() {
  }

  /**
   * Get weather info for current user location
   * @returns {Promise<WeatherResponse>}
   */
  public getCurrentUserWeather(): Promise<WeatherResponse> {
    return this.userService.getCurrentUserInfo().then((userInfo) => {
      if (!userInfo || !userInfo.locations || !userInfo.locations[0]) {
        return Promise.reject('User has no location assigned!');
      }
      let location = userInfo.locations[0];
      let lat = Number(location.latitude);
      let lng = Number(location.longitude);
      if (!lat || !lng) {
        return Promise.reject('User location has no lat/lng coordinates assigned!');
      }
      return this.weatherApi.getCurrentWeatherByGeocode(lat, lng).then((response) => {
        return response as WeatherResponse;
      });
    });
  }
}

export interface WeatherResponse extends GetCurrentWeatherApiResponse {
}
