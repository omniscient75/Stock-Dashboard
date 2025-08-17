import { NextRequest, NextResponse } from 'next/server';
import { 
  withErrorHandling, 
  apiResponse, 
  validateRequest, 
  getQueryParams,
  calculatePagination,
  corsHeaders,
  HTTP_STATUS,
  ApiError 
} from '@/lib/api-utils';
import { stockSchemas, commonSchemas } from '@/lib/api-schemas';
import { getCompanyBySymbol } from '@/lib/indian-companies';

// Mock stock data generator for demonstration
const generateStockData = (symbol: string, days: number = 30) => {
  const companies = {
    'RELIANCE': { basePrice: 2500, volatility: 0.025, avgVolume: 5000000 },
    'TCS': { basePrice: 3500, volatility: 0.020, avgVolume: 3000000 },
    'HDFCBANK': { basePrice: 1500, volatility: 0.030, avgVolume: 4000000 },
    'INFY': { basePrice: 1400, volatility: 0.022, avgVolume: 3500000 },
    'ICICIBANK': { basePrice: 900, volatility: 0.035, avgVolume: 4500000 },
  };
  
  const company = companies[symbol as keyof typeof companies];
  if (!company) return [];
  
  const data = [];
  let currentPrice = company.basePrice;
  
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
    
    const change = (Math.random() - 0.5) * company.volatility * 2;
    const open = currentPrice * (1 + (Math.random() - 0.5) * company.volatility);
    const close = currentPrice * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * company.volatility);
    const low = Math.min(open, close) * (1 - Math.random() * company.volatility);
    const volume = company.avgVolume * (0.5 + Math.random());
    
    data.push({
      symbol: symbol,
      date: currentDate.toISOString().split('T')[0],
      open: Math.max(0.01, open),
      high: Math.max(open, close, high),
      low: Math.min(open, close, low),
      close: Math.max(0.01, close),
      volume: Math.max(1000, Math.round(volume)),
      change: close - open,
      changePercent: ((close - open) / open) * 100,
    });
    
    currentPrice = close;
  }
  
  return data;
};

/**
 * GET /api/stocks/[symbol]
 * 
 * WHY this endpoint:
 * - Retrieve historical stock data for a specific symbol
 * - Support flexible date ranges and intervals
 * - Provide comprehensive OHLCV data
 * - Include metadata for analysis
 * - Support pagination for large datasets
 */
const getStockData = async (request: NextRequest, { params }: { params: { symbol: string } }) => {
  // Validate symbol parameter
  const validatedParams = validateRequest(commonSchemas.symbol, params);
  const { symbol } = validatedParams;
  
  // Validate company exists
  const company = getCompanyBySymbol(symbol);
  if (!company) {
    throw ApiError.notFound(`Company with symbol '${symbol}' not found`);
  }
  
  // Get and validate query parameters
  const queryParams = getQueryParams(request);
  const validatedQuery = validateRequest(stockSchemas.query, queryParams);
  
  const { page, limit, startDate, endDate, interval, sortBy, sortOrder } = validatedQuery;
  
  // Generate mock data
  let stockData = generateStockData(symbol, 100); // Generate more data for filtering
  
  // Apply date filters
  if (startDate) {
    stockData = stockData.filter(item => item.date && item.date >= startDate);
  }
  
  if (endDate) {
    stockData = stockData.filter(item => item.date && item.date <= endDate);
  }
  
  // Apply sorting
  stockData.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'date':
        aValue = a.date ? new Date(a.date) : new Date(0);
        bValue = b.date ? new Date(b.date) : new Date(0);
        break;
      case 'close':
        aValue = a.close;
        bValue = b.close;
        break;
      case 'volume':
        aValue = a.volume;
        bValue = b.volume;
        break;
      default:
        aValue = a.date ? new Date(a.date) : new Date(0);
        bValue = b.date ? new Date(b.date) : new Date(0);
    }
    
    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  });
  
  // Calculate pagination
  const total = stockData.length;
  const { offset, totalPages } = calculatePagination(page, limit, total);
  
  // Apply pagination
  const paginatedData = stockData.slice(offset, offset + limit);
  
  // Calculate metadata
  const volumes = paginatedData.map(d => d.volume);
  const changes = paginatedData.map(d => d.changePercent);
  
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
  
  // Calculate volatility (standard deviation of changes)
  const meanChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
  const variance = changes.reduce((sum, change) => sum + Math.pow(change - meanChange, 2), 0) / changes.length;
  const volatility = Math.sqrt(variance);
  
  const metadata = {
    symbol,
    companyName: company.name,
    sector: company.sector,
    totalDays: total,
    startDate: paginatedData[0]?.date || '',
    endDate: paginatedData[paginatedData.length - 1]?.date || '',
    avgVolume,
    avgChange,
    volatility,
    interval,
  };
  
  const response = {
    data: paginatedData,
    metadata,
  };
  
  return apiResponse.paginated(
    paginatedData,
    page,
    limit,
    total,
    `Stock data retrieved successfully for ${symbol}`
  );
};

