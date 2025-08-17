// Data Source Types and Interfaces

export interface StockDataPoint {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change?: number;
  changePercent?: number;
}

export interface LatestPriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
}

export interface CompanyData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: string;
  marketCap: number;
  peRatio?: number;
  dividendYield?: number;
  basePrice: number;
  volatility: number;
  avgVolume: number;
  description?: string;
}

export interface DataSourceConfig {
  name: string;
  enabled: boolean;
  priority: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  retryConfig: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
}

export interface DataSourceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
  timestamp: string;
  cached?: boolean;
  retryCount?: number;
}

export interface DataSourceError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}

export interface QueryOptions {
  symbol: string;
  startDate?: string;
  endDate?: string;
  interval?: 'daily' | 'weekly' | 'monthly';
  limit?: number;
  forceRefresh?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
}

export interface SearchOptions {
  query: string;
  type?: 'symbol' | 'name' | 'sector' | 'all';
  limit?: number;
}

// Data Source Interface
export interface IDataSource {
  readonly name: string;
  readonly config: DataSourceConfig;
  
  // Core methods
  getStockData(options: QueryOptions): Promise<DataSourceResponse<StockDataPoint[]>>;
  getLatestPrice(symbol: string): Promise<DataSourceResponse<LatestPriceData>>;
  getCompanyInfo(symbol: string): Promise<DataSourceResponse<CompanyData>>;
  searchCompanies(options: SearchOptions): Promise<DataSourceResponse<CompanyData[]>>;
  
  // Health check
  isHealthy(): Promise<boolean>;
  
  // Rate limiting
  canMakeRequest(): boolean;
  
  // Cache management
  clearCache(): Promise<void>;
}

// Data Source Factory
export interface IDataSourceFactory {
  createDataSource(type: string, config?: Partial<DataSourceConfig>): IDataSource;
  getAvailableSources(): string[];
  getDefaultSource(): string;
}

// Cache Interface
export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

// Rate Limiter Interface
export interface IRateLimiter {
  canMakeRequest(identifier: string): boolean;
  recordRequest(identifier: string): void;
  getRemainingRequests(identifier: string): number;
  getResetTime(identifier: string): Date;
}

// Data Transformer Interface
export interface IDataTransformer {
  transformStockData(rawData: any): StockDataPoint[];
  transformLatestPrice(rawData: any): LatestPriceData;
  transformCompanyData(rawData: any): CompanyData;
  normalizeSymbol(symbol: string): string;
}

// Error Types
export enum DataSourceErrorCode {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_API_KEY = 'INVALID_API_KEY',
  SYMBOL_NOT_FOUND = 'SYMBOL_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

// Data Source Types
export enum DataSourceType {
  MOCK = 'mock',
  ALPHA_VANTAGE = 'alpha_vantage',
  YAHOO_FINANCE = 'yahoo_finance',
  NSE_INDIA = 'nse_india',
  BSE_INDIA = 'bse_india',
}

// Configuration for different data sources
export const DATA_SOURCE_CONFIGS: Record<DataSourceType, DataSourceConfig> = {
  [DataSourceType.MOCK]: {
    name: 'Mock Data',
    enabled: true,
    priority: 1,
    rateLimit: {
      requestsPerMinute: 1000,
      requestsPerDay: 100000,
    },
    retryConfig: {
      maxRetries: 0,
      retryDelay: 0,
      backoffMultiplier: 1,
    },
  },
  [DataSourceType.ALPHA_VANTAGE]: {
    name: 'Alpha Vantage',
    enabled: true,
    priority: 2,
    rateLimit: {
      requestsPerMinute: 5,
      requestsPerDay: 500,
    },
    retryConfig: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
    },
  },
  [DataSourceType.YAHOO_FINANCE]: {
    name: 'Yahoo Finance',
    enabled: true,
    priority: 3,
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 1000,
    },
    retryConfig: {
      maxRetries: 2,
      retryDelay: 500,
      backoffMultiplier: 1.5,
    },
  },
  [DataSourceType.NSE_INDIA]: {
    name: 'NSE India',
    enabled: true,
    priority: 4,
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerDay: 5000,
    },
    retryConfig: {
      maxRetries: 2,
      retryDelay: 2000,
      backoffMultiplier: 1.5,
    },
  },
  [DataSourceType.BSE_INDIA]: {
    name: 'BSE India',
    enabled: true,
    priority: 5,
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerDay: 5000,
    },
    retryConfig: {
      maxRetries: 2,
      retryDelay: 2000,
      backoffMultiplier: 1.5,
    },
  },
};

// Utility types
export type DataSourceResponseType<T> = DataSourceResponse<T>;
export type QueryOptionsType = QueryOptions;
export type SearchOptionsType = SearchOptions;
