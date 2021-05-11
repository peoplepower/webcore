import { inject, injectable } from '../../../../modules/common/di';
import { DeviceStreamingApiDal } from '../deviceStreamingApiDal';
import { GetDeviceStreamingServerApiResponse } from './GetDeviceStreamingServerApiResponse';
import { GetStreamingSessionApiResponse } from './GetStreamingSessionApiResponse';

/**
 * Video streaming API
 */
@injectable('StreamingApi')
export class StreamingApi {
  @inject('DeviceStreamingApiDal') protected readonly dal: DeviceStreamingApiDal;

  /**
   * Get device streaming server info.
   * @param {string} deviceId device ID
   * @param {boolean} connected
   * @returns {Promise<GetDeviceStreamingServerApiResponse>}
   */
  getDeviceStreamingServer(deviceId: string, connected?: boolean): Promise<GetDeviceStreamingServerApiResponse> {
    return this.dal.get('settingsServer/streaming', {
      params: {
        deviceId: deviceId,
        connected: connected,
      },
    });
  }

  /**
   * Both camera and viewers should use this API to obtain streaming session information and video server connection
   * settings. A camera has to provide own device ID and the IoT Software Suite authorization token. A viewer has to
   * send the camera device ID and the IoT Software Suite API key.
   * @param {string} streamingUrl URL that you can get from getDeviceStreamingServer method
   * @param {string} deviceId device ID
   * @returns {Promise<GetStreamingSessionApiResponse>}
   */
  getStreamingSession(streamingUrl: string, deviceId: string): Promise<GetStreamingSessionApiResponse> {
    return this.dal.get('streaming/session', {
      params: {
        deviceId: deviceId,
      },
      baseURL: streamingUrl,
    });
  }
}
