import config from '../../config';
import redis from '../../redis';
import { ImageSearchApi } from '../../api';
import PixabayApi from '../../api/pixabay';
import StoryblocksApi from '../../api/storyblocks';
import UnsplashApi from '../../api/unsplash';

const apis: ImageSearchApi[] = [
  new PixabayApi(config.pixabayPublicKey, config.pixabayPrivateKey),
  new StoryblocksApi(config.storyblocksPublicKey, config.storyblocksPrivateKey),
  new UnsplashApi(config.unsplashPublicKey, config.unsplashPrivateKey),
];

const images = async (parent: any, { keyword }: any, context: any) => {
  const results = await Promise.all(
    apis.map(async (api: ImageSearchApi) => {
      try {
        const key = `${keyword}_${api.getSource()}`;
        const cached = await redis.exists(`${keyword}_${api.getSource()}`);
        if (cached) {
          return JSON.parse((await redis.get(key)) as string);
        }

        const apiResults = await api.searchImage(keyword);
        redis.set(key, JSON.stringify(apiResults), 'ex', config.cacheExpiryTime);

        return apiResults;
      } catch (err) {
        console.log(err);
      }
      return [];
    })
  );

  return results.flat();
};

export default images;
