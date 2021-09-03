import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { DevicePairingType, GetDeviceModelsApiResponse } from './getDeviceModelsApiResponse';
import { DeviceModelsModel, UploadDeviceModelsApiResponse } from './uploadDeviceModelsApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * ===================================================================================
 *  WARNING: DO NOT COVER WITH INTEGRATION TESTS UNLESS CONFIRMED BY DMITRY SHIRKALIN
 *  FINAL WARNING: OR HE WILL DDOS YOU AND ALL YOUR FAMILY, FRIENDS, LOVERS AND PETS
 * ===================================================================================
 */

/**
 * Device Models API.
 * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/device-models}
 *
 * Supported device models and categories. Data is returned for one brand only. If the brand parameter is not set, data for the default brand is returned.
 * Categories can be organizaed in hierarchies without specific schema.
 */
@injectable('DeviceModelsApi')
export class DeviceModelsApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Gets the device categories and models for specific brand.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/device-models/get-device-models}
   *
   * @param [params] Request parameters.
   * @param {string} [params.modelId] Particular device model to return.
   * @param {string} [params.brand] Get text data for specific brand, otherwise data for default brand returned.
   * @param {string} [params.lang] Get text data for specific language, otherwise - data for all languages.
   * @param {boolean} [params.hidden] Request hidden categories and brand, which are not returned by default.
   * @param {string} [params.searchBy] Search criterion. Use * for a wildcard.
   * @param {number} [params.includePairingType] Filter models by pairing type bitmask.
   * @param {number} [params.excludePairingType] Exclude models by pairing type bitmask.
   * @returns {Promise<GetDeviceModelsApiResponse>}
   */
  getDeviceModels(params?: {
    modelId?: string;
    brand?: string;
    lang?: string;
    hidden?: boolean;
    searchBy?: string;
    includePairingType?: DevicePairingType;
    excludePairingType?: DevicePairingType;
  }): Promise<GetDeviceModelsApiResponse> {
    return this.dal.get('devicemodels', {params: params});
  }

  /**
   * Uploads a catalog of device models and categories.
   * Data can be updated for a particular specific brand(s), while other brands data will not be affected.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/device-models/upload-device-models}
   *
   * @param {DeviceModelsModel} data Data for the device models to upload.
   * @returns {Promise<UploadDeviceModelsApiResponse>}
   */
  uploadDeviceModels(data: DeviceModelsModel): Promise<UploadDeviceModelsApiResponse> {
    return this.dal.put('devicemodels', data);
  }

  /**
   * Delete data for specific device model, category and brand.
   * Either modelId or categoryId parameters are mandatory.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/device-models/delete-device-models}
   *
   * @param params Request parameters
   * @param {string} [params.modelId] Remove data for specific device model
   * @param {string} [params.brand] Remove model or category only for this brand
   * @param {number} [params.categoryId] Remove data for specific category.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteDeviceModels(params?: { brand?: string; modelId?: string; categoryId?: number }): Promise<ApiResponseBase> {
    return this.dal.delete('devicemodels', {params: params});
  }
}
