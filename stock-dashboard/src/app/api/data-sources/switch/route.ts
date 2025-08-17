import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, apiResponse, corsHeaders, HTTP_STATUS } from '@/lib/api-utils';
import { getDataSourceManager } from '@/lib/services/data-source-manager';

/**
 * POST /api/data-sources/switch
 * 
 * WHY this endpoint:
 * - Allows switching between different data sources
 * - Validates data source availability and health
 * - Provides feedback on switch success/failure
 * - Supports the data source toggle component
 */
const switchDataSource = async (request: NextRequest) => {
  const body = await request.json();
  const { source } = body;
  
  if (!source) {
    throw new Error('Source parameter is required');
  }
  
  const dataSourceManager = getDataSourceManager();
  const success = await dataSourceManager.switchDataSource(source);
  
  if (!success) {
    throw new Error(`Failed to switch to data source: ${source}`);
  }
  
  return apiResponse.success(
    { currentSource: source },
    `Successfully switched to ${source} data source`
  );
};

/**
 * Main handler with error handling wrapper
 */
const handler = async (request: NextRequest) => {
  const { method } = request;
  
  switch (method) {
    case 'POST':
      return await switchDataSource(request);
      
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
            'Allow': 'POST, OPTIONS',
            ...corsHeaders,
          },
        }
      );
  }
};

// Export with error handling wrapper
export const POST = withErrorHandling(handler);
export const OPTIONS = handler;
