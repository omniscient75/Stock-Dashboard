import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, apiResponse, corsHeaders, HTTP_STATUS } from '@/lib/api-utils';
import { getDataSourceManager } from '@/lib/services/data-source-manager';

/**
 * GET /api/data-sources/status
 * 
 * WHY this endpoint:
 * - Provides real-time status of all data sources
 * - Shows health, rate limits, and cache information
 * - Enables monitoring and debugging
 * - Supports the data source toggle component
 */
const getDataSourceStatus = async (request: NextRequest) => {
  const dataSourceManager = getDataSourceManager();
  const status = await dataSourceManager.getDataSourceStatus();
  
  return apiResponse.success(
    status,
    'Data source status retrieved successfully'
  );
};

/**
 * Main handler with error handling wrapper
 */
const handler = async (request: NextRequest) => {
  const { method } = request;
  
  switch (method) {
    case 'GET':
      return await getDataSourceStatus(request);
      
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
            'Allow': 'GET, OPTIONS',
            ...corsHeaders,
          },
        }
      );
  }
};

// Export with error handling wrapper
export const GET = withErrorHandling(handler);
export const OPTIONS = handler;
