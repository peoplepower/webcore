import { inject, injectable } from '../../modules/common/di';
import { DevicesApi } from '../api/app/devices/devicesApi';
import { AuthService } from './authService';
import { ApiResponseBase } from '../models/apiResponseBase';
import { GetDevicesListApiResponse } from '../api/app/devices/getDevicesListApiResponse';
import { GetDeviceByIdApiResponse } from '../api/app/devices/getDeviceByIdApiResponse';
import { BaseService } from './baseService';
import { DevicesConfigurationApi } from '../api/app/devicesConfiguration/devicesConfigurationApi';
import { GetSupportedDeviceTypesApiResponse } from '../api/app/devicesConfiguration/getSupportedDeviceTypesApiResponse';
import { GetDeviceGoalsByDeviceTypeApiResponse } from '../api/app/devicesConfiguration/getDeviceGoalsByDeviceTypeApiResponse';
import { GetCurrentDeviceMeasurementsApiResponse } from '../api/app/deviceMeasurements/getCurrentDeviceMeasurementsApiResponse';
import { DeviceMeasurementsApi } from '../api/app/deviceMeasurements/deviceMeasurementsApi';
import { CommandParametersModel, SendCommandToDeviceApiResponse } from '../api/app/deviceMeasurements/sendCommandToDeviceApiResponse';
import { DevicePropertiesModel, RegisterDeviceApiResponse, RegisterDeviceParams } from '../api/app/devices/registerDeviceApiResponse';
import { DevicePairingType, GetDeviceModelsApiResponse } from '../api/app/deviceModels/getDeviceModelsApiResponse';
import { DeviceModelsApi } from '../api/app/deviceModels/deviceModelsApi';
import { GetDeviceParametersApiResponse } from '../api/app/devicesConfiguration/getDeviceParametersApiResponse';
import { GetLastNMeasurementsApiResponse } from '../api/app/deviceMeasurements/getLastNMeasurementsApiResponse';

@injectable('DeviceService')
export class DeviceService extends BaseService {
  @inject('AuthService') protected readonly authService: AuthService;
  @inject('DevicesApi') protected readonly devicesApi: DevicesApi;
  @inject('DevicesConfigurationApi') protected readonly devicesConfigurationApi: DevicesConfigurationApi;
  @inject('DeviceMeasurementsApi') protected readonly deviceMeasurementsApi: DeviceMeasurementsApi;
  @inject('DeviceModelsApi') protected readonly deviceModelsApi: DeviceModelsApi;

  constructor() {
    super();
  }

  // #region Device Types

  /**
   * Gets supported device types.
   * @returns {Promise<DeviceTypes>}
   */
  public getSupportedDeviceTypes(
    simple?: boolean,
    sortCollection?: string,
    sortBy?: string,
    organizationId?: number,
  ): Promise<DeviceTypes> {
    const params: {
      simple?: boolean;
      sortCollection?: string;
      sortBy?: string;
      organizationId?: number;
    } = {};

    if (simple) {
      params.simple = true;
    }
    if (sortCollection && sortCollection.length > 0) {
      params.sortCollection = sortCollection;
    }
    if (sortBy && sortBy.length > 0) {
      params.sortBy = sortBy;
    }
    if (organizationId) {
      params.organizationId = organizationId;
    }

    return this.devicesConfigurationApi.getSupportedDeviceTypes(params);
  }

  // #endregion

  // #region GetDevices Methods

  /**
   * Gets device by ID.
   * @param {string} deviceId Device ID
   * @param {number} locationId Location ID
   * @param {boolean} [checkConnected]
   * @param {number} [userId] Request information as a specific user, only called by administrator accounts.
   * @returns {Promise<Device>}
   */
  public getDevice(deviceId: string, locationId: number, checkConnected?: boolean, userId?: number): Promise<Device> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    const params: {
      checkConnected?: boolean;
      locationId: number;
      userId?: number;
    } = {
      locationId: locationId,
    };

    if (checkConnected) {
      params.checkConnected = true;
    }
    if (userId && !isNaN(userId)) {
      params.userId = userId;
    }

