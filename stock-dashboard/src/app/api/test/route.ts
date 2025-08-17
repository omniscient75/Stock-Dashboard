import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/test
 * 
 * WHY this endpoint:
 * - Simple test to verify API routing is working
 * - No dependencies on external libraries
 * - Basic response structure
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
  });
}

/**
 * POST /api/test
 * 
 * WHY this endpoint:
 * - Test POST method functionality
 * - Echo back the request body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString(),
      path: request.nextUrl.pathname,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Invalid JSON body',
      timestamp: new Date().toISOString(),
      path: request.nextUrl.pathname,
    }, { status: 400 });
  }
}
