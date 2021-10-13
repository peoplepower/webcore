import { ApiResponseBase } from '../../../models/apiResponseBase';
import { ParamDisplayType } from '../devicesConfiguration/getDeviceParametersApiResponse';

/**
 * How device paired with the system.
 */
export enum DevicePairingType {
  QRCodeScan = 1,
  Native = 2,
  OAuth2 = 4,
  ZigBee = 8,
  WiFi = 16,
  GenerateQRCode = 32,
}

/**
 * Position types for device list UI at frontend level.
 */
export enum ParamPositionType {
  RightAlignedFirst = 0,
  RightAlignedSecond = 1,
  Subtitle = 2,
}

export interface GetDeviceModelsApiResponse extends ApiResponseBase {
  categories: Array<{
    id: number;
    parentId?: number;
    icon: string;
    search?: string;
    hidden: boolean;
    sortId: number;
    name?: {
      [key: string]: string;
    };

    /**
     * Device models within specific category.
     */
    models?: Array<{
      id: string;
      manufacturer?: {
        [key: string]: string;
      };
      pairingType: DevicePairingType;
      oauthAppId?: number;

      /**
       * Set to 'true' if model should be hidden at UI level.
       */
      hidden: boolean;

      sortId: number;
      name?: {
        [key: string]: string;
      };
      desc?: {
        [key: string]: string;
      };
      dependencyDeviceTypes?: number[];
      template?: string;
      media: Array<{
        id: string;
        mediaType: number;
        url: string;
        contentType: string;
        desc?: {
          [key: string]: string;
        };
      }>;
      lookupParams?: Array<{
        deviceType?: number;
        params?: Array<{
          name: string;
          value: string;
        }>;
      }>;
      calibrationParams?: {
        [key: string]: string;
      };
      displayInfo?: {
        controllable?: boolean;
        rebootable?: boolean;
        locationSpaces?: number[];
        deviceListBindings?: Array<{
          name: string;
          position: ParamPositionType;
          displayType?: ParamDisplayType;
        }>;
        parameters?: Array<{
          name: string;
          defaultOption?: number;
          availableOptions?: number[];
          linkedParams?: string[];
        }>;
      };
    }>;
  }>;
}
