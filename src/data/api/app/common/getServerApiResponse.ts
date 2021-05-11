import { ApiResponseBase } from '../../../models/apiResponseBase';
import { ServerType } from './getApiSettingsApiResponse';

export interface GetServerApiResponse extends ApiResponseBase {
  server: {
    type: ServerType;
    host: string;
    port: number;
    ssl: boolean;
    altPort: number;
    altSsl: boolean;
    path: string;
  };
}
