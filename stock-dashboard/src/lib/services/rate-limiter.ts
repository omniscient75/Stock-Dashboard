import { IRateLimiter } from './data-source.types';

interface RateLimitRecord {
  requests: number[];
  dailyRequests: number;
  lastReset: number;
}

/**
 * Sliding Window Rate Limiter
 * 
 * WHY sliding window:
 * - More accurate than fixed window
 * - Prevents burst traffic at window boundaries
 * - Better for API rate limiting
 */
export class SlidingWindowRateLimiter implements IRateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private readonly windowSize: number; // in milliseconds
  private readonly maxRequests: number;
  private readonly dailyLimit: number;

  constructor(
    windowSize: number = 60 * 1000, // 1 minute
    maxRequests: number = 100,
    dailyLimit: number = 1000
  ) {
    this.windowSize = windowSize;
    this.maxRequests = maxRequests;
    this.dailyLimit = dailyLimit;
    
    // Clean up old records every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  canMakeRequest(identifier: string): boolean {
    const record = this.getOrCreateRecord(identifier);
    const now = Date.now();
    
    // Check daily limit
    if (this.isNewDay(record.lastReset)) {
      record.dailyRequests = 0;
      record.lastReset = now;
    }
    
    if (record.dailyRequests >= this.dailyLimit) {
      return false;
    }
    
    // Remove old requests outside the sliding window
    record.requests = record.requests.filter(
      timestamp => now - timestamp < this.windowSize
    );
    
    return record.requests.length < this.maxRequests;
  }

  recordRequest(identifier: string): void {
    const record = this.getOrCreateRecord(identifier);
    const now = Date.now();
    
    record.requests.push(now);
    record.dailyRequests++;
  }

  getRemainingRequests(identifier: string): number {
    const record = this.getOrCreateRecord(identifier);
    const now = Date.now();
    
    // Remove old requests
    record.requests = record.requests.filter(
      timestamp => now - timestamp < this.windowSize
    );
    
    return Math.max(0, this.maxRequests - record.requests.length);
  }

  getResetTime(identifier: string): Date {
    const record = this.getOrCreateRecord(identifier);
    const now = Date.now();
    
    if (record.requests.length === 0) {
      return new Date(now + this.windowSize);
    }
    
    // Find the oldest request in the window
    const oldestRequest = Math.min(...record.requests);
    return new Date(oldestRequest + this.windowSize);
  }

  private getOrCreateRecord(identifier: string): RateLimitRecord {
    if (!this.records.has(identifier)) {
      this.records.set(identifier, {
        requests: [],
        dailyRequests: 0,
        lastReset: Date.now(),
      });
    }
    
    return this.records.get(identifier)!;
  }

  private isNewDay(lastReset: number): boolean {
    const now = new Date();
    const lastResetDate = new Date(lastReset);
    
    return (
      now.getFullYear() !== lastResetDate.getFullYear() ||
      now.getMonth() !== lastResetDate.getMonth() ||
      now.getDate() !== lastResetDate.getDate()
    );
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [identifier, record] of this.records.entries()) {
      // Remove old requests
      record.requests = record.requests.filter(
        timestamp => now - timestamp < this.windowSize
      );
      
      // Remove records with no recent activity
      if (record.requests.length === 0 && this.isNewDay(record.lastReset)) {
        this.records.delete(identifier);
      }
    }
  }

  // Utility methods for monitoring
  getStats(identifier: string): {
    currentRequests: number;
    maxRequests: number;
    dailyRequests: number;
    dailyLimit: number;
    resetTime: Date;
  } {
    const record = this.getOrCreateRecord(identifier);
    const now = Date.now();
    
    // Clean up old requests
    record.requests = record.requests.filter(
      timestamp => now - timestamp < this.windowSize
    );
    
    return {
      currentRequests: record.requests.length,
      maxRequests: this.maxRequests,
      dailyRequests: record.dailyRequests,
      dailyLimit: this.dailyLimit,
      resetTime: this.getResetTime(identifier),
    };
  }
}

/**
 * Token Bucket Rate Limiter
 * 
 * WHY token bucket:
 * - Allows burst traffic up to bucket capacity
 * - Smooth rate limiting
 * - Good for variable rate APIs
 */
