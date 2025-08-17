import { NextRequest, NextResponse } from 'next/server';
import { 
  withErrorHandling, 
  apiResponse, 
  validateRequest, 
  corsHeaders,
  HTTP_STATUS,
  ApiError 
} from '@/lib/api-utils';
import { commonSchemas } from '@/lib/api-schemas';
import { getCompanyBySymbol } from '@/lib/indian-companies';

// Mock latest price generator
const generateLatestPrice = (symbol: string) => {
  const companies = {
    'RELIANCE': { basePrice: 2500, volatility: 0.025 },
    'TCS': { basePrice: 3500, volatility: 0.020 },
    'HDFCBANK': { basePrice: 1500, volatility: 0.030 },
    'INFY': { basePrice: 1400, volatility: 0.022 },
    'ICICIBANK': { basePrice: 900, volatility: 0.035 },
  };
  
  const company = companies[symbol as keyof typeof companies];
  if (!company) return null;
  
  // Generate latest price data
  const change = (Math.random() - 0.5) * company.volatility * 2;
  const currentPrice = company.basePrice * (1 + change);
  const previousPrice = company.basePrice * 0.98; // Simulate previous day
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;
  
  return {
    symbol,
    price: Math.max(0.01, currentPrice),
    change: priceChange,
    changePercent: priceChangePercent,
    volume: Math.floor(company.basePrice * 1000 * (0.5 + Math.random())),
    high: currentPrice * (1 + Math.random() * company.volatility),
    low: currentPrice * (1 - Math.random() * company.volatility),
    open: previousPrice * (1 + (Math.random() - 0.5) * company.volatility),
    timestamp: new Date().toISOString(),
  };
};

/**
 * GET /api/stocks/[symbol]/latest
 * 
 * WHY this endpoint:
 * - Get the most recent stock price data
 * - Provide quick access to current market data
 * - Include price change and percentage change
 * - Optimized for real-time updates
 */
const getLatestPrice = async (request: NextRequest, { params }: { params: { symbol: string } }) => {
  // Validate symbol parameter
  const validatedParams = validateRequest(commonSchemas.symbol, params);
  const { symbol } = validatedParams;
  
  // Validate company exists
  const company = getCompanyBySymbol(symbol);
  if (!company) {
    throw ApiError.notFound(`Company with symbol '${symbol}' not found`);
  }
  
  // Generate latest price data
  const priceData = generateLatestPrice(symbol);
  
  if (!priceData) {
    throw ApiError.notFound(`No price data available for symbol '${symbol}'`);
  }
  
  return apiResponse.success(
    priceData,
    `Latest price data retrieved successfully for ${symbol}`
  );
};

/**
 * POST /api/stocks/[symbol]/latest
 * 
 * WHY this endpoint:
 * - Update latest price data for a symbol
 * - Handle real-time price updates
 * - Validate incoming price data
 */
const updateLatestPrice = async (request: NextRequest, { params }: { params: { symbol: string } }) => {
  // Validate symbol parameter
  const validatedParams = validateRequest(commonSchemas.symbol, params);
  const { symbol } = validatedParams;
  
  // Validate company exists
  const company = getCompanyBySymbol(symbol);
  if (!company) {
    throw ApiError.notFound(`Company with symbol '${symbol}' not found`);
  }
  
  // Parse and validate request body
  const body = await request.json();
  
  // Basic validation for price update
  const { price, volume, high, low, open } = body;
  
  if (typeof price !== 'number' || price <= 0) {
    throw ApiError.badRequest('Invalid price value');
  }
  
  if (typeof volume !== 'number' || volume < 0) {
    throw ApiError.badRequest('Invalid volume value');
  }
  
  // In a real application, you would update the database here
  const updatedPriceData = {
    symbol,
    price,
    volume,
    high: high || price,
    low: low || price,
    open: open || price,
    change: 0, // Would be calculated based on previous price
    changePercent: 0, // Would be calculated based on previous price
    timestamp: new Date().toISOString(),
  };
  
  return apiResponse.success(
    updatedPriceData,
    `Latest price updated successfully for ${symbol}`,
    HTTP_STATUS.CREATED
  );
};

/**
 * Main handler with error handling wrapper
 */
const handler = async (request: NextRequest, context: { params: { symbol: string } }) => {
  const { method } = request;
  
  switch (method) {
    case 'GET':
      return await getLatestPrice(request, context);
      
    case 'POST':
      return await updateLatestPrice(request, context);
      
    case 'OPTIONS':
      return new NextResponse(null, {
        status: HTTP_STATUS.OK,
        headers: corsHeaders,
      });
      
    default:
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: `Method ${method} not allowed`,
          timestamp: new Date().toISOString(),
          path: request.nextUrl.pathname,
        }),
        {
          status: HTTP_STATUS.METHOD_NOT_ALLOWED,
          headers: {
            'Content-Type': 'application/json',
            'Allow': 'GET, POST, OPTIONS',
            ...corsHeaders,
          },
        }
      );
  }
};

// Export with error handling wrapper
export const GET = withErrorHandling(handler);
export const POST = withErrorHandling(handler);
export const OPTIONS = handler;
