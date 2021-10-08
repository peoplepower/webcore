import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetDeviceActivationInfoApiResponse } from './getDeviceActivationInfoApiResponse';
import { GetDeviceActivationInfoAtLocationApiResponse } from './getDeviceActivationInfoAtLocationApiResponse';
import { GetDeviceByIdApiResponse } from './getDeviceByIdApiResponse';
import { GetDevicePropertiesApiResponse } from './getDevicePropertiesApiResponse';
import { GetDevicesListApiResponse } from './getDevicesListApiResponse';
import { GetFirmwareJobsApiResponse } from './getFirmwareJobsApiResponse';
import {
  DevicePropertiesModel,
  RegisterDeviceApiResponse,
  RegisterDeviceParams,
  SetDevicePropertiesModel,
} from './registerDeviceApiResponse';
import { CoreApiError } from '../../../models/coreApiError';
import { FirmwareUpdateStatus, SetFirmwareUpdateStatusApiResponse } from './setFirmwareUpdateStatusApiResponse';
import { UpdateDeviceApiResponse, UpdateDeviceModel } from './updateDeviceApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Devices API.
 * See {@link http://docs.iotapps.apiary.io/#reference/devices}
 *
 * Devices must be added to a user's account to communicate data with Ensemble.
 * A device may be registered through this Application API using a smartphone phone or web portal.
 * This is usually the easiest way for users to register a device.
 * If the user added a device that is a proxy, then the proxy device may automatically add more devices
 * to the users account as those devices are discovered.
 */
@injectable('DevicesApi')
export class DevicesApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Registers a device.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/manage-devices/register-a-device}
   *
   * Response will describe how the device should connect to the Ensemble instance.
   * Also allows to register devices without API_KEY, using the deviceActivationKey instead, that will be passed
   * to the server as ACTIVATION_KEY to allow device registration without API_KEY provided.
   *
   * @param {DevicePropertiesModel} properties Device properties.
   * @param {RegisterDeviceParams} [params] Optional parameters.
   * @param {string} [deviceActivationKey] Activation key that allows to register device (no API_KEY).
   * @returns {Promise<RegisterDeviceApiResponse>}
   */
  registerDevice(
    properties: DevicePropertiesModel,
    params?: RegisterDeviceParams,
    deviceActivationKey?: string,
  ): Promise<RegisterDeviceApiResponse> {
    let headers = deviceActivationKey ? {ACTIVATION_KEY: deviceActivationKey, noAuth: true} : {};

    // TODO(max): Fix typing
    return this.dal.post('devices', properties, {params: params, headers: headers});
  }

  // #region ------------------ Manage Single Device -------------------

  /**
   * Returns single device by it's ID if it available for user.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/manage-single-device/get-device-by-id}
   *
   * On error it will return an error code and only device type and category.
   * The lastDataReceivedDate is the last timestamp at which Ensemble received and stored data from this device.
   * The lastMeasureDate is the last timestamp of measured data from this device. The startDate is when this device was registered.
   *
   * @param {string} deviceId Device ID to obtain information on.
   * @param params Request parameters.
   * @param {number} params.locationId Request information on a specific location.
   * @param {boolean} [params.checkConnected] Check the device connection status.
   * @returns {Promise<GetDeviceByIdApiResponse>}
   */
  getDeviceById(
    deviceId: string,
    params: {
      locationId: number;
      checkConnected?: boolean;
    },
  ): Promise<GetDeviceByIdApiResponse> {
    return this.dal.get(`devices/${encodeURIComponent(deviceId)}`, {params: params});
  }

  /**
   * Update the device description, device goal, newDevice flag, device model ID, or move the device to a new location.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/manage-a-device-on-a-specific-location/update-a-device-at-a-specific-location}
   *
   * The startDate field declares when the device was moved.
   * By default, this is set to the current time when the API call is made.
   * With this field, it's possible to retroactively declare that the device was at a different location in the past.
   *
   * @param {string} deviceId Identifier of the device to update.
   * @param {number} locationId Location ID that contains the device.
   * @param {UpdateDeviceModel} model Model containing device and its location info.
   * @returns {Promise<UpdateDeviceApiResponse>}
   */
  updateDeviceAtLocation(deviceId: string, locationId: number, model: UpdateDeviceModel): Promise<UpdateDeviceApiResponse> {
    return this.dal.put(`locations/${encodeURIComponent(locationId.toString())}/devices/${encodeURIComponent(deviceId)}`, model);
  }

  /**
   * There are multiple ways to delete a device.
   * Delete a device from a specific location is useful for organization administrators. Devices that linked to a proxy will be removed from the proxy.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/manage-a-device-on-a-specific-location/delete-a-device-at-a-specific-location}
   *
   * @param {string} deviceId The Device ID to delete.
   * @param {number} locationId Location ID to delete a device from.
   * @param [params] Request parameters.
   * @param {boolean} [params.keepOnAccount] Send only the delete command to the gateway, but keep the device on the user account.
   * @param {boolean} [params.keepSlave] Delete only the gateway from the user account without removing slave devices.
   * @param {boolean} [params.keepSlaveOnGateway] Delete slave devices from the account only, but not delete them on the gateway.
   * @param {boolean} [params.clear] Clear.
   *  'true' - Delete the device from all previous locations and clear its current parameter values, but don't delete its history.
   *  'false' - Do not remove the device from previous locations and do not clear its current parameters when deleting it.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteDevice(
    deviceId: string,
    locationId: number,
    params?: {
      keepOnAccount?: boolean;
      keepSlave?: boolean;
      keepSlaveOnGateway?: boolean;
      clear?: boolean;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.delete(`locations/${encodeURIComponent(locationId.toString())}/devices/${encodeURIComponent(deviceId)}`, {
      params: params,
    });
  }

  // #endregion

  // #region ---------------- Manage Multiple Devices ------------------

  /**
   * Returns a list of devices belonging to the user.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/manage-devices/get-a-list-of-devices}
   *
   * This API returns some UI specific device type attributes and device parameters.
   *
   * @param params Request parameters
   * @param {number} params.locationId Obtain a list of devices for the specified Location ID.
   * @param {number} [params.userId] Obtain a list of devices for the specified user ID, used by administrators.
   * @param {number} [params.checkPersistent] Server may check for an active persistent connection with the device, and overwrite the previously declared
   *   'connected' value. If not set - server will check for a persistent connection only for devices which were not previously declared 'connected'.
   * @param {number} [params.spaceId] Filter devices by space ID.
   * @param {number} [params.spaceType] Filter devices by space type.
   * @returns {Promise<GetDevicesListApiResponse>}
   */
  getDevicesList(params: {
    locationId: number;
    userId?: number;
    checkPersistent?: boolean;
    spaceId?: number;
    spaceType?: number;
    sortCollection?: string;
    sortBy?: string;
    getTags?: boolean;
  }): Promise<GetDevicesListApiResponse> {
    return this.dal.get('devices', {params: params});
  }

  /**
   * There are multiple ways to delete a device.
   * This method is the most flexible, allowing multiple devices to be deleted simultaneously.
   * Devices linked to a proxy will be removed from the proxy. Device linked to a hub will be removed from the hub.
   * See {@link http://docs.iotapps.apiary.io/#reference/devices/manage-devices/delete-devices}
   *
   * @param params Request parameters
   * @param {string|string[]} params.deviceId The DeviceID or array of DeviceIDs to delete.
   * @param {number} params.locationId Location ID where to delete devices.
   * @param {boolean} [params.keepOnAccount] Send only the delete command to the gateway, but keep the device on the user account.
   * @param {boolean} [params.keepSlave] Delete only the gateway from the user account without removing slave devices.
   * @param {boolean} [params.keepSlaveOnGateway] Delete slave devices from the account only, but not delete them on the gateway.
   * @param {boolean} [params.clear] Clear.
   *  'true' - Delete the device from all previous locations and clear its current parameter values, but don't delete its history.
   *  'false' - Do not remove the device from previous locations and do not clear its current parameters when deleting it.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteDevices(params: {
    deviceId: string | string[];
    locationId: number;
    keepOnAccount?: boolean;
    keepSlave?: boolean;
    keepSlaveOnGateway?: boolean;
    clear?: boolean;
  }): Promise<ApiResponseBase> {
    return this.dal.delete('devices', {params: params});
  }

  // #endregion

  // #region ---------------------- Device Spaces ----------------------

  /**
   * Link device to Location Space.
   * A user can map devices to location spaces. Each device can be linked to one or multiple spaces on the same location based on the device type.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/device-spaces/link-space}
   *
   * @param {string} deviceId Identifier of the device.
   * @param {number} locationId Location ID that contains the device.
   * @param {number} spaceId Space ID.
   * @returns {Promise<ApiResponseBase>}
   */
  linkSpace(deviceId: string, locationId: number, spaceId: number): Promise<ApiResponseBase> {
    return this.dal.put(
      `locations/${encodeURIComponent(locationId.toString())}/devices/${encodeURIComponent(deviceId)}/spaces/${encodeURIComponent(
        spaceId.toString(),
      )}`,
    );
  }

  /**
   * Unlink device from Location Space.
   * A user can map devices to location spaces. Each device can be linked to one or multiple spaces on the same location based on the device type.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/device-spaces/unlink-space}
   *
   * @param {string} deviceId Identifier of the device.
   * @param {number} locationId Location ID that contains the device.
   * @param {number} spaceId Space ID
   * @returns {Promise<ApiResponseBase>}
   */
  unlinkSpace(deviceId: string, locationId: number, spaceId: number): Promise<ApiResponseBase> {
    return this.dal.delete(
      `locations/${encodeURIComponent(locationId.toString())}/devices/${encodeURIComponent(deviceId)}/spaces/${encodeURIComponent(
        spaceId.toString(),
      )}`,
    );
  }

  // #endregion

  // #region ------------------ Device Activation Info -----------------

  /**
   * Some devices require manual interaction to complete registration in Ensemble.
   * This API returns instructions how to do it and can send them to user's email address as well.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/device-activation-info/get-device-activation-info}
   *
   * @param {number} deviceType Device type ID for which instructions are requested.
   * @param [params] Request parameters
   * @param {boolean} [params.sendEmail] Request instructions to be sent by email. False by default.
   * @returns {Promise<GetDeviceActivationInfoApiResponse>}
   */
  getDeviceActivationInfo(deviceType: number, params?: { sendEmail?: boolean }): Promise<GetDeviceActivationInfoApiResponse> {
    return this.dal.get(`deviceActivation/${encodeURIComponent(deviceType.toString())}`, {params: params});
  }

  /**
   * Some devices require manual interaction to complete registration in Ensemble.
   * This API returns instructions how to do it and can send them to user's email address as well.
   * With ability to register a device at a specific location.
   * See
   * {@link https://iotapps.docs.apiary.io/#reference/devices/device-activation-info-at-a-specific-location/get-device-activation-info-at-a-specific-location}
   *
   * @param {number} deviceType Device type ID for which instructions are requested.
   * @param {number} locationId Location ID to register a device.
   * @param [params] Request parameters
   * @param {boolean} [params.sendEmail] Request instructions to be sent by email. False by default.
   * @returns {Promise<GetDeviceActivationInfoAtLocationApiResponse>}
   */
  getDeviceActivationInfoAtLocation(
    deviceType: number,
    locationId: number,
    params?: {
      sendEmail?: boolean;
    },
  ): Promise<GetDeviceActivationInfoAtLocationApiResponse> {
    return this.dal.get(
      `locations/${encodeURIComponent(locationId.toString())}/deviceActivation/${encodeURIComponent(deviceType.toString())}`,
      {params: params},
    );
  }

  // #endregion

  // #region -------------------- Device Properties --------------------

  /**
   * A Device Property allows you to associate some extra key/value information with a particular device.
   * Device Property keys and values can be 250 characters maximum.
   * This method allows to get device properties or a specific property.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/device-properties/get-device-properties}
   *
   * @param {string} deviceId Device ID to obtain information on.
   * @param params Request parameters
   * @param {number} params.locationId Device location ID.
   * @param {string} [params.name] Optional name of the property to retrieve.
   * @param {number} [params.index] Optional index number of the property to retrieve.
   * @returns {Promise<GetDevicePropertiesApiResponse>}
   */
  getDeviceProperties(
    deviceId: string,
    params: {
      locationId: number;
      name?: string;
      index?: number;
    },
  ): Promise<GetDevicePropertiesApiResponse> {
    return this.dal.get(`devices/${encodeURIComponent(deviceId)}/properties`, {params: params});
  }

  /**
   * This method allows to delete device property.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/device-properties/delete-a-device-property}
   *
   * @param {string} deviceId Device ID to obtain information on.
   * @param params Request parameters
   * @param {number} params.locationId Device location ID.
   * @param {string} params.name Name of the property to delete.
   * @param {string} [params.index] Optional index number of the property to delete.
   * @param {number} [params.userId] Device owner ID for access by an administrator.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteDeviceProperty(
    deviceId: string,
    params: {
      locationId: number;
      name: string;
      index?: string;
      userId?: number;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.delete(`devices/${encodeURIComponent(deviceId)}/properties`, {params: params});
  }

  /**
   * This method allows to set device properties or a specific property.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/device-properties/set-multiple-device-properties}
   *
   * @param {string} deviceId Device ID to obtain information on.
   * @param {number} locationId Device location ID.
   * @param {DevicePropertiesModel} model Device properties.
   * @returns {Promise<ApiResponseBase>}
   */
  setDeviceProperties(deviceId: string, locationId: number, model: SetDevicePropertiesModel): Promise<ApiResponseBase> {
    if (!model || !model.property || model.property.length === 0) {
      return Promise.reject(new CoreApiError('No properties specified to be updated'));
    }

    return this.dal.post(`devices/${encodeURIComponent(deviceId)}/properties`, model, {params: {locationId: locationId}});
  }

  // #endregion

  // #region --------------------- Firmware Update ---------------------

  /**
   * This method allows to retrieve a list of available firmware updates for user devices.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/firmware-update/get-firmware-jobs}
   *
   * A user can approve or decline an update of his devices with new firmware.
   * Frimware update job statuses:
   *   1 - Available
   *   2 - Approved
   *   3 - Decline
   *   4 - Started
   *
   * @param [params] Request parameters.
   * @param {string} [params.deviceId] Optional filter by device ID.
   * @param {string} [params.index] Check update for specific device part.
   * @param {number} [params.userId] Device owner ID for access by an administrator.
   * @returns {Promise<GetFirmwareJobsApiResponse>}
   */
  getFirmwareJobs(params?: { deviceId?: string; index?: string; userId?: number }): Promise<GetFirmwareJobsApiResponse> {
    return this.dal.get('fwupdate', {params: params});
  }

  /**
   * A user can approve or decline an update of his devices with new firmware.
   * See {@link https://iotapps.docs.apiary.io/#reference/devices/firmware-update/set-firmware-update-status}
   *
   * This method allows to approve or decline the firmware update.
   * The user can schedule the update after specific date and time. available firmware updates for user devices.
   *
   * @param params Request parameters
   * @param {string} params.deviceId Device ID for which to set a firmware update status.
   * @param {number} params.status New firmware update job status
   * @param {string} [params.index] Update firmware of specific device part.
   * @param {string} [params.startDate] Firmware update start date.
   * @param {number} [params.userId] Device owner ID for access by an administrator.
   * @returns {Promise<SetFirmwareUpdateStatusApiResponse>}
   */
  setFirmwareUpdateStatus(params: {
    deviceId: string;
    status: FirmwareUpdateStatus;
    index?: string;
    startDate?: string;
    userId?: number;
  }): Promise<SetFirmwareUpdateStatusApiResponse> {
    return this.dal.put('fwupdate', {}, {params: params});
  }

  // #endregion
}