/**
 * POST /api/stocks/[symbol]
 * 
 * WHY this endpoint:
 * - Add new stock data for a specific symbol
 * - Validate data consistency
 * - Check for duplicate entries
 * - Return created data
 */
const addStockData = async (request: NextRequest, { params }: { params: { symbol: string } }) => {
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
  const validatedData = validateRequest(stockSchemas.create, body);
  
  // Ensure symbol matches URL parameter
  if (validatedData.symbol !== symbol) {
    throw ApiError.badRequest('Symbol in body must match URL parameter');
  }
  
  // In a real application, you would save to database here
  // For now, we'll just return the validated data
  const newStockData = {
    ...validatedData,
    createdAt: new Date().toISOString(),
  };
  
  return apiResponse.success(
    newStockData,
    `Stock data added successfully for ${symbol}`,
    HTTP_STATUS.CREATED
  );
};

/**
 * PUT /api/stocks/[symbol]
 * 
 * WHY this endpoint:
 * - Update existing stock data
 * - Validate data consistency
 * - Return updated data
 */
const updateStockData = async (request: NextRequest, { params }: { params: { symbol: string } }) => {
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
  const validatedData = validateRequest(stockSchemas.update, body);
  
  // In a real application, you would update in database here
  // For now, we'll just return the validated data
  const updatedStockData = {
    symbol,
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };
  
  return apiResponse.success(
    updatedStockData,
    `Stock data updated successfully for ${symbol}`
  );
};

/**
 * DELETE /api/stocks/[symbol]
 * 
 * WHY this endpoint:
 * - Delete stock data for a specific symbol
 * - Confirm deletion
 * - Return appropriate response
 */
const deleteStockData = async (request: NextRequest, { params }: { params: { symbol: string } }) => {
  // Validate symbol parameter
  const validatedParams = validateRequest(commonSchemas.symbol, params);
  const { symbol } = validatedParams;
  
  // Validate company exists
  const company = getCompanyBySymbol(symbol);
  if (!company) {
    throw ApiError.notFound(`Company with symbol '${symbol}' not found`);
  }
  
  // In a real application, you would delete from database here
  // For now, we'll just return a success response
  
  return apiResponse.success(
    null,
    `Stock data deleted successfully for ${symbol}`,
    HTTP_STATUS.NO_CONTENT
  );
};

/**
 * Main handler with error handling wrapper
 */
const handler = async (request: NextRequest, context: { params: { symbol: string } }) => {
  const { method } = request;
  
  switch (method) {
    case 'GET':
      return await getStockData(request, context);
      
    case 'POST':
      return await addStockData(request, context);
      
    case 'PUT':
      return await updateStockData(request, context);
      
    case 'DELETE':
      return await deleteStockData(request, context);
      
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
            'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
            ...corsHeaders,
          },
        }
      );
  }
};

// Export with error handling wrapper
export const GET = withErrorHandling(handler);
export const POST = withErrorHandling(handler);
export const PUT = withErrorHandling(handler);
export const DELETE = withErrorHandling(handler);
export const OPTIONS = handler;
