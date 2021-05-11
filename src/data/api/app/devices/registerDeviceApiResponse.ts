import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface DevicePropertiesModel {
  properties?: Array<{
    name: string;
    index?: string;
    value: string;
  }>;
}

export interface SetDevicePropertiesModel {
  property: Array<{
    name: string;
    index?: string;
    content: string;
  }>;
}

export interface RegisterDeviceParams {
  /**
   * Device ID's are globally unique, and must not contain '/' or '\' characters. See the documentation for examples of
   * recommended device ID formats for extremely easy People Power designed QR code out-of-box experiences.
   */
  deviceId?: string;

  /**
   * Specific Location to add this device to
   */
  locationId?: number;

  /**
   * Type of device being registered. Optional, but highly recommended you specify this.
   */
  deviceType?: number;

  /**
   * Standard SSL only supports one-way authentication. Ensemble takes security a leap forward by allowing the use of
   * an optional cryptographic authentication token to be used for bi-directional authentication of a device. If
   * requested, your device will be responsible for securely storing the generated authentication token and including
   * it in all future HTTP requests to Ensemble.
   *   true - Request an authentication token
   *   false - Do not use an authentication token
   */
  authToken?: boolean;

  /**
   * Timestamp in xsd:dateTime or milliseconds.
   * The absolute date timestamp when the device is registered to the user's account. Ensemble will not store any data
   * from a device before its registration time. For example, if you have historical data from this device that you
   * want associated with the user's account, then the registration time should be set in the past to be able to store
   * all that historical data. The default start time is the current time on Ensemble.
   */
  startDate?: string;

  /**
   * Device nickname / description
   */
  desc?: string;

  /**
   * Device usage goal ID
   */
  goalId?: number;
}

export interface RegisterDeviceApiResponse extends ApiResponseBase {
  deviceId: string;
  locationId: number;
  deviceType: number;
  authToken?: string;
  exist: boolean;
  host: string;
  port: number;
  useSSL: boolean;
}
