import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetMediaApiResponse } from './getMediaApiResponse';
import { MediaModel, PutMediaApiResponse } from './putMediaApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Media API.
 * Provides methods to get, update and delete media.
 * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/media/}
 */
@injectable('MediaApi')
export class MediaApi {

  @inject('AppApiDal') protected readonly dal: AppApiDal;

  /**
   * Gets media.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/media/get-media}
   *
   * @param [params] Requested parameters.
   * @param {string} [params.mediaId] Gets media by it's ID.
   * @returns {Promise<GetMediaApiResponse>}
   */
  getMedia(params?: { mediaId?: string; }): Promise<GetMediaApiResponse> {
    return this.dal.get('media', {params: params});
  }

  /**
   * Updates media.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/media/put-media}
   *
   * @param {MediaModel} data Necessary data for the media.
   * @returns {Promise<PutMediaApiResponse>}
   */
  putMedia(data: MediaModel): Promise<PutMediaApiResponse> {
    return this.dal.put('media', data);
  }

  /**
   * Deletes specified media.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/media/delete-media}
   *
   * @param {{mediaId?: string}} params.mediaId Media ID to delete. Multiple values are supported.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteMedia(params?: { mediaId?: string | string[]; }): Promise<ApiResponseBase> {
    return this.dal.delete('media', {params: params});
  }
}
