import { Redis } from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('Redis URL not configured. Caching disabled.');
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        enableReadyCheck: true,
      });

      redis.on('error', (error) => {
        console.error('Redis connection error:', error);
        redis = null;
      });

      redis.on('connect', () => {
        console.log('Redis connected successfully');
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      redis = null;
    }
  }

  return redis;
}

export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedisClient();
  if (!client) return null;
  
  try {
    return await client.get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttl?: number): Promise<void> {
  const client = getRedisClient();
  if (!client) return;
  
  try {
    if (ttl) {
      await client.setex(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;
  
  try {
    await client.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
} 