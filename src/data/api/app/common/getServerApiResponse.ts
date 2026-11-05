import { ApiResponseBase } from '../../../models/apiResponseBase';
import { ServerType } from './getApiSettingsApiResponse';

export interface GetServerApiResponse extends ApiResponseBase {
  server: {

    /**
     * Server's type as requested.
     */
    type: ServerType;

    host: string;
    port: number;
    ssl: boolean;

    /**
     * Server's path.
     */
    path?: string;

    /**
     * MQTT server TLS version.
     */
    tlsversion?: string;
  };

  /**
   * MQTT server specific properties.
   */
  mqtt?: {

    /**
     * Server root CA certificate.
     */
    cacrt: string;

    /**
     * Device certificate.
     */
    crt: string;

    /**
     * Device key.
     */
    key: string;

    /**
     * MQTT client ID.
     */
    clientId: string;

    /**
     * QOS1 usually.
     */
    qos: string;

    /**
     * MQTT topics prefix for publishing and subscription.
     */
    topicPrefix: string;
  };
}
