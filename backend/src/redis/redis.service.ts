import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client;

  constructor() {
    // Support both REDIS_URL (cloud) and host/port (local)
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;

    // If no Redis configuration provided, use no-op client
    if (!redisUrl && !redisHost) {
      this.client = {
        get: async () => null,
        set: async () => null,
        setEx: async () => null,
        del: async () => null,
      } as any;
      return;
    }

    this.client = redisUrl
      ? createClient({ url: redisUrl.replace('redis://', 'rediss://') })
      : createClient({
          socket: {
            host: redisHost || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
        });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
  }

  async onModuleInit() {
    // Skip if using no-op client
    if (!this.client.connect) {
      return;
    }

    try {
      // Add timeout to prevent hanging
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
      );

      await Promise.race([connectPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      // Disconnect the client to stop retry attempts
      try {
        await this.client.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      // Continue without Redis - make client a no-op
      this.client = {
        get: async () => null,
        set: async () => null,
        setEx: async () => null,
        del: async () => null,
      } as any;
    }
  }

  async get(key: string) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number) {
    try {
      if (ttl) {
        return await this.client.setEx(key, ttl, value);
      }
      return await this.client.set(key, value);
    } catch (error) {
      console.error('Redis set error:', error);
      return null;
    }
  }

  async del(key: string) {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
      return null;
    }
  }
}