    return this.authService.ensureAuthenticated().then(() => this.devicesApi.getDeviceById(deviceId, params));
  }

  /**
   * Gets devices for specific location.
   * @param {number} locationId Location ID
   * @param [params] Request parameters.
   * @param {boolean} [params.checkPersistent] Check the device connection status.
   * @param {boolean} [params.getTags] Return device tags.
   * @param {number} [params.spaceId] Filter devices by space ID.
   * @param {number} [params.spaceType] Filter devices by space type.
   * @param {string} [params.sortBy] Sort collection by field.
   * @returns {Promise<LocationDevicesList>}
   */
  public getLocationDevices(
    locationId: number,
    params?: {
      checkPersistent?: boolean;
      getTags?: boolean;
      spaceId?: number;
      spaceType?: number;
      sortBy?: string;
      sortOrder?: string;
    },
  ): Promise<LocationDevicesList> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    const parameters: {
      locationId: number;
      sortCollection: string;
      checkPersistent?: boolean;
      getTags?: boolean;
      spaceId?: number;
      spaceType?: number;
      sortBy?: string;
      sortOrder?: string;
    } = {
      locationId: locationId,
      sortCollection: 'devices',
      checkPersistent: params && params.checkPersistent,
      getTags: params && params.getTags,
    };

    if (params) {
      if (params.spaceId) {
        parameters.spaceId = params.spaceId;
      }
      if (params.spaceType) {
        parameters.spaceType = params.spaceType;
      }
      if (params.sortBy) {
        parameters.sortBy = params.sortBy;
      }
      if (params.sortOrder) {
        parameters.sortOrder = params.sortOrder;
      }
    }

    return this.devicesApi.getDevicesList(parameters).then((response) => {
      return response as LocationDevicesList;
    });
  }

  /**
   * Get current user device by ID
   * @param {string} deviceId Device ID to obtain information on
   * @param {string} locationId Request information on a specific location.
   * @param {boolean} [checkConnected] Check the device connection status
   * @returns {Promise<DeviceInformation>}
   */
  public getCurrentUserDevice(deviceId: string, locationId: number, checkConnected?: boolean): Promise<DeviceInformation> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    return this.authService.ensureAuthenticated().then(() => {
      return this.devicesApi.getDeviceById(deviceId, { locationId: locationId, checkConnected: checkConnected });
    });
  }

  // #endregion

  // #region Devices Management

  /**
   * Registers a device.
   * @param {DevicePropertiesModel} properties Device properties.
   * @param {RegisterDeviceParams} [params] Optional parameters.
   * @returns {Promise<RegisterDeviceApiResponse>}
   */
  registerDevice(properties: DevicePropertiesModel, params?: RegisterDeviceParams): Promise<RegisterDeviceApiResponse> {
    return this.authService.ensureAuthenticated().then(() => this.devicesApi.registerDevice(properties, params));
  }

  /**
   * This ability to delete a device from a specific location is useful for system and organization administrators.
   * Devices linked to a proxy will be removed from the proxy.
   * @param {number} locationId
   * @param {string} deviceId
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteDevice(locationId: number, deviceId: string): Promise<ApiResponseBase> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    return this.devicesApi.deleteDevice(deviceId, locationId);
  }

  /**
   * Moves device from one location to another.
   * @param {string} deviceId Id of the device that is moved.
   * @param {number} oldLocationId Id of the location from which device is moved.
   * @param {number} newLocationId Id of the location to which device is moved.
   * @param deviceMoveTime Declares when the device was moved. By default, this is set to the current time when the API call is made.
   * With this field, it's possible to retroactively declare that the device was at a different location in the past.
   * @returns {Promise<ApiResponseBase>}
   */
  public moveDeviceToLocation(
    deviceId: string,
    oldLocationId: number,
    newLocationId: number,
    deviceMoveTime?: string,
  ): Promise<ApiResponseBase> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (oldLocationId < 1 || isNaN(oldLocationId)) {
      return this.reject(`Old Location ID is incorrect [${oldLocationId}].`);
    }
    if (newLocationId < 1 || isNaN(newLocationId)) {
      return this.reject(`New Location ID is incorrect [${newLocationId}].`);
    }

    return this.devicesApi.updateDeviceAtLocation(deviceId, oldLocationId, {
      location: {
        id: newLocationId,
        startDate: deviceMoveTime,
      },
    });
  }

  /**
   * Updates device at specific location.
   * @param {string} deviceId ID of the device to update
   * @param {number} locationId Location ID where device is located
   * @param {string|undefined} deviceDescription New Device description
   * @param {string|undefined} deviceModelId New Device description
   * @param {number} goalId Goal ID
   * @returns {Promise<ApiResponseBase>}
   */
  public updateDeviceAtLocation(
    deviceId: string,
    locationId: number,
    deviceDescription?: string,
    deviceModelId?: string,
    goalId?: number,
  ): Promise<ApiResponseBase> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    const device: { desc?: string; modelId?: string; goalId?: number } = {};
    if (deviceDescription && deviceDescription.length > 0) {
      device.desc = deviceDescription;
    }
    if (deviceModelId && deviceModelId.length > 0) {
      device.modelId = deviceModelId;
    }
    if (goalId != null && !isNaN(goalId)) {
      device.goalId = goalId;
    }

    return this.devicesApi.updateDeviceAtLocation(deviceId, locationId, { device: device });
  }

  // #endregion

  // #region Devices Goals

  /**
   * Gets device goals for the specified device type.
   * @param {number} deviceTypeId
   * @param {string} appName
   * @returns {Promise<DeviceGoals>}
   */
  public getDeviceGoals(deviceTypeId: number, appName?: string): Promise<DeviceGoals> {
    const params: { appName?: string } = {};

    if (deviceTypeId < 1 || isNaN(deviceTypeId)) {
      return this.reject(`Device type ID is incorrect [${deviceTypeId}].`);
    }
    if (appName && appName.length > 0) {
      params.appName = appName;
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.devicesConfigurationApi.getDeviceGoalsByDeviceType(deviceTypeId, params);
    });
  }

  // #endregion

  // #region Devices Measurements

  /**
   * Gets current device values (measurements).
   * @param {string} deviceId
   * @param {number} locationId
   * @param {number} [userId]
   * @param {string} [paramName]
   * @returns {Promise<DeviceMeasurements>}
   */
  public getCurrentMeasurements(deviceId: string, locationId: number, userId?: number, paramName?: string): Promise<DeviceMeasurements> {
    const params: {
      locationId: number;
      userId?: number;
      paramName?: string;
    } = {
      locationId: locationId,
    };

    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (userId && userId > 0 && !isNaN(userId)) {
      params.userId = userId;
    }
    if (paramName && paramName.length > 0) {
      params.paramName = paramName;
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.deviceMeasurementsApi.getCurrentMeasurements(deviceId, params);
    });
  }

  /**
   * Gets the last N measurements for the device (or all of them).
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
  getLastNMeasurements(
    deviceId: string,
    rowCount: number,
    params: {
      locationId: number;
      startDate?: string;
      endDate?: string;
      userId?: number;
      paramName?: string | string[];
      index?: string;
      reduceNoise?: boolean;
    },
  ): Promise<GetLastNMeasurementsApiResponse> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.deviceMeasurementsApi.getLastNMeasurements(deviceId, rowCount, params);
    });
  }

  /**
   * Sends command to the specified device.
   *
   * A successful result code does not indicate the device executed the command. Check the device's parameters in a few moments to see if it updated its
   * status.If the device is offline, you will receive an error code 21, "Device is offline or disconnected". Index number is optional, and only needed if the
   * device interprets or expects an index number.
   * @param {string} deviceId Device ID for which to send a command
   * @param {number} locationId Device location ID
   * @param {CommandParametersModel} command Command to send to device
   * @param {boolean} shared Send command to a device shared in circle. If true, the location ID is not required.
   * @returns {Promise<DeviceCommandResult>}
   */
  public sendCommandToDevice(
    deviceId: string,
    locationId: number,
    command: CommandParametersModel,
    shared?: boolean,
  ): Promise<DeviceCommandResult> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.deviceMeasurementsApi.sendCommandToDevice(deviceId, command, { locationId: locationId });
    });
  }

  // #endregion

  // #region Device Models

  /**
   * Gets the device categories and models for specific brand.
   * @param [params] Request parameters.
   * @param {string} [params.modelId] Particular device model to return.
   * @param {string} [params.brand] Get text data for specific brand, otherwise data for default brand returned.
   * @param {string} [params.lang] Get text data for specific language, otherwise - data for all languages.
   * @param {boolean} [params.hidden] Request hidden categories and brand, which are not returned by default.
   * @param {string} [params.searchBy] Search criterion. Use * for a wildcard.
   * @param {number} [params.includePairingType] Filter models by pairing type bitmask.
   * @param {number} [params.excludePairingType] Exclude models by pairing type bitmask.
   * @returns {Promise<GetDeviceModelsApiResponse>}
   */
  getDeviceModels(params?: {
    modelId?: string;
    brand?: string;
    lang?: string;
    hidden?: boolean;
    searchBy?: string;
    includePairingType?: DevicePairingType;
    excludePairingType?: DevicePairingType;
  }): Promise<GetDeviceModelsApiResponse> {
    return this.deviceModelsApi.getDeviceModels(params);
  }

  // #endregion

  // #region Device Configuration

  /**
   * Allows to get device parameters.
   *
   * A parameter is an individual stream of data between a device and the IoT Software Suite. System
   * enables parameters to be optimized for performance and storage, which facilitates massive scalability of the platform.
   * The IoT Software Suite has a single namespace for parameters. Each parameter name must contain no spaces,
   * and include a prefix that is separated from the rest of the name by a period ('.').
   * We recommend prefixes that contain the initials of the company or organization.
   *
   * @param {string} [paramName] Name of the specific parameter to get.
   * @returns {Promise<GetDeviceParametersApiResponse>}
   */
  getDeviceParameters(paramName: string | string[]): Promise<GetDeviceParametersApiResponse> {
    return this.authService.ensureAuthenticated().then(() => {
      return this.devicesConfigurationApi.getDeviceParameters({ paramName: paramName });
    });
  }

  // #endregion

  // #region Location Spaces

  /**
   * Link device to location space.
   * @param {string} deviceId Device ID.
   * @param {number} locationId Location ID.
   * @param {number} spaceId Location space ID.
   * @returns {Promise<ApiResponseBase>}
   */

  public linkSpace(deviceId: string, locationId: number, spaceId: number): Promise<ApiResponseBase> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (spaceId < 1 || isNaN(spaceId)) {
      return this.reject(`Space ID is incorrect [${spaceId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.devicesApi.linkSpace(deviceId, locationId, spaceId);
    });
  }

  /**
   * Unlink device from location space.
   * @param {string} deviceId Device ID.
   * @param {number} locationId Location ID.
   * @param {number} spaceId Location space ID.
   * @returns {Promise<ApiResponseBase>}
   */

  public unlinkSpace(deviceId: string, locationId: number, spaceId: number): Promise<ApiResponseBase> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID can not be empty [${deviceId}].`);
    }
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (spaceId < 1 || isNaN(spaceId)) {
      return this.reject(`Space ID is incorrect [${spaceId}].`);
    }

    return this.authService.ensureAuthenticated().then(() => {
      return this.devicesApi.unlinkSpace(deviceId, locationId, spaceId);
    });
  }

  // #endregion
}

export interface DeviceCommandResult extends SendCommandToDeviceApiResponse {}

export interface Device extends GetDeviceByIdApiResponse {}

export interface DeviceMeasurements extends GetCurrentDeviceMeasurementsApiResponse {}

export interface DeviceGoals extends GetDeviceGoalsByDeviceTypeApiResponse {}

export interface LocationDevicesList extends GetDevicesListApiResponse {}

export interface DeviceInformation extends GetDeviceByIdApiResponse {}

export interface DeviceTypes extends GetSupportedDeviceTypesApiResponse {}
