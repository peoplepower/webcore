import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { EntityStoriesApi } from '../api/app/entityStories/entityStoriesApi';
import { GetStoriesApiResponse } from '../api/app/entityStories/getStoriesApiResponse';

@injectable('StoriesService')
export class StoriesService extends BaseService {
  @inject('EntityStoriesApi') protected readonly entityStoriesApi!: EntityStoriesApi;

  /**
   * Gets entity stories.
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
    return this.entityStoriesApi.getStories(params);
  }
}
