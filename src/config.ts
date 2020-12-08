import dotenv from 'dotenv';

dotenv.config();

const getDBUri = () => {
  if (process.env.POSTGRES_HOST && process.env.POSTGRES_DB && process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && process.env.POSTGRES_PORT && process.env.POSTGRES_TEST_PORT) {
    if (process.env.NODE_ENV === 'TEST') {
      return `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_TEST_PORT}/${process.env.POSTGRES_DB}`;
    }
    return `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
  }
};

const getRedisUri = () => {
  if (process.env.REDIS_HOST && process.env.REDIS_PORT && process.env.REDIS_TEST_PORT && process.env.REDIS_PASSWORD) {
    if (process.env.NODE_ENV === 'TEST') {
      return `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_TEST_PORT}/0`;
    }
    return `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`;
  }
};

export interface IConfig {
  // server related
  nodeEnv: string;
  enableCors: boolean;
  host: string;
  port: string;
  // auth related
  saltRounds: number;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  // postgres related
  dbUri: string;
  // redis related
  redisUri: string;
  // image apis relateds
  maxImagesPerSource: number;
  cacheExpiryTime: number;
  pixabayPublicKey: string;
  pixabayPrivateKey: string;
  storyblocksPublicKey: string;
  storyblocksPrivateKey: string;
  unsplashPublicKey: string;
  unsplashPrivateKey: string;
}

const config: IConfig = {
  nodeEnv: process.env.NODE_ENV || '',
  enableCors: process.env.ENABLE_CORS === 'true',
  host: process.env.HOST || 'http://localhost',
  port: process.env.PORT || '4000',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'a_secret',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'r_secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '20m',
  refreshTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1d',
  dbUri: getDBUri() || '',
  redisUri: getRedisUri() || '',
  maxImagesPerSource: parseInt(process.env.MAX_IMAGES_PER_SOURCE || '20', 10),
  cacheExpiryTime: parseInt(process.env.CACHE_EXPIRY_TIME || '60', 10),
  pixabayPublicKey: process.env.P_PUBLIC_KEY || '',
  pixabayPrivateKey: process.env.P_PRIVATE_KEY || '',
  storyblocksPublicKey: process.env.S_PUBLIC_KEY || '',
  storyblocksPrivateKey: process.env.S_PRIVATE_KEY || '',
  unsplashPublicKey: process.env.U_PUBLIC_KEY || '',
  unsplashPrivateKey: process.env.U_PRIVATE_KEY || '',
};

export default config;
