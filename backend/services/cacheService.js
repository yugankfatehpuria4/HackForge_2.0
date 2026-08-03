/**
 * Redis-backed cache for the Express API.
 *
 * server.js used to `require('../lib/cache')`, which is a TypeScript source
 * file. Node cannot load .ts, so the require always threw and caching was
 * silently disabled in every environment. This is the plain-JS equivalent.
 *
 * Every method degrades to a no-op when Redis is unreachable, so the API keeps
 * working without a cache server.
 */

let Redis;
try {
  Redis = require('ioredis');
} catch (error) {
  Redis = null;
}

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;

    if (!Redis) {
      console.log('⚠️  ioredis not installed — cache disabled');
      return;
    }

    // Only connect when the app was actually configured for Redis, otherwise
    // ioredis retries a non-existent localhost server forever in production.
    if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
      console.log('⚠️  REDIS_URL/REDIS_HOST not set — cache disabled');
      return;
    }

    try {
      this.client = process.env.REDIS_URL
        ? new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 })
        : new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD || undefined,
            lazyConnect: true,
            maxRetriesPerRequest: 2,
          });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Redis connected');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        console.warn('⚠️  Redis error:', err.message);
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      this.client.connect().catch((err) => {
        this.isConnected = false;
        console.warn('⚠️  Redis unavailable:', err.message);
      });
    } catch (error) {
      console.warn('⚠️  Failed to initialise Redis:', error.message);
      this.client = null;
    }
  }

  get enabled() {
    return !!this.client;
  }

  async get(key) {
    if (!this.isConnected || !this.client) return null;

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Cache get error:', error.message);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.warn('Cache set error:', error.message);
    }
  }

  async del(key) {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.warn('Cache del error:', error.message);
    }
  }
}

module.exports = new CacheService();
