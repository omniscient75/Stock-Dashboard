import {
  IDataSource,
  DataSourceConfig,
  DataSourceResponse,
  DataSourceError,
  DataSourceErrorCode,
  QueryOptions,
  SearchOptions,
  StockDataPoint,
  LatestPriceData,
  CompanyData,
} from './data-source.types';
import { ICache } from './data-source.types';
import { IRateLimiter } from './data-source.types';
import { MemoryCache } from './cache';
import { SlidingWindowRateLimiter } from './rate-limiter';

/**
 * Base Data Source Class
 * 
 * WHY this base class:
 * - Implements common functionality (retry, caching, rate limiting)
 * - Reduces code duplication across data sources
 * - Provides consistent error handling
 * - Enforces interface compliance
 */
export abstract class BaseDataSource implements IDataSource {
  public readonly name: string;
  public readonly config: DataSourceConfig;
  
  protected cache: ICache;
  protected rateLimiter: IRateLimiter;
  protected isHealthyStatus: boolean = true;

  constructor(name: string, config: DataSourceConfig) {
    this.name = name;
    this.config = config;
    
    // Initialize cache and rate limiter
    this.cache = new MemoryCache(1000, 5 * 60 * 1000); // 5 minutes TTL
    this.rateLimiter = new SlidingWindowRateLimiter(
      60 * 1000, // 1 minute window
      config.rateLimit.requestsPerMinute,
      config.rateLimit.requestsPerDay
    );
  }

  // Abstract methods that must be implemented by subclasses
  abstract getStockData(options: QueryOptions): Promise<DataSourceResponse<StockDataPoint[]>>;
  abstract getLatestPrice(symbol: string): Promise<DataSourceResponse<LatestPriceData>>;
  abstract getCompanyInfo(symbol: string): Promise<DataSourceResponse<CompanyData>>;
  abstract searchCompanies(options: SearchOptions): Promise<DataSourceResponse<CompanyData[]>>;

  /**
   * Health check implementation
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Try to make a simple request to test connectivity
      const testResponse = await this.getLatestPrice('AAPL');
      this.isHealthyStatus = testResponse.success;
      return this.isHealthyStatus;
    } catch (error) {
      this.isHealthyStatus = false;
      return false;
    }
  }

  /**
   * Rate limiting check
   */
  canMakeRequest(): boolean {
    return this.rateLimiter.canMakeRequest(this.name);
  }

  /**
   * Cache management
   */
  async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  /**
   * Protected method for making HTTP requests with retry logic
   */
  protected async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      // Check rate limiting
      if (!this.canMakeRequest()) {
        throw new Error('Rate limit exceeded');
      }

      // Make the request
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Record the request for rate limiting
      this.rateLimiter.recordRequest(this.name);

      // Handle different response status codes
      if (!response.ok) {
        const error = await this.handleHttpError(response, retryCount);
        throw error;
      }

      const data = await response.json();
      
      // Log successful request
      console.log(`[${this.name}] Request successful: ${url} (${Date.now() - startTime}ms)`);
      
