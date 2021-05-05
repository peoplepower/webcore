import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetAlertsHistoryApiResponse } from './getAlertsHistoryApiResponse';
import { GetLastNMeasurementsApiResponse } from './getLastNMeasurementsApiResponse';
import { GetMeasurementsHistoryApiResponse, IntervalAggregationAlgorithm } from './getMeasurementsHistoryApiResponse';
import { GetCurrentDeviceMeasurementsApiResponse } from './getCurrentDeviceMeasurementsApiResponse';
import { CommandParametersModel, SendCommandToDeviceApiResponse } from './sendCommandToDeviceApiResponse';

/**
 * Device Measurements API.
 * See {@link http://docs.iotapps.apiary.io/#reference/device-measurements}
 *
 * Ensemble interacts with devices and UI's through parameters. The command channel parameters to the device are
 * completely separate from the measurement channel parameters back from the device.
 */
@injectable('DeviceMeasurementsApi')
export class DeviceMeasurementsApi {

  @inject('AppApiDal') protected readonly dal: AppApiDal;

  /**
   * Gets the history of the alerts either for particular device and dates or for all of them.
   * See {@link http://docs.iotapps.apiary.io/#reference/device-measurements/history-of-alerts/get-history-of-alerts}
   *
   * @param params Request parameters
   * @param {string} params.startDate Start date to begin receiving alerts, example: 2014-08-01T12:00:00-08:00.
   * @param {number} params.locationId Request information for devices on a specific location.
   * @param {string} [params.endDate] End date to stop receiving alerts, example: 2014-08-01T13:00:00-08:00. Default is the current date.
   * @param {string} [params.alertType] Retrieve only alerts of this type. Available alert types: "factoryReset", "status", "motion", "person".
   * @param {string} [params.deviceId] Device ID for which to get a history of alerts.
   * @param {number} [params.userId] User ID to receive alerts from, used only by administrators.
   * @returns {Promise<GetAlertsHistoryApiResponse>}
   */
  getAlertsHistory(
    params: {
      startDate: string,
      locationId: number,
      endDate?: string,
      alertType?: string,
      deviceId?: string,
      userId?: number
    }): Promise<GetAlertsHistoryApiResponse> {
    return this.dal.get('alerts', {params: params});
  }

  /**
   * Gets the last N measurements for the device (or all of them).
   * See {@link http://docs.iotapps.apiary.io/#reference/device-measurements/get-the-last-n-measurements/get-the-last-n-measurements}
   *
   * The first timestamp reading will contain measured params and their values. All other timestamp readings will only contain the params that changed in value.
   *
   * @param {string} deviceId Device ID to obtain information from.
   * @param {number} rowCount Maximum number of measurements to obtain.
   * @param params Request parameters.
   * @param {number} params.locationId Request information on a specific location.
   * @param {string} [params.startDate] Start date to begin receiving measurements, example: 2014-08-01T12:00:00-08:00.
   * @param {string} [params.endDate] End date to stop receiving measurements, example: 2014-08-01T13:00:00-08:00. Default is the current date.
   * @param {number} [params.userId] User ID to receive measurements from, only called by administrator accounts.
   * @param {string|string[]} [params.paramName] Only obtain measurements for given parameter names. Multiple values can be passed.
   * @param {string} [params.index] Only obtain measurements for parameters with this index number.
   * @param {boolean} [params.reduceNoise] Return tiny parameter values less than defined threshold as zero.
   * @returns {Promise<GetLastNMeasurementsApiResponse>}
   */
  getLastNMeasurements(deviceId: string, rowCount: number,
                       params: {
                         locationId: number,
                         startDate?: string,
                         endDate?: string,
                         userId?: number,
                         paramName?: string | string[],
                         index?: string,
                         reduceNoise?: boolean
                       }): Promise<GetLastNMeasurementsApiResponse> {
    return this.dal.get(
      `devices/${encodeURIComponent(deviceId)}/parametersByCount/${encodeURIComponent(rowCount.toString())}`,
      {params: params});
  }

