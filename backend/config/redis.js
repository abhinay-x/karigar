import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

let redisClient;

export const connectRedis = async () => {
  try {
    // Allow opting out from Redis (e.g., in local/dev or CI)
    if (process.env.REDIS_DISABLED === 'true' || !process.env.REDIS_URL) {
      logger.warn('Redis disabled or no REDIS_URL provided. Caching will be skipped.');
      return null;
    }

    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_unfulfilled_commands: true,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('🔴 Redis Client Connected');
    });

    redisClient.on('ready', () => {
      logger.info('🔴 Redis Client Ready');
    });

    redisClient.on('end', () => {
      logger.warn('🔴 Redis Client Disconnected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    // Don't exit process for Redis failure, app can work without cache
    return null;
  }
};

export const getRedisClient = () => redisClient;
export { redisClient };

// Cache utility functions
export const cacheService = {
  async get(key) {
    try {
      if (!redisClient) return null;
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  async set(key, value, ttl = 3600) {
    try {
      if (!redisClient) return false;
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  },

  async del(key) {
    try {
      if (!redisClient) return false;
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  },

  async exists(key) {
    try {
      if (!redisClient) return false;
      return await redisClient.exists(key);
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }
};
