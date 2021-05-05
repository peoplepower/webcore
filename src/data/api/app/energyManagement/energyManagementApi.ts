import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import {
  EnergyUsageDataAggregation,
  GetEnergyUsageForLocationApiResponse,
  LocationEnergyUsageDataSourceType,
} from './getEnergyUsageForLocationApiResponse';
import { GetDeviceEnergyUsageApiResponse } from './getDeviceEnergyUsageApiResponse';
import { GetDeviceEnergyUsageAggregatedApiResponse } from './getDeviceEnergyUsageAggregatedApiResponse';
import { BillingInformationType, GetBillingInformationApiResponse } from './getBillingInformationApiResponse';
import { UpdateBillingInformationApiResponse, UpdateBillingInformationModel } from './updateBillingInformationApiResponse';

/**
 * Electricity customers are billed on how much energy their homes, businesses, and appliances consume. Ensemble
 * enables post-processing and analytics on energy measurements.
 * See {@link http://docs.iotapps.apiary.io/#reference/energy-management}
 */
@injectable('EnergyManagementApi')
export class EnergyManagementApi {

  @inject('AppApiDal') protected readonly dal: AppApiDal;

  /**
   * Retrieves energy usage at the specific location.
   * See {@link https://iotapps.docs.apiary.io/#reference/energy-management/get-energy-usage-for-a-location}
   *
   * @param {number} locationId Location ID for which to obtain energy measurements.
   * @param {EnergyUsageDataAggregation} aggregation How to aggregate / split the energy data.
   * @param {string} startDate Start date to begin receiving measurements, example: 2014-08-01T12:00:00-08:00.
   * @param [params] Request parameters.
   * @param {string} [params.endDate] End date to stop receiving measurements, example: 2014-08-01T13:00:00-08:00. Default is the current date.
   * @param {LocationEnergyUsageDataSourceType} [params.external] Define the preference for internal vs. external data sources.
   * @returns {Promise<GetEnergyUsageForLocationApiResponse>}
   */
  getEnergyUsageForLocation(locationId: number, aggregation: EnergyUsageDataAggregation, startDate: string,
                            params?: {
                              endDate?: string,
                              external?: LocationEnergyUsageDataSourceType
                            }): Promise<GetEnergyUsageForLocationApiResponse> {
    const locationIdEncoded = encodeURIComponent(locationId.toString());
    const aggregationEncoded = encodeURIComponent(aggregation.toString());
    const startDateEncoded = encodeURIComponent(startDate.toString());

    return this.dal.get(`locations/${locationIdEncoded}/energyUsage/${aggregationEncoded}/${startDateEncoded}`, {params: params});
  }

  /**
   * Returns a device's values of power, billing rate, its associated cost, total energy usage, and its cost for the current day, month and year.
   * See {@link http://docs.iotapps.apiary.io/#reference/energy-management/get-device-energy-usage/get-device-energy-usage}
   *
   * By default, this API returns total device values. To get the values for the specific part of a device, use an index number
   * (assuming the device supports parameters with index numbers).
   * This method uses the time zone ID from the device location to calculate values. If the time zone is not set, it uses the default server time zone.
   *
   * @param {string} deviceId Device ID for which to obtain energy-related data.
   * @param params Request parameters.
   * @param {number} params.locationId Request information on a specific location.
   * @param {string} [params.index] Optional index number to obtain energy-related data from a part of a device (assuming the device supports index numbers).
   * @returns {Promise<GetDeviceEnergyUsageApiResponse>}
   */
  getDeviceEnergyUsage(deviceId: string,
                       params?: {
                         locationId: number,
                         index?: string,
                         userId?: number
                       }): Promise<GetDeviceEnergyUsageApiResponse> {
    return this.dal.get(`devices/${encodeURIComponent(deviceId.toString())}/currentEnergyUsage`, {params: params});
  }

  /**
   * Returns energy usage at a device level for a specified period of time, and aggregated by different periods.
   * See {@link http://docs.iotapps.apiary.io/#reference/energy-management/get-device-energy-usage/get-aggregated-energy-usage-for-a-device}
   *
   * This method uses the time zone ID from the device location to calculate values. If the time zone is not set, it uses the default server time zone.
   *
   * @param {string} deviceId Device ID for which to obtain aggregated energy usage
   * @param {EnergyUsageDataAggregation} aggregation How to aggregate / split the energy data
   * @param {string} startDate Start date to begin receiving measurements, example: 2014-08-01T12:00:00-08:00
   * @param params Request parameters.
   * @param {number} params.locationId Request information on a specific location
   * @param {string} [params.endDate] End date to stop receiving measurements, example: 2014-08-01T13:00:00-08:00. Default is the current date.
   * @param {boolean} [params.reduceNoise] Return tiny energy values less than defined threshold as zero
   * @returns {Promise<GetDeviceEnergyUsageAggregatedApiResponse>}
   */
  getDeviceEnergyUsageAggregated(deviceId: string, aggregation: EnergyUsageDataAggregation, startDate: string,
                                 params: {
                                   locationId: number,
                                   endDate?: string,
                                   reduceNoise?: boolean
                                 }): Promise<GetDeviceEnergyUsageAggregatedApiResponse> {
    let deviceIdEncoded = encodeURIComponent(deviceId.toString());
    let aggregationEncoded = encodeURIComponent(aggregation.toString());
    let startDateEncoded = encodeURIComponent(startDate.toString());

    return this.dal.get(`devices/${deviceIdEncoded}/energyUsage/${aggregationEncoded}/${startDateEncoded}`, {params: params});
  }

  /**
   * Ensemble contains a billing rates database capable of storing flat-rate, time-of-use, and tiered pricing schemes for utility billing.
   * See {@link http://docs.iotapps.apiary.io/#reference/energy-management/get-billing-information/get-billing-information}
   *
   *This API method allows to get billing information to allow to track billing information, and
   * also track the user's customizable budget information to help keep them on track.A billing day is the day when the user gets charged by the utility.
   * The billing day is an integer representing a single day of the month, like "28" for the 28th day of the month.
   * Each billing cycle ends on the day before the billing day, at 23:59:59. A new billing cycle starts at 00:00:00 on the billing day.
   *
   * @param {number} locationId Location ID to obtain billing information for.
   * @param {BillingInformationType} filter Types of billing information to get.
   * @returns {Promise<GetBillingInformationApiResponse>}
   */
  getBillingInformation(locationId: number, filter: BillingInformationType): Promise<GetBillingInformationApiResponse> {
    return this.dal.get(`locations/${encodeURIComponent(locationId.toString())}/billing/${encodeURIComponent(filter.toString())}`);
  }

  /**
   * This API method allows to update the billing day, billing rate, and budget information. All fields are optional.
   * See {@link http://docs.iotapps.apiary.io/#reference/energy-management/get-billing-information/update-billing-information}
   *
   * @param {number} locationId Location ID to obtain billing information for.
   * @param {UpdateBillingInformationModel} model Billing information model containing updated data.
   * @returns {Promise<UpdateBillingInformationApiResponse>}
   */
  updateBillingInformation(locationId: number, model: UpdateBillingInformationModel): Promise<UpdateBillingInformationApiResponse> {
    return this.dal.put(`locations/${encodeURIComponent(locationId.toString())}/billing`, model);
  }
}
