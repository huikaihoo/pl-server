import { ImageSearchApi, ImageSearchResult } from '..';

class StoryblocksApi extends ImageSearchApi {
  constructor(publicKey: string, privateKey: string) {
    super(publicKey, privateKey);
    this.source = 'Storyblocks';
  }

  public async searchImage(keyword: string): Promise<ImageSearchResult[]> {
    if (keyword === `empty-${this.source}`) {
      throw Error();
    }
    return [...Array(4).keys()].map(index => {
      return {
        image_ID: `${this.source}_${index}`,
        thumbnails: `http://${this.source}/${index}/thumbnails`,
        preview: `http://${this.source}/${index}/preview`,
        title: `${keyword}_${index}`,
        source: this.source,
        tags: [keyword, `${keyword}_${index}`],
      };
    });
  }
}

export default StoryblocksApi;
