import { inject, injectable } from '../../../modules/common/di';
import { StreamingApi } from './streaming/streamingApi';

/**
 * Streaming API is designed as a light weight solution for data and command exchanging between devices, clients and
 * server components. It can be used to support video streaming between cameras and viewers.Streaming API works over
 * websocket protocol. All API methods use only JSON data format.There is an separate API method to obtain a streaming
 * session ID using device (camera) or user credentials. Then this session ID is used in other API methods for
 * authentication.
 */
@injectable('DeviceStreamingApi')
export class DeviceStreamingApi {
  @inject('StreamingApi') public readonly streamingApi!: StreamingApi;
}
