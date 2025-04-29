import { ApiResponseBase } from '../../../models/apiResponseBase';
import { ParamDisplayType } from '../devicesConfiguration/getDeviceParametersApiResponse'

export interface UpdateUserPropertiesApiResponse extends ApiResponseBase {
}

export interface UpdateUserPropertiesModel {
  property: Array<{
    name: string;
    content: string;
    displayType?: ParamDisplayType;
  }>;
}
