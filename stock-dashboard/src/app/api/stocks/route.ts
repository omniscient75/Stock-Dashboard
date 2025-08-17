import { NextRequest, NextResponse } from 'next/server';
import { 
  AddStockDataSchema,
  AddStockDataRequest,
  ApiError,
  ApiErrorType,
  createErrorResponse
} from '@/types/api';
import { 
  standardApiMiddleware, 
  validateRequest, 
  getRequestBody,
  createSuccessResponse,
  errorHandler 
} from '@/lib/api-middleware';
import { generateSampleData } from '@/lib/mock-data-generator';

/**
 * POST /api/stocks
 * 
 * WHY this endpoint:
 * - Add new stock data to the system
 * - Validate incoming data structure
 * - Ensure data consistency and integrity
 * - Support bulk data insertion
 */
export async function POST(request: NextRequest) {
  try {
    // Apply standard middleware
    const middlewareResult = standardApiMiddleware(request);
    if (middlewareResult) {
      return middlewareResult;
    }

    // Extract and validate request body
    const body = await getRequestBody<AddStockDataRequest>(request);
    
    if (!body) {
      const error: ApiError = {
        type: ApiErrorType.VALIDATION_ERROR,
        message: 'Request body is required',
        code: 400,
      };
      
      return NextResponse.json(
        createErrorResponse(error, request.nextUrl.pathname),
        { status: 400 }
      );
    }

    const validation = validateRequest(AddStockDataSchema, body);
    
    if (!validation.success) {
      const error: ApiError = {
        type: ApiErrorType.VALIDATION_ERROR,
        message: validation.error,
        code: 400,
      };
      
      return NextResponse.json(
        createErrorResponse(error, request.nextUrl.pathname),
        { status: 400 }
      );
    }

    const { symbol, data } = validation.data;

    // Validate symbol format
    if (!/^[A-Z]{1,10}$/.test(symbol)) {
      const error: ApiError = {
        type: ApiErrorType.VALIDATION_ERROR,
        message: 'Invalid symbol format. Must be 1-10 uppercase letters.',
        code: 400,
      };
      
      return NextResponse.json(
        createErrorResponse(error, request.nextUrl.pathname),
        { status: 400 }
      );
    }

    // Validate data consistency
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      // Check OHLC relationships
      if (item.high < item.low) {
        const error: ApiError = {
          type: ApiErrorType.VALIDATION_ERROR,
          message: `Invalid OHLC data at index ${i}: high (${item.high}) cannot be less than low (${item.low})`,
          code: 400,
        };
        
        return NextResponse.json(
          createErrorResponse(error, request.nextUrl.pathname),
          { status: 400 }
        );
      }

      if (item.high < item.open || item.high < item.close) {
        const error: ApiError = {
          type: ApiErrorType.VALIDATION_ERROR,
          message: `Invalid OHLC data at index ${i}: high (${item.high}) must be >= open (${item.open}) and close (${item.close})`,
          code: 400,
        };
        
        return NextResponse.json(
          createErrorResponse(error, request.nextUrl.pathname),
          { status: 400 }
        );
      }

      if (item.low > item.open || item.low > item.close) {
        const error: ApiError = {
          type: ApiErrorType.VALIDATION_ERROR,
          message: `Invalid OHLC data at index ${i}: low (${item.low}) must be <= open (${item.open}) and close (${item.close})`,
          code: 400,
        };
        
        return NextResponse.json(
          createErrorResponse(error, request.nextUrl.pathname),
          { status: 400 }
        );
      }

      // Validate date format
      const date = new Date(item.date);
      if (isNaN(date.getTime())) {
        const error: ApiError = {
          type: ApiErrorType.VALIDATION_ERROR,
          message: `Invalid date format at index ${i}: ${item.date}`,
          code: 400,
        };
        
        return NextResponse.json(
          createErrorResponse(error, request.nextUrl.pathname),
          { status: 400 }
        );
      }
    }

    // In a real application, you would save this data to the database
    // For now, we'll simulate successful data insertion
    
    console.log(`[API] Adding stock data for ${symbol}:`, {
      records: data.length,
      dateRange: `${data[0]?.date} to ${data[data.length - 1]?.date}`,
    });

    // Return success response
    return createSuccessResponse(
      {
        symbol,
        recordsAdded: data.length,
        message: `Successfully added ${data.length} records for ${symbol}`,
      },
      request,
      'Stock data added successfully'
    );

  } catch (error) {
    return errorHandler(error, request);
  }
}

/**
 * GET /api/stocks
 * 
 * WHY this endpoint:
 * - List available stock symbols
 * - Provide metadata about available data
 * - Support filtering and search
 */
export async function GET(request: NextRequest) {
  try {
    // Apply standard middleware
    const middlewareResult = standardApiMiddleware(request);
    if (middlewareResult) {
      return middlewareResult;
    }

    // For demo purposes, return available symbols
    // In a real application, you would query the database
    const availableSymbols = [
      'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
      'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'AXISBANK'
    ];

    return createSuccessResponse(
      {
        symbols: availableSymbols,
        total: availableSymbols.length,
        message: 'Available stock symbols retrieved successfully',
      },
      request,
      'Stock symbols retrieved successfully'
    );

  } catch (error) {
    return errorHandler(error, request);
  }
}

/**
 * OPTIONS /api/stocks
 * 
 * WHY this endpoint:
 * - Handle CORS preflight requests
 * - Support cross-origin requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
