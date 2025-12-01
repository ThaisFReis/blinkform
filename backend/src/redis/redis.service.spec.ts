import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

// Mock the redis module at the top level
jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

describe('RedisService', () => {
  let service: RedisService;
  let mockClient: any;

  beforeEach(async () => {
    // Mock environment variables to prevent actual Redis connection
    process.env.REDIS_URL = 'redis://mock:6379';

    // Mock the Redis client
    mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      set: jest.fn(),
      setEx: jest.fn(),
      del: jest.fn(),
      on: jest.fn(),
    };

    // Set up the mock to return our mock client
    const { createClient } = require('redis');
    (createClient as jest.Mock).mockReturnValue(mockClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.REDIS_URL;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to Redis successfully', async () => {
      mockClient.connect.mockResolvedValue(undefined);

      await (service as any).onModuleInit();

      expect(mockClient.connect).toHaveBeenCalled();
    });

    it('should handle Redis connection errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClient.connect.mockRejectedValue(new Error('Connection failed'));

      await (service as any).onModuleInit();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to connect to Redis:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('get', () => {
    it('should return value from Redis', async () => {
      const key = 'test-key';
      const value = 'test-value';
      mockClient.get.mockResolvedValue(value);

      const result = await service.get(key);

      expect(mockClient.get).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });

    it('should return null on Redis error', async () => {
      const key = 'test-key';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClient.get.mockRejectedValue(new Error('Redis error'));

      const result = await service.get(key);

      expect(mockClient.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Redis get error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('set', () => {
    it('should set value without TTL', async () => {
      const key = 'test-key';
      const value = 'test-value';
      mockClient.set.mockResolvedValue('OK');

      const result = await service.set(key, value);

      expect(mockClient.set).toHaveBeenCalledWith(key, value);
      expect(result).toBe('OK');
    });

    it('should set value with TTL', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const ttl = 3600;
      mockClient.setEx.mockResolvedValue('OK');

      const result = await service.set(key, value, ttl);

      expect(mockClient.setEx).toHaveBeenCalledWith(key, ttl, value);
      expect(result).toBe('OK');
    });

    it('should return null on Redis set error', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClient.set.mockRejectedValue(new Error('Redis error'));

      const result = await service.set(key, value);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Redis set error:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should return null on Redis setEx error', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const ttl = 3600;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClient.setEx.mockRejectedValue(new Error('Redis error'));

      const result = await service.set(key, value, ttl);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Redis set error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('del', () => {
    it('should delete key from Redis', async () => {
      const key = 'test-key';
      mockClient.del.mockResolvedValue(1);

      const result = await service.del(key);

      expect(mockClient.del).toHaveBeenCalledWith(key);
      expect(result).toBe(1);
    });

    it('should return null on Redis delete error', async () => {
      const key = 'test-key';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClient.del.mockRejectedValue(new Error('Redis error'));

      const result = await service.del(key);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Redis del error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});