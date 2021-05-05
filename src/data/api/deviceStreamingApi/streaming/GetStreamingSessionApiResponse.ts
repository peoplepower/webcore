import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetStreamingSessionApiResponse extends ApiResponseBase {

  /**
   * Video streaming server host and port. Empty if device is disconnected from streaming server.
   */
  videoServer?: string;

  /**
   * true, if the connection to the video server is over SSL
   */
  videoServerSsl?: boolean;

  /**
   * Streaming session ID, if the client has to use this streaming API server
   */
  sessionId?: string;
}
