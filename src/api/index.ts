interface ImageSearchResult {
  image_ID: string;
  thumbnails: string;
  preview: string;
  title: string;
  source: string;
  tags: string[];
}

abstract class ImageSearchApi {
  protected source: string = '';
  protected publicKey: string;
  protected privateKey: string;

  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  async searchImage(keyword: string): Promise<ImageSearchResult[]> {
    return [];
  }

  getSource() {
    return this.source;
  }
}

export { ImageSearchApi, ImageSearchResult };
