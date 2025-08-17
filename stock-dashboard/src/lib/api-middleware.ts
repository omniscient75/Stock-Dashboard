import { NextRequest, NextResponse } from 'next/server';
import { ApiError, ApiErrorType, createErrorResponse } from '@/types/api';

// ============================================================================
// API MIDDLEWARE UTILITIES
// ============================================================================

/**
 * Rate Limiting Store
 * WHY: Prevent API abuse and ensure fair usage
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate Limiting Configuration
 * WHY: Configurable limits for different endpoints
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

/**
 * Default Rate Limit Configuration
 * WHY: Sensible defaults for most endpoints
 */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req) => {
    // Use IP address as default key
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
  },
};

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

/**
 * Rate Limiting Middleware
 * WHY: Prevent API abuse and ensure fair usage
 */
export function rateLimit(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
  return async (req: NextRequest) => {
    const key = config.keyGenerator ? config.keyGenerator(req) : 'default';
    const now = Date.now();
    
    // Get current rate limit data
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Continue
    }
    
    if (current.count >= config.maxRequests) {
      // Rate limit exceeded
      const error: ApiError = {
        type: ApiErrorType.RATE_LIMIT_EXCEEDED,
        message: `Rate limit exceeded. Maximum ${config.maxRequests} requests per ${config.windowMs / 1000} seconds.`,
        code: 429,
      };
      
      return NextResponse.json(
        createErrorResponse(error, req.nextUrl.pathname),
        { status: 429 }
      );
    }
    
    // Increment count
    current.count++;
    rateLimitStore.set(key, current);
    
    return null; // Continue
  };
}

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

/**
 * Error Handler Middleware
 * WHY: Centralized error handling for all API routes
 */
export function errorHandler(error: unknown, req: NextRequest): NextResponse {
  console.error('API Error:', {
    path: req.nextUrl.pathname,
    method: req.method,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
  });
  
  let apiError: ApiError;
  
  if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes('not found')) {
      apiError = {
        type: ApiErrorType.NOT_FOUND,
        message: error.message,
        code: 404,
      };
    } else if (error.message.includes('validation')) {
      apiError = {
        type: ApiErrorType.VALIDATION_ERROR,
        message: error.message,
        code: 400,
      };
    } else {
      apiError = {
        type: ApiErrorType.INTERNAL_ERROR,
        message: 'Internal server error',
        code: 500,
      };
    }
  } else {
    // Handle unknown errors
    apiError = {
      type: ApiErrorType.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      code: 500,
    };
  }
  
  return NextResponse.json(
    createErrorResponse(apiError, req.nextUrl.pathname),
    { status: apiError.code }
  );
}

// ============================================================================
// REQUEST VALIDATION MIDDLEWARE
// ============================================================================

/**
 * Request Validation Middleware
 * WHY: Validate request parameters and body
 */
export function validateRequest<T>(
  schema: any,
  data: any
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error: any) {
    const message = error.errors?.map((e: any) => e.message).join(', ') || 'Validation failed';
    return { success: false, error: message };
  }
}

// ============================================================================
// LOGGING MIDDLEWARE
// ============================================================================

/**
 * Request Logging Middleware
 * WHY: Monitor API usage and debug issues
 */
export function logRequest(req: NextRequest, response?: NextResponse) {
  const startTime = Date.now();
  const method = req.method;
  const path = req.nextUrl.pathname;
  const query = req.nextUrl.search;
  const userAgent = req.headers.get('user-agent');
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  console.log(`[API] ${method} ${path}${query} - ${ip} - ${userAgent}`);
  
  // Log response if provided
  if (response) {
    const duration = Date.now() - startTime;
    const status = response.status;
    console.log(`[API] ${method} ${path} - ${status} - ${duration}ms`);
  }
}

// ============================================================================
// CORS MIDDLEWARE
// ============================================================================

/**
 * CORS Configuration
 * WHY: Handle cross-origin requests
 */
export interface CorsConfig {
  origin: string | string[];
  methods: string[];
  headers: string[];
  credentials: boolean;
}

/**
 * Default CORS Configuration
 * WHY: Sensible defaults for development
 */
export const DEFAULT_CORS: CorsConfig = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization'],
  credentials: true,
};

/**
 * CORS Middleware
 * WHY: Handle cross-origin requests properly
 */
export function cors(config: CorsConfig = DEFAULT_CORS) {
  return (req: NextRequest) => {
    const origin = req.headers.get('origin');
    const isAllowedOrigin = Array.isArray(config.origin)
      ? config.origin.includes(origin || '')
      : config.origin === origin;
    
    if (!isAllowedOrigin) {
      return NextResponse.json(
        createErrorResponse({
          type: ApiErrorType.FORBIDDEN,
          message: 'CORS policy violation',
          code: 403,
        }, req.nextUrl.pathname),
        { status: 403 }
      );
    }
    
    return null; // Continue
  };
}

// ============================================================================
// COMPOSITE MIDDLEWARE
// ============================================================================

/**
 * Apply Multiple Middleware Functions
 * WHY: Combine multiple middleware functions
 */
export function applyMiddleware(
  req: NextRequest,
  ...middlewares: Array<(req: NextRequest) => NextResponse | null>
): NextResponse | null {
  for (const middleware of middlewares) {
    const result = middleware(req);
    if (result) {
      return result;
    }
  }
  return null;
}

/**
 * Standard API Middleware Stack
 * WHY: Common middleware for most API endpoints
 */
export function standardApiMiddleware(req: NextRequest) {
  return applyMiddleware(
    req,
    rateLimit(),
    cors(),
    (req) => {
      logRequest(req);
      return null;
    }
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get Request Body
 * WHY: Safely extract and parse request body
 */
export async function getRequestBody<T>(req: NextRequest): Promise<T | null> {
  try {
    if (req.method === 'GET') {
      return null;
    }
    
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await req.json();
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      const data: any = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return null;
  }
}

/**
 * Get Query Parameters
 * WHY: Safely extract query parameters
 */
export function getQueryParams(req: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Create Success Response
 * WHY: Standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  req: NextRequest,
  message?: string
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      path: req.nextUrl.pathname,
    },
    { status: 200 }
  );
}
