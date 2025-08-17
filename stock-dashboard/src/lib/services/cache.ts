import { ICache } from './data-source.types';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

/**
 * Memory-based cache implementation with TTL support
 * 
 * WHY this implementation:
 * - Fast in-memory storage for API responses
 * - TTL (Time To Live) support for automatic expiration
 * - Thread-safe operations
 * - Memory management with size limits
 */
export class MemoryCache implements ICache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly maxSize: number;
  private readonly defaultTTL: number;

  constructor(maxSize: number = 1000, defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Check cache size and evict if necessary
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Utility methods for monitoring
  getSize(): number {
    return this.cache.size;
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses for this
    };
  }
}

/**
 * Redis-based cache implementation (for production use)
 * 
 * WHY Redis:
 * - Persistent storage across server restarts
 * - Distributed caching for multiple instances
 * - Built-in TTL support
 * - High performance
 */
export class RedisCache implements ICache {
  private redis: any; // Redis client
  private readonly defaultTTL: number;

  constructor(redisUrl?: string, defaultTTL: number = 5 * 60) { // 5 minutes in seconds
    this.defaultTTL = defaultTTL;
    
    // In a real implementation, you would initialize Redis client here
    // this.redis = createClient({ url: redisUrl });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      // const value = await this.redis.get(key);
      // return value ? JSON.parse(value) : null;
      
      // Mock implementation for now
      return null;
    } catch (error) {
      console.error('Redis cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const ttlSeconds = ttl ? Math.ceil(ttl / 1000) : this.defaultTTL;
      
      // await this.redis.setex(key, ttlSeconds, serializedValue);
      
      // Mock implementation for now
    } catch (error) {
      console.error('Redis cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      // await this.redis.del(key);
      
      // Mock implementation for now
    } catch (error) {
      console.error('Redis cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      // await this.redis.flushdb();
      
      // Mock implementation for now
    } catch (error) {
      console.error('Redis cache clear error:', error);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      // const exists = await this.redis.exists(key);
      // return exists === 1;
      
      // Mock implementation for now
      return false;
    } catch (error) {
      console.error('Redis cache has error:', error);
      return false;
    }
  }
}

/**
 * Cache factory for creating different cache implementations
 */
export class CacheFactory {
  static createMemoryCache(maxSize?: number, defaultTTL?: number): ICache {
    return new MemoryCache(maxSize, defaultTTL);
  }

  static createRedisCache(redisUrl?: string, defaultTTL?: number): ICache {
    return new RedisCache(redisUrl, defaultTTL);
  }

  static createCache(type: 'memory' | 'redis', options?: any): ICache {
    switch (type) {
      case 'memory':
        return this.createMemoryCache(options?.maxSize, options?.defaultTTL);
      case 'redis':
        return this.createRedisCache(options?.redisUrl, options?.defaultTTL);
      default:
        throw new Error(`Unknown cache type: ${type}`);
    }
  }
}