export class TokenBucketRateLimiter implements IRateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>();
  private readonly capacity: number;
  private readonly refillRate: number; // tokens per second
  private readonly dailyLimit: number;
  private dailyUsage = new Map<string, { count: number; lastReset: number }>();

  constructor(
    capacity: number = 100,
    refillRate: number = 1, // 1 token per second
    dailyLimit: number = 1000
  ) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.dailyLimit = dailyLimit;
  }

  canMakeRequest(identifier: string): boolean {
    const bucket = this.getOrCreateBucket(identifier);
    const dailyUsage = this.getDailyUsage(identifier);
    const now = Date.now();
    
    // Check daily limit
    if (this.isNewDay(dailyUsage.lastReset)) {
      dailyUsage.count = 0;
      dailyUsage.lastReset = now;
    }
    
    if (dailyUsage.count >= this.dailyLimit) {
      return false;
    }
    
    // Refill tokens
    this.refillTokens(bucket, now);
    
    return bucket.tokens >= 1;
  }

  recordRequest(identifier: string): void {
    const bucket = this.getOrCreateBucket(identifier);
    const dailyUsage = this.getDailyUsage(identifier);
    
    bucket.tokens = Math.max(0, bucket.tokens - 1);
    dailyUsage.count++;
  }

  getRemainingRequests(identifier: string): number {
    const bucket = this.getOrCreateBucket(identifier);
    const now = Date.now();
    
    this.refillTokens(bucket, now);
    
    return Math.floor(bucket.tokens);
  }

  getResetTime(identifier: string): Date {
    const bucket = this.getOrCreateBucket(identifier);
    const now = Date.now();
    
    if (bucket.tokens >= 1) {
      return new Date(now);
    }
    
    const tokensNeeded = 1 - bucket.tokens;
    const timeToRefill = (tokensNeeded / this.refillRate) * 1000;
    
    return new Date(now + timeToRefill);
  }

  private getOrCreateBucket(identifier: string): { tokens: number; lastRefill: number } {
    if (!this.buckets.has(identifier)) {
      this.buckets.set(identifier, {
        tokens: this.capacity,
        lastRefill: Date.now(),
      });
    }
    
    return this.buckets.get(identifier)!;
  }

  private getDailyUsage(identifier: string): { count: number; lastReset: number } {
    if (!this.dailyUsage.has(identifier)) {
      this.dailyUsage.set(identifier, {
        count: 0,
        lastReset: Date.now(),
      });
    }
    
    return this.dailyUsage.get(identifier)!;
  }

  private refillTokens(bucket: { tokens: number; lastRefill: number }, now: number): void {
    const timePassed = (now - bucket.lastRefill) / 1000; // Convert to seconds
    const tokensToAdd = timePassed * this.refillRate;
    
    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  private isNewDay(lastReset: number): boolean {
    const now = new Date();
    const lastResetDate = new Date(lastReset);
    
    return (
      now.getFullYear() !== lastResetDate.getFullYear() ||
      now.getMonth() !== lastResetDate.getMonth() ||
      now.getDate() !== lastResetDate.getDate()
    );
  }

  // Utility methods for monitoring
  getStats(identifier: string): {
    currentTokens: number;
    capacity: number;
    refillRate: number;
    dailyUsage: number;
    dailyLimit: number;
    nextRefill: Date;
  } {
    const bucket = this.getOrCreateBucket(identifier);
    const dailyUsage = this.getDailyUsage(identifier);
    const now = Date.now();
    
    this.refillTokens(bucket, now);
    
    return {
      currentTokens: bucket.tokens,
      capacity: this.capacity,
      refillRate: this.refillRate,
      dailyUsage: dailyUsage.count,
      dailyLimit: this.dailyLimit,
      nextRefill: this.getResetTime(identifier),
    };
  }
}

/**
 * Rate Limiter Factory
 */
export class RateLimiterFactory {
  static createSlidingWindow(
    windowSize?: number,
    maxRequests?: number,
    dailyLimit?: number
  ): IRateLimiter {
    return new SlidingWindowRateLimiter(windowSize, maxRequests, dailyLimit);
  }

  static createTokenBucket(
    capacity?: number,
    refillRate?: number,
    dailyLimit?: number
  ): IRateLimiter {
    return new TokenBucketRateLimiter(capacity, refillRate, dailyLimit);
  }

  static createRateLimiter(
    type: 'sliding-window' | 'token-bucket',
    options?: any
  ): IRateLimiter {
    switch (type) {
      case 'sliding-window':
        return this.createSlidingWindow(
          options?.windowSize,
          options?.maxRequests,
          options?.dailyLimit
        );
      case 'token-bucket':
        return this.createTokenBucket(
          options?.capacity,
          options?.refillRate,
          options?.dailyLimit
        );
      default:
        throw new Error(`Unknown rate limiter type: ${type}`);
    }
  }
}
