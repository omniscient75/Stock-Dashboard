import { z } from 'zod';

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Standard API Response Structure
 * WHY: Consistent response format across all endpoints
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  path: string;
}

/**
 * Pagination Response Structure
 * WHY: Handle large datasets efficiently
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// COMPANIES API TYPES
// ============================================================================

/**
 * Company List Query Parameters
 * WHY: Allow filtering and pagination
 */
export const CompanyListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sector: z.string().optional(),
  exchange: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['symbol', 'name', 'marketCap', 'sector']).default('symbol'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type CompanyListQuery = z.infer<typeof CompanyListQuerySchema>;

/**
 * Company Response Type
 * WHY: Consistent company data structure
 */
export interface CompanyResponse {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  marketCap: number;
  basePrice: number;
  volatility: number;
  avgVolume: number;
  description: string;
}

// ============================================================================
// STOCKS API TYPES
// ============================================================================

/**
 * Stock Data Query Parameters
 * WHY: Allow flexible data retrieval
 */
export const StockDataQuerySchema = z.object({
  days: z.coerce.number().min(1).max(365).default(30),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  interval: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
});

export type StockDataQuery = z.infer<typeof StockDataQuerySchema>;

/**
 * Stock Data Response Type
 * WHY: Consistent stock data structure
 */
export interface StockDataResponse {
  symbol: string;
  data: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePercent: number;
  }>;
  metadata: {
    totalDays: number;
    startDate: string;
    endDate: string;
    avgVolume: number;
    avgChange: number;
    volatility: number;
  };
}

/**
 * Latest Stock Price Response
 * WHY: Quick access to current price data
 */
export interface LatestStockResponse {
  symbol: string;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePercent: number;
  };
  timestamp: string;
  lastUpdated: string;
}

/**
 * Add Stock Data Request
 * WHY: Validate incoming stock data
 */
export const AddStockDataSchema = z.object({
  symbol: z.string().min(1).max(10),
  data: z.array(z.object({
    date: z.string(),
    open: z.number().positive(),
    high: z.number().positive(),
    low: z.number().positive(),
    close: z.number().positive(),
    volume: z.number().nonnegative(),
  })).min(1),
});

export type AddStockDataRequest = z.infer<typeof AddStockDataSchema>;

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * API Error Types
 * WHY: Standardized error handling
 */
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  details?: any;
  code: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Database Query Options
 * WHY: Consistent database query parameters
 */
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  where?: Record<string, any>;
  include?: string[];
}

/**
 * Cache Options
 * WHY: Control caching behavior
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string;
  tags?: string[];
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate API Response
 * WHY: Ensure consistent response structure
 */
export function createApiResponse<T>(
  data: T,
  success: boolean = true,
  message?: string
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
    path: typeof window !== 'undefined' ? window.location.pathname : '/api',
  };
}

/**
 * Create Error Response
 * WHY: Standardized error responses
 */
export function createErrorResponse(
  error: ApiError,
  path: string = '/api'
): ApiResponse {
  return {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString(),
    path,
  };
}

/**
 * Validate Symbol Format
 * WHY: Ensure consistent symbol validation
 */
export function isValidSymbol(symbol: string): boolean {
  return /^[A-Z]{1,10}$/.test(symbol);
}

/**
 * Validate Date Format
 * WHY: Ensure consistent date validation
 */
export function isValidDate(date: string): boolean {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}
