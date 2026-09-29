import { createClient } from 'redis';
import { env } from './env.js';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connected'));

export const connectRedis = async () => {
  await redisClient.connect();
};
