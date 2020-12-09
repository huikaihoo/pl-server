import config from '../config';
import PixabayApi from '../api/pixabay';
import StoryblocksApi from '../api/storyblocks';
import UnsplashApi from '../api/unsplash';

const apiTest = async (keyword: string) => {
  // Pixabay API
  const pixabayApi = new PixabayApi(config.pixabayPublicKey, config.pixabayPrivateKey);
  const resultsP = await pixabayApi.searchImage(keyword);
  console.log('pixabay', resultsP.length, resultsP[0]);

  // Storyblocks API
  const storyblocksApi = new StoryblocksApi(config.storyblocksPublicKey, config.storyblocksPrivateKey);
  const resultsS = await storyblocksApi.searchImage(keyword);
  console.log('storyblocks', resultsS.length, resultsS[0]);

  // Unsplash API
  const unsplashApi = new UnsplashApi(config.unsplashPublicKey, config.unsplashPrivateKey);
  const resultsU = await unsplashApi.searchImage(keyword);
  console.log('unsplash', resultsU.length, resultsU[0]);
};

apiTest('cat');
