import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  path: string;
}

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

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API Error Class
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, code?: string) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, code);
  }

  static notFound(message: string, code?: string) {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message, code);
  }

  static unauthorized(message: string = 'Unauthorized', code?: string) {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message, code);
  }

  static forbidden(message: string = 'Forbidden', code?: string) {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message, code);
  }

  static conflict(message: string, code?: string) {
    return new ApiError(HTTP_STATUS.CONFLICT, message, code);
  }

  static validationError(message: string, code?: string) {
    return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, code);
  }

  static tooManyRequests(message: string = 'Too many requests', code?: string) {
    return new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, message, code);
  }

  static internalError(message: string = 'Internal server error', code?: string) {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, code);
  }
}

// Response Helpers
export const apiResponse = {
  success: <T>(data: T, message?: string, statusCode: number = HTTP_STATUS.OK): NextResponse<ApiResponse<T>> => {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    );
  },

  error: (error: ApiError | Error, path: string): NextResponse<ApiResponse> => {
    const statusCode = error instanceof ApiError ? error.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
        path,
      },
      { status: statusCode }
    );
  },

  paginated: <T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): NextResponse<PaginatedResponse<T>> => {
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json(
      {
        success: true,
        data,
        message,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        timestamp: new Date().toISOString(),
      },
      { status: HTTP_STATUS.OK }
    );
  },
};

// Validation Helpers
export const validateRequest = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw ApiError.validationError(`Validation failed: ${messages}`);
    }
    throw ApiError.validationError('Invalid request data');
  }
};

// Query Parameter Helpers
export const getQueryParams = (request: NextRequest) => {
  const url = new URL(request.url);
  return {
    page: parseInt(url.searchParams.get('page') || '1'),
    limit: parseInt(url.searchParams.get('limit') || '10'),
    search: url.searchParams.get('search') || '',
    sortBy: url.searchParams.get('sortBy') || '',
    sortOrder: url.searchParams.get('sortOrder') || 'asc',
    filter: url.searchParams.get('filter') || '',
  };
};

// Pagination Helpers
export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  
  return {
    offset,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Rate Limiting Helper (Simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
};

// CORS Helper
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Logging Helper
export const logApiRequest = (
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userAgent?: string
) => {
  const timestamp = new Date().toISOString();
  const logLevel = statusCode >= 400 ? 'ERROR' : 'INFO';
  
  console.log(`[${timestamp}] ${logLevel} ${method} ${path} ${statusCode} ${duration}ms ${userAgent || ''}`);
};

// API Handler Wrapper
export const withErrorHandling = <T>(
  handler: (request: NextRequest, context: T) => Promise<NextResponse>
) => {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const path = request.nextUrl.pathname;
    
    try {
      // Check rate limit
      const clientIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      if (!checkRateLimit(clientIp)) {
        throw ApiError.tooManyRequests('Rate limit exceeded');
      }

      const response = await handler(request, context);
      
      // Log successful request
      const duration = Date.now() - startTime;
      logApiRequest(
        request.method,
        path,
        response.status,
        duration,
        request.headers.get('user-agent')
      );
      
      return response;
    } catch (error) {
      // Log error
      const duration = Date.now() - startTime;
      const statusCode = error instanceof ApiError ? error.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      
      logApiRequest(
        request.method,
        path,
        statusCode,
        duration,
        request.headers.get('user-agent')
      );
      
      return apiResponse.error(error as Error, path);
    }
  };
};

// Common Validation Schemas
export const commonSchemas = {
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
  
  search: z.object({
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
  
  symbol: z.object({
    symbol: z.string().min(1).max(10).regex(/^[A-Z]+$/),
  }),
  
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
};
