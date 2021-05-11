import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface PutStoriesApiResponse extends ApiResponseBase {}

export interface StoriesModel {
  stories: Array<{
    id: string;
    models?: Array<{
      id: string;
      brand: string;
    }>;
    brands?: Array<string>;
    storyType: number;
    lang: string;
    sortId: number;
    title: string;
    search: string;
    pages: Array<{
      index: number;
      hidden: boolean;
      subtitle: string;
      desc: string;
      style: string;
      content: string;
      media: Array<{
        id: string;
      }>;
    }>;
  }>;
}
