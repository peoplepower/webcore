import { ApiResponseBase } from '../../../models/apiResponseBase';
import { ParamDisplayType } from '../devicesConfiguration/getDeviceParametersApiResponse'

export interface GetUserPropertiesApiResponse extends ApiResponseBase {
  properties: Array<{
    name: string;
    value: string;
    displayType?: ParamDisplayType;
  }>;
}