      return data;
    } catch (error) {
      // Log failed request
      console.error(`[${this.name}] Request failed: ${url} (${Date.now() - startTime}ms)`, error);
      
      // Handle retry logic
      if (this.shouldRetry(error, retryCount)) {
        return this.retryRequest(url, options, retryCount);
      }
      
      throw this.createDataSourceError(error);
    }
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryRequest<T>(
    url: string,
    options: RequestInit,
    retryCount: number
  ): Promise<T> {
    const maxRetries = this.config.retryConfig.maxRetries;
    const retryDelay = this.config.retryConfig.retryDelay;
    const backoffMultiplier = this.config.retryConfig.backoffMultiplier;
    
    if (retryCount >= maxRetries) {
      throw new Error(`Max retries (${maxRetries}) exceeded`);
    }
    
    // Calculate delay with exponential backoff
    const delay = retryDelay * Math.pow(backoffMultiplier, retryCount);
    
    console.log(`[${this.name}] Retrying request in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the request
    return this.makeRequest(url, options, retryCount + 1);
  }

  /**
   * Determine if a request should be retried
   */
  private shouldRetry(error: any, retryCount: number): boolean {
    if (retryCount >= this.config.retryConfig.maxRetries) {
      return false;
    }
    
    // Retry on network errors, timeouts, and 5xx errors
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return true;
    }
    
    if (error.status >= 500 && error.status < 600) {
      return true;
    }
    
    // Don't retry on client errors (4xx) except for rate limiting
    if (error.status === 429) {
      return true;
    }
    
    return false;
  }

  /**
   * Handle HTTP errors and create appropriate error objects
   */
  private async handleHttpError(response: Response, retryCount: number): Promise<DataSourceError> {
    let errorMessage: string;
    let errorCode: DataSourceErrorCode;
    let retryable = false;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    switch (response.status) {
      case 401:
        errorCode = DataSourceErrorCode.INVALID_API_KEY;
        retryable = false;
        break;
      case 404:
        errorCode = DataSourceErrorCode.SYMBOL_NOT_FOUND;
        retryable = false;
        break;
      case 429:
        errorCode = DataSourceErrorCode.RATE_LIMIT_EXCEEDED;
        retryable = true;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorCode = DataSourceErrorCode.SERVICE_UNAVAILABLE;
        retryable = true;
        break;
      default:
        errorCode = DataSourceErrorCode.INVALID_RESPONSE;
        retryable = false;
    }
    
    return {
      code: errorCode,
      message: errorMessage,
      details: {
        status: response.status,
        statusText: response.statusText,
        retryCount,
      },
      retryable,
    };
  }

  /**
   * Create a standardized data source error
   */
  private createDataSourceError(error: any): DataSourceError {
    if (error.code && error.message) {
      return error as DataSourceError;
    }
    
    return {
      code: DataSourceErrorCode.NETWORK_ERROR,
      message: error.message || 'Unknown error occurred',
      details: error,
      retryable: true,
    };
  }

  /**
   * Create a successful response
   */
  protected createSuccessResponse<T>(
    data: T,
    cached: boolean = false,
    retryCount: number = 0
  ): DataSourceResponse<T> {
    return {
      success: true,
      data,
      source: this.name,
      timestamp: new Date().toISOString(),
      cached,
      retryCount,
    };
  }

  /**
   * Create an error response
   */
  protected createErrorResponse<T>(
    error: DataSourceError,
    retryCount: number = 0
  ): DataSourceResponse<T> {
    return {
      success: false,
      error: error.message,
      source: this.name,
      timestamp: new Date().toISOString(),
      retryCount,
    };
  }

  /**
   * Generate cache key for requests
   */
  protected generateCacheKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${this.name}:${prefix}:${sortedParams}`;
  }

  /**
   * Get data from cache or fetch if not available
   */
  protected async getCachedOrFetch<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<DataSourceResponse<T>> {
    try {
      // Try to get from cache first
      const cachedData = await this.cache.get<T>(cacheKey);
      
      if (cachedData !== null) {
        return this.createSuccessResponse(cachedData, true);
      }
      
      // Fetch fresh data
      const freshData = await fetchFn();
      
      // Cache the result
      await this.cache.set(cacheKey, freshData, ttl);
      
      return this.createSuccessResponse(freshData, false);
    } catch (error) {
      const dataSourceError = this.createDataSourceError(error);
      return this.createErrorResponse<T>(dataSourceError);
    }
  }

  /**
   * Utility method to normalize symbols
   */
  protected normalizeSymbol(symbol: string): string {
    return symbol.toUpperCase().trim();
  }

  /**
   * Utility method to validate symbols
   */
  protected validateSymbol(symbol: string): boolean {
    if (!symbol || typeof symbol !== 'string') {
      return false;
    }
    
    const normalized = this.normalizeSymbol(symbol);
    return /^[A-Z]{1,10}$/.test(normalized);
  }

  /**
   * Get rate limiter stats for monitoring
   */
  getRateLimitStats() {
    return this.rateLimiter.getStats ? this.rateLimiter.getStats(this.name) : null;
  }

  /**
   * Get cache stats for monitoring
   */
  getCacheStats() {
    if (this.cache.getStats) {
      return this.cache.getStats();
    }
    return null;
  }
}
