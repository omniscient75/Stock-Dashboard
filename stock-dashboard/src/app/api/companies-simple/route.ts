import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/companies-simple
 * 
 * WHY this endpoint:
 * - Simplified version without complex dependencies
 * - Test basic API functionality
 * - No external imports that might cause issues
 */
export async function GET(request: NextRequest) {
  const companies = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      sector: 'Oil & Gas',
      exchange: 'NSE',
      marketCap: 150000,
      basePrice: 2500,
      volatility: 0.025,
      avgVolume: 5000000,
      description: 'India\'s largest private sector company.',
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services Ltd',
      sector: 'Information Technology',
      exchange: 'NSE',
      marketCap: 120000,
      basePrice: 3500,
      volatility: 0.020,
      avgVolume: 3000000,
      description: 'Leading global IT services company.',
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      sector: 'Banking',
      exchange: 'NSE',
      marketCap: 100000,
      basePrice: 1500,
      volatility: 0.030,
      avgVolume: 4000000,
      description: 'Leading private sector bank in India.',
    },
  ];

  return NextResponse.json({
    success: true,
    data: companies,
    message: 'Companies retrieved successfully',
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
  });
}


