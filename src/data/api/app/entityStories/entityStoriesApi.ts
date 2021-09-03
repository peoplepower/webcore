import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { PutStoriesApiResponse, StoriesModel } from './putStoriesApiResponse';
import { GetStoriesApiResponse } from './getStoriesApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Entity stories API.
 * Provides methods to get or update entity stories.
 * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/stories}
 */
@injectable('EntityStoriesApi')
export class EntityStoriesApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Gets entity stories.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/stories/get-stories}
   *
   * @param [params] Request parameters.
   * @param {string} [params.storyId] Get specific story by ID.
   * @param {string} [params.modelId] Filter stories by device model.
   * @param {string} [params.brand] Filter stories by brand.
   * @param {string} [params.lang] Get stories for specific language, otherwise stories for all languages returned.
   * @param {boolean} [params.hidden] Request hidden pages, which are not returned by default.
   * @param {string} [params.searchBy] Search criterion. Use * for a wildcard.
   * @param {number} [params.storyType] Filter stories by type.
   * @returns {Promise<GetStoriesApiResponse>}
   */
  getStories(params?: {
    storyId?: string;
    modelId?: string;
    brand?: string;
    storyType?: number;
    lang?: string;
    hidden?: boolean;
    searchBy?: string;
  }): Promise<GetStoriesApiResponse> {
    return this.dal.get('stories', {params: params});
  }

  /**
   * Insert new stories or update existing stories.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/stories/put-stories}
   *
   * @param {StoriesModel} data Data for the stories to send to server.
   * @returns {Promise<PutStoriesApiResponse>}
   */
  putStories(data: StoriesModel): Promise<PutStoriesApiResponse> {
    return this.dal.put('stories', data);
  }

  /**
   * Removes story by story ID.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/stories/delete-story}
   *
   * @param {string} storyId Story ID to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteStory(storyId: string): Promise<ApiResponseBase> {
    return this.dal.delete('stories', {params: {storyId: storyId}});
  }
}
