import { NextRequest, NextResponse } from 'next/server';
import { 
  withErrorHandling, 
  apiResponse, 
  validateRequest, 
  getQueryParams,
  calculatePagination,
  corsHeaders,
  HTTP_STATUS 
} from '@/lib/api-utils';
import { companySchemas } from '@/lib/api-schemas';
import { getDataSourceManager } from '@/lib/services/data-source-manager';

/**
 * GET /api/companies
 * 
 * WHY this endpoint:
 * - List all companies with pagination and filtering
 * - Support search functionality
 * - Provide sorting options
 * - Enable sector and exchange filtering
 * - Return comprehensive company information
 */
const getCompanies = async (request: NextRequest) => {
  // Get and validate query parameters
  const queryParams = getQueryParams(request);
  const validatedParams = validateRequest(companySchemas.query, queryParams);
  
  const { page, limit, search, sector, exchange, sortBy, sortOrder } = validatedParams;
  
  // Use data source manager to get companies
  const dataSourceManager = getDataSourceManager();
  
  // For now, we'll use a simple search approach
  // In a real implementation, you might want to get all companies and filter
  const searchOptions = {
    query: search || 'RELIANCE', // Default search to get some companies
    type: 'all' as const,
    limit: 100, // Get more companies to filter from
  };
  
  const response = await dataSourceManager.searchCompanies(searchOptions);
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch companies');
  }
  
  let companies = response.data;
  
  // Apply search filter (additional filtering on top of data source search)
  if (search) {
    const searchLower = search.toLowerCase();
    companies = companies.filter(company => 
      company.symbol.toLowerCase().includes(searchLower) ||
      company.name.toLowerCase().includes(searchLower) ||
      company.sector.toLowerCase().includes(searchLower) ||
      company.industry.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sector filter
  if (sector) {
    companies = companies.filter(company => company.sector === sector);
  }
  
  // Apply exchange filter
  if (exchange) {
    companies = companies.filter(company => company.exchange === exchange);
  }
  
  // Apply sorting
  companies.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'marketCap':
        aValue = a.marketCap;
        bValue = b.marketCap;
        break;
      case 'peRatio':
        aValue = a.peRatio || 0;
        bValue = b.peRatio || 0;
        break;
      default:
        aValue = a.symbol;
        bValue = b.symbol;
    }
    
    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  });
  
  // Calculate pagination
  const total = companies.length;
  const { offset, totalPages } = calculatePagination(page, limit, total);
  
  // Apply pagination
  const paginatedCompanies = companies.slice(offset, offset + limit);
  
  // Transform data for response
  const companiesData = paginatedCompanies.map(company => ({
    symbol: company.symbol,
    name: company.name,
    sector: company.sector,
    industry: company.industry,
    exchange: company.exchange,
    marketCap: company.marketCap,
    peRatio: company.peRatio,
    dividendYield: company.dividendYield,
    basePrice: company.basePrice,
    volatility: company.volatility,
    avgVolume: company.avgVolume,
    description: company.description,
    createdAt: new Date().toISOString(), // Mock data
    updatedAt: new Date().toISOString(), // Mock data
  }));
  
  return apiResponse.paginated(
    companiesData,
    page,
    limit,
    total,
    `Retrieved ${companiesData.length} companies from ${response.source}`
  );
};

/**
 * POST /api/companies
 * 
 * WHY this endpoint:
 * - Add new companies to the system
 * - Validate company data before creation
 * - Check for duplicate symbols
 * - Return created company information
 */
const createCompany = async (request: NextRequest) => {
  // Parse and validate request body
  const body = await request.json();
  const validatedData = validateRequest(companySchemas.create, body);
  
  // Check if company already exists (using data source manager)
  const dataSourceManager = getDataSourceManager();
  const existingCompanyResponse = await dataSourceManager.getCompanyInfo(validatedData.symbol);
  if (existingCompanyResponse.success) {
    throw new Error(`Company with symbol '${validatedData.symbol}' already exists`);
  }
  
  // In a real application, you would save to database here
  // For now, we'll just return the validated data
  const newCompany = {
    ...validatedData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return apiResponse.success(
    newCompany,
    `Company '${validatedData.symbol}' created successfully`,
    HTTP_STATUS.CREATED
  );
};

/**
 * Main handler with error handling wrapper
 */
const handler = async (request: NextRequest) => {
  const { method } = request;
  
  switch (method) {
    case 'GET':
      return await getCompanies(request);
      
    case 'POST':
      return await createCompany(request);
      
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
