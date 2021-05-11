import { ApiResponseBase } from '../../../models/apiResponseBase';
import { MeasurementsHistoryUpdateBehavior, ParamDisplayType, ParamValueType, UnitMultipliers } from './getDeviceParametersApiResponse';

export interface CreateOrUpdateDeviceParameterApiResponse extends ApiResponseBase {}

export interface DeviceParameterModel {
  deviceParam: {
    name: string;
    description: string;
    systemUnit: string;
    systemMultiplier: UnitMultipliers;
    numeric: boolean;
    profiled: boolean;
    configured: boolean;
    historical: MeasurementsHistoryUpdateBehavior;
    scale: number;
    adjustment: boolean;
    displayInfo?: {
      displayType: ParamDisplayType;
      valueType: ParamValueType;
      defaultOption?: number;
      mlName: {
        [key: string]: string;
      };
      options?: Array<{
        id: number;
        value: string;
        mlName: {
          [key: string]: string;
        };
      }>;
      linkedParams?: string[];
      minValue?: number;
      maxValue?: number;
      step?: number;
    };
  };
}