  /**
   * Gets current measurements for the specified device.
   * See {@link https://iotapps.docs.apiary.io/#reference/device-measurements/parameters-for-a-specific-device/get-current-measurements}
   *
   * @param {string} deviceId Id of the device to get measurements for.
   * @param params Request parameters.
   * @param {number} params.locationId Request information on a specific location.
   * @param {number} [params.userId] Optional user ID search field for an administrator to retrieve parameters of the device owned by this user.
   * @param {string} [params.paramName] Optional parameter to extract. You may specify multiple paramName URL parameters to gather multiple specific parameters.
   * @param {number} [params.shared] Send command to a device shared in circle. If 'true', the location ID is not required.
   * @returns {Promise<GetCurrentDeviceMeasurementsApiResponse>}
   */
  getCurrentMeasurements(deviceId: string,
                         params: {
                           locationId: number,
                           userId?: number,
                           paramName?: string,
                           shared?: boolean
                         }): Promise<GetCurrentDeviceMeasurementsApiResponse> {
    return this.dal.get(`devices/${encodeURIComponent(deviceId)}/parameters`, {params: params});
  }

  /**
   * Sends command to the specified device.
   * See {@link https://iotapps.docs.apiary.io/#reference/device-measurements/parameters-for-a-specific-device/send-a-command}
   *
   * A successful result code does not indicate the device executed the command. Check the device's parameters in a few moments to see if it updated its status.
   * If the device is offline, you will receive an error code 21, "Device is offline or disconnected".
   * Index number is optional, and only needed if the device interprets or expects an index number.
   *
   * @param {string} deviceId Device ID for which to send a command
   * @param {CommandParametersModel} commandParameters Command parameters to send to device
   * @param params Request parameters.
   * @param {number} params.locationId Device location ID.
   * @param {number} [params.shared] Send command to a device shared in circle. If 'true', the location ID is not required.
   * @returns {Promise<SendCommandToDeviceApiResponse>}
   */
  sendCommandToDevice(deviceId: string, commandParameters: CommandParametersModel,
                      params: {
                        locationId: number,
                        shared?: boolean
                      }): Promise<SendCommandToDeviceApiResponse> {
    return this.dal.put(`devices/${encodeURIComponent(deviceId)}/parameters`, commandParameters, {params: params});
  }

  /**
   * Gets the history of the particular device measurements according to the supplied parameters (filtering by dates, location, user, device param name).
   * See {@link http://docs.iotapps.apiary.io/#reference/device-measurements/parameters-for-a-specific-device/get-history-of-measurements}
   *
   * @param {string} deviceId Device ID to obtain information on.
   * @param {string} startDate Start date to begin receiving measurements, example: 2014-08-01T12:00:00-08:00
   * @param params Request parameters.
   * @param {number} params.locationId Request information on a specific location.
   * @param {string} [params.endDate] End date to stop receiving measurements, example: 2014-08-01T13:00:00-08:00. Default is the current date.
   * @param {number} [params.userId] User ID to receive measurements from, only called by administrator accounts.
   * @param {string|string[]} [params.paramName] Only obtain measurements for given parameter names. Multiple values can be passed.
   * @param {string} [params.index] Only obtain measurements for parameters with this index number.
   * @param {number} [params.interval] Aggregate the readings by this interval, in minutes.
   * @param {IntervalAggregationAlgorithm} [params.aggregation] Interval aggregation algorithm:
   *   0 = last value before the interval point - default
   *   1 = minimum value
   *   2 = maximum value
   *   3 = median value
   *   4 = time distributed average value
   *   5 = average value
   * @param {boolean} [params.reduceNoise] Return tiny parameter values less than defined threshold as zero
   * @param {boolean} [params.rangeOnly] Return parameters stored exactly between start and end dates
   * @returns {Promise<GetMeasurementsHistoryApiResponse>}
   */
  getMeasurementsHistory(deviceId: string, startDate: string,
                         params: {
                           locationId: number,
                           endDate?: string,
                           userId?: number,
                           paramName?: string | string[],
                           index?: string,
                           interval?: number;
                           aggregation?: IntervalAggregationAlgorithm,
                           reduceNoise?: boolean,
                           rangeOnly?: boolean
                         }): Promise<GetMeasurementsHistoryApiResponse> {
    return this.dal.get(`devices/${encodeURIComponent(deviceId)}/parametersByDate/${encodeURIComponent(startDate)}`, {params: params});
  }
}
