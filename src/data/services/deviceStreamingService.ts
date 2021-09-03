import { inject, injectable } from '../../modules/common/di';
import { StreamingApi } from '../api/deviceStreamingApi/streaming/streamingApi';
import { GetDeviceStreamingServerApiResponse } from '../api/deviceStreamingApi/streaming/GetDeviceStreamingServerApiResponse';
import { BaseService } from './baseService';

@injectable('DeviceStreamingService')
export class DeviceStreamingService extends BaseService {
  @inject('StreamingApi') protected readonly streamingApi!: StreamingApi;

  constructor() {
    super();
  }

  getCameraStreamingInfo(deviceId: string): Promise<DeviceStreamingServerInfo> {
    return this.streamingApi.getDeviceStreamingServer(deviceId).then((serverData: GetDeviceStreamingServerApiResponse) => {
      if (!serverData || !serverData.server || !serverData.server.host) {
        // disconnected
        return Promise.resolve({
          connected: false,
        });
      }

      let host = serverData.server.host + (serverData.server.port ? ':' + serverData.server.port : '');
      let streamingServerUrl = (serverData.server.ssl ? 'https://' : 'http://') + host;
      let websocketUrl = (serverData.server.ssl ? 'wss://' : 'ws://') + host;

      return this.streamingApi.getStreamingSession(streamingServerUrl, deviceId).then((streamingSessionInfo) => {
        if (!streamingSessionInfo || !streamingSessionInfo.videoServer || !streamingSessionInfo.sessionId) {
          // disconnected
          let result: DeviceStreamingServerInfo = {
            connected: false,
          };
          return Promise.resolve(result);
        }

        let streamingRtmpUrl =
          (streamingSessionInfo.videoServerSsl ? 'rtmps' : 'rtmp') +
          '://' +
          streamingSessionInfo.videoServer +
          '/ppcvideoserver' +
          '?sessionId=' +
          streamingSessionInfo.sessionId +
          '&deviceId=' +
          deviceId +
          '/' +
          streamingSessionInfo.sessionId;

        let streamingHLSUrl =
          (streamingSessionInfo.videoServerSsl ? 'https' : 'http') +
          '://' +
          streamingSessionInfo.videoServer +
          '/ppcvideoserver/' +
          streamingSessionInfo.sessionId +
          '/playlist.m3u8?sessionId=' +
          streamingSessionInfo.sessionId +
          '&deviceId=' +
          deviceId;

        let result: DeviceStreamingServerInfo = {
          connected: true,
          rtmpUrl: streamingRtmpUrl,
          hlsUrl: streamingHLSUrl,
          streamingServerUrl: streamingServerUrl,
          websocketUrl: websocketUrl,
          sessionId: streamingSessionInfo.sessionId,

          streamingServer: {
            host: serverData.server!.host,
            port: serverData.server!.port,
            ssl: serverData.server!.ssl,
          },

          videoServer: {
            host: streamingSessionInfo.videoServer,
            ssl: !!streamingSessionInfo.videoServerSsl,
          },
        };

        return result;
      });
    });
  }
}

export interface DeviceStreamingServerInfo {
  /**
   * True if device is connected. If false, other fields are empty
   */
  connected: boolean;

  rtmpUrl?: string;
  hlsUrl?: string;
  streamingServerUrl?: string;
  websocketUrl?: string;
  sessionId?: string;

  streamingServer?: {
    host: string;
    port?: string;
    ssl: boolean;
  };

  videoServer?: {
    host: string;
    ssl: boolean;
  };
}
