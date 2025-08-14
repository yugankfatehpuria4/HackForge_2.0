import Redis from 'ioredis';

class CacheService {
  private redis: Redis | null = null;
  private isConnected = false;

  constructor() {
    this.initRedis();
  }

  private async initRedis() {
    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.redis.on('connect', () => {
        console.log('✅ Redis connected');
        this.isConnected = true;
      });

      this.redis.on('error', (err) => {
        console.error('❌ Redis error:', err);
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        console.log('🔌 Redis connection closed');
        this.isConnected = false;
      });

      await this.redis.connect();
    } catch (error) {
      console.warn('⚠️ Redis not available, using in-memory fallback');
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<any | null> {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    if (!this.isConnected || !this.redis) {
      return;
    }

    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.redis) {
      return;
    }

    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache del error:', error);
    }
  }

  async flush(): Promise<void> {
    if (!this.isConnected || !this.redis) {
      return;
    }

    try {
      await this.redis.flushall();
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }

  // Generate cache key for API responses
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Cache decorator for API routes
export function withCache(ttl: number = 3600) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `api:${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      await cacheService.set(cacheKey, result, ttl);
      
      return result;
    };
  };
} 