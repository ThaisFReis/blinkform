import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    // Support both REDIS_URL (cloud) and host/port (local)
    const redisUrl = process.env.REDIS_URL;
    this.client = redisUrl
      ? createClient({ url: redisUrl })
      : createClient({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
        });
    this.client.connect();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.client.setEx(key, ttl, value);
    }
    return this.client.set(key, value);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}