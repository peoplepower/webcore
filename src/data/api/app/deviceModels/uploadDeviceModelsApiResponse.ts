import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UploadDeviceModelsApiResponse extends ApiResponseBase {}

export interface DeviceModelsModel {
  categories: Array<{
    id: number;
    icon: string;
    search: string;
    brands: Array<{
      brand: string;
      hidden: boolean;
      sortId: number;
      parentId?: number;
      name?: {
        [key: string]: string;
      };
    }>;
  }>;
  models: Array<{
    id: string;
    manufacturer?: {
      [key: string]: string;
    };
    pairingType: number;
    oauthAppId: number;
    deviceType: number;
    brands: Array<{
      brand: string;
      hidden: boolean;
      parentId: number;
      sortId: number;
      name?: {
        [key: string]: string;
      };
      desc?: {
        [key: string]: string;
      };
    }>;
    media: Array<{
      id: string;
    }>;
    lookupParams: Array<{
      deviceType: number;
      params: Array<{
        name: string;
        value: string;
      }>;
    }>;
  }>;
}
