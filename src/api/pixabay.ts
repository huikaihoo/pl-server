import { searchImages } from 'pixabay-api';

import { ImageSearchApi, ImageSearchResult } from './';
import config from '../config';

class PixabayApi extends ImageSearchApi {
  constructor(publicKey: string, privateKey: string) {
    super(publicKey, privateKey);
    this.source = 'Pixabay';
  }

  public async searchImage(keyword: string): Promise<ImageSearchResult[]> {
    try {
      const rawResults = await searchImages(this.publicKey, keyword, {
        per_page: config.maxImagesPerSource,
      });

      return rawResults.hits.map(raw => {
        return {
          image_ID: raw.id.toString(),
          thumbnails: (raw as any).previewURL,
          preview: (raw as any).largeImageURL,
          title: '',
          source: this.source,
          tags: raw.tags.split(',').map(tag => tag.trim()),
        };
      });
    } catch (err) {
      console.log(err);
    }

    return [];
  }
}

export default PixabayApi;
