import config from '../config';
import { imageResultFields } from './mock.data';
import PixabayApi from '../api/pixabay';
import StoryblocksApi from '../api/storyblocks';
import UnsplashApi from '../api/unsplash';

const keyword = 'cat';

describe('external api test', () => {
  test('Pixabay API', async () => {
    const pixabayApi = new PixabayApi(config.pixabayPublicKey, config.pixabayPrivateKey);
    const results = await pixabayApi.searchImage(keyword);

    console.log('Pixabay', results.length, results[0]);

    expect(Array.isArray(results)).toBe(true);
    expect(results.length > 0).toBeTruthy();
    expect(Object.keys(results[0])).toEqual(expect.arrayContaining(imageResultFields));
  });

  test('Storyblocks API', async () => {
    const storyblocksApi = new StoryblocksApi(config.storyblocksPublicKey, config.storyblocksPrivateKey);
    const results = await storyblocksApi.searchImage(keyword);

    console.log('Storyblocks', results.length, results[0]);

    expect(Array.isArray(results)).toBe(true);
    expect(results.length > 0).toBeTruthy();
    expect(Object.keys(results[0])).toEqual(expect.arrayContaining(imageResultFields));
  });

  test('Unsplash API', async () => {
    const unsplashApi = new UnsplashApi(config.unsplashPublicKey, config.unsplashPrivateKey);
    const results = await unsplashApi.searchImage(keyword);

    console.log('Unsplash', results.length, results[0]);

    expect(Array.isArray(results)).toBe(true);
    expect(results.length > 0).toBeTruthy();
    expect(Object.keys(results[0])).toEqual(expect.arrayContaining(imageResultFields));
  });
});
