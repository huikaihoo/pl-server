import axios from 'axios';
import http from 'http';
import https from 'https';
import crypto from 'crypto';

import { ImageSearchApi, ImageSearchResult } from '.';
import config from '../config';

class StoryblocksApi extends ImageSearchApi {
  private searchUri = '/api/v1/stock-items/search/';
  private storyblocks;

  constructor(publicKey: string, privateKey: string) {
    super(publicKey, privateKey);
    super.source = 'Storyblocks';
    this.storyblocks = axios.create({
      // keepAlive pools and reuses TCP connections, so it's faster
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      baseURL: 'https://api.graphicstock.com',
      responseType: 'json',
    });
  }

  private getParams() {
    // HMAC generation
    const expires = Math.floor(Date.now() / 1000);
    const hmacBuilder = crypto.createHmac('sha256', this.privateKey + expires);
    hmacBuilder.update(this.searchUri);
    const hmac = hmacBuilder.digest('hex');

    return {
      APIKEY: this.publicKey,
      EXPIRES: expires,
      HMAC: hmac,
    };
  }
  public async searchImage(keyword: string): Promise<ImageSearchResult[]> {
    try {
      const params = this.getParams();

      const rawResults = await this.storyblocks.get(this.searchUri, {
        params: {
          ...params,
          keywords: keyword,
          page: 1,
          num_results: config.maxImagesPerSource,
        },
      });

      return rawResults.data.info.map((raw: any) => {
        return {
          image_ID: raw.id.toString(),
          thumbnails: raw.thumbnail_url,
          preview: raw.preview_url,
          title: raw.title,
          source: this.source,
          tags: raw.keywords.split(',').map((tag: string) => tag.trim()),
        };
      });
    } catch (err) {
      console.log(err);
    }

    return [];
  }
}

export default StoryblocksApi;
