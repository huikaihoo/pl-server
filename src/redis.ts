import Redis from 'ioredis';
import config from './config';

const redis = new Redis(config.redisUri);

redis.on('connect', () => {
  console.log('Connected to redis!');
});

export default redis;
