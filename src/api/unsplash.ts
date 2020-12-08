import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

import { ImageSearchApi, ImageSearchResult } from '.';
import config from '../config';

class UnsplashApi extends ImageSearchApi {
  private unsplash;

  constructor(publicKey: string, privateKey: string) {
    super(publicKey, privateKey);
    super.source = 'Unsplash';
    this.unsplash = createApi({
      accessKey: publicKey,
      fetch: nodeFetch as any,
    });
  }

  public async searchImage(keyword: string): Promise<ImageSearchResult[]> {
    try {
      const rawResults = await this.unsplash.search.getPhotos({
        query: keyword,
        per_page: config.maxImagesPerSource,
      } as any);
      if (rawResults.type === 'success') {
        return rawResults.response.results.map((raw: any) => {
          return {
            image_ID: raw.id.toString(),
            thumbnails: raw.urls.thumb,
            preview: raw.urls.regular,
            title: raw.description ? raw.description : '',
            source: this.source,
            tags: raw.tags.map((tag: any) => tag.title.trim()),
          };
        });
      }
    } catch (err) {
      console.log(err);
    }

    return [];
  }
}

export default UnsplashApi;
