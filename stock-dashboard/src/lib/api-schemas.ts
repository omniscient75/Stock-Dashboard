import { z } from 'zod';

// Base schemas for common fields
export const baseSchemas = {
  symbol: z.string().min(1).max(10).regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only'),
  name: z.string().min(1).max(100),
  sector: z.string().min(1).max(50),
  industry: z.string().min(1).max(50),
  exchange: z.enum(['NSE', 'BSE', 'BOTH']),
  date: z.string().datetime(),
  price: z.number().positive(),
  volume: z.number().nonnegative(),
  percentage: z.number().min(-100).max(1000),
};

// Company schemas
export const companySchemas = {
  create: z.object({
    symbol: baseSchemas.symbol,
    name: baseSchemas.name,
    sector: baseSchemas.sector,
    industry: baseSchemas.industry,
    exchange: baseSchemas.exchange,
    marketCap: z.number().positive(),
    peRatio: z.number().positive().optional(),
    dividendYield: z.number().min(0).max(100).optional(),
    basePrice: baseSchemas.price,
    volatility: z.number().min(0).max(1),
    avgVolume: z.number().positive(),
    description: z.string().max(500).optional(),
  }),

  update: z.object({
    name: baseSchemas.name.optional(),
    sector: baseSchemas.sector.optional(),
    industry: baseSchemas.industry.optional(),
    exchange: baseSchemas.exchange.optional(),
    marketCap: z.number().positive().optional(),
    peRatio: z.number().positive().optional(),
    dividendYield: z.number().min(0).max(100).optional(),
    basePrice: baseSchemas.price.optional(),
    volatility: z.number().min(0).max(1).optional(),
    avgVolume: z.number().positive().optional(),
    description: z.string().max(500).optional(),
  }),

  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    search: z.string().optional(),
    sector: z.string().optional(),
    exchange: baseSchemas.exchange.optional(),
    sortBy: z.enum(['symbol', 'name', 'marketCap', 'peRatio']).default('symbol'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
};

// Stock data schemas
export const stockSchemas = {
  create: z.object({
    symbol: baseSchemas.symbol,
    date: baseSchemas.date,
    open: baseSchemas.price,
    high: baseSchemas.price,
    low: baseSchemas.price,
    close: baseSchemas.price,
    volume: baseSchemas.volume,
    change: z.number().optional(),
    changePercent: baseSchemas.percentage.optional(),
  }),

  update: z.object({
    open: baseSchemas.price.optional(),
    high: baseSchemas.price.optional(),
    low: baseSchemas.price.optional(),
    close: baseSchemas.price.optional(),
    volume: baseSchemas.volume.optional(),
    change: z.number().optional(),
    changePercent: baseSchemas.percentage.optional(),
  }),

  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(1000).default(30),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    interval: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
    sortBy: z.enum(['date', 'close', 'volume']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),

  bulkCreate: z.array(stockSchemas.create).min(1).max(1000),
};

// Market data schemas
export const marketSchemas = {
  query: z.object({
    symbols: z.string().optional(), // Comma-separated symbols
    sector: z.string().optional(),
    exchange: baseSchemas.exchange.optional(),
    date: z.string().datetime().optional(),
    includeStats: z.coerce.boolean().default(false),
  }),
};

// Search schemas
export const searchSchemas = {
  query: z.object({
    q: z.string().min(1).max(100),
    type: z.enum(['symbol', 'name', 'sector', 'all']).default('all'),
    limit: z.coerce.number().min(1).max(50).default(10),
    includeInactive: z.coerce.boolean().default(false),
  }),
};

// Statistics schemas
export const statsSchemas = {
  query: z.object({
    period: z.enum(['1d', '1w', '1m', '3m', '6m', '1y']).default('1d'),
    symbols: z.string().optional(), // Comma-separated symbols
    sector: z.string().optional(),
    exchange: baseSchemas.exchange.optional(),
  }),
};

// Watchlist schemas
export const watchlistSchemas = {
  add: z.object({
    symbol: baseSchemas.symbol,
    alertPrice: baseSchemas.price.optional(),
    alertType: z.enum(['above', 'below']).optional(),
  }),

  update: z.object({
    alertPrice: baseSchemas.price.optional(),
    alertType: z.enum(['above', 'below']).optional(),
    isActive: z.boolean().optional(),
  }),
};

// Portfolio schemas
export const portfolioSchemas = {
  add: z.object({
    symbol: baseSchemas.symbol,
    quantity: z.number().positive(),
    buyPrice: baseSchemas.price,
    buyDate: baseSchemas.date,
    notes: z.string().max(200).optional(),
  }),

  update: z.object({
    quantity: z.number().positive().optional(),
    buyPrice: baseSchemas.price.optional(),
    buyDate: baseSchemas.date.optional(),
    notes: z.string().max(200).optional(),
  }),
};

// API Response schemas for validation
export const responseSchemas = {
  company: z.object({
    symbol: baseSchemas.symbol,
    name: baseSchemas.name,
    sector: baseSchemas.sector,
    industry: baseSchemas.industry,
    exchange: baseSchemas.exchange,
    marketCap: z.number(),
    peRatio: z.number().nullable(),
    dividendYield: z.number().nullable(),
    basePrice: baseSchemas.price,
    volatility: z.number(),
    avgVolume: z.number(),
    description: z.string().nullable(),
    createdAt: baseSchemas.date,
    updatedAt: baseSchemas.date,
  }),

  stockData: z.object({
    symbol: baseSchemas.symbol,
    date: baseSchemas.date,
    open: baseSchemas.price,
    high: baseSchemas.price,
    low: baseSchemas.price,
    close: baseSchemas.price,
    volume: baseSchemas.volume,
    change: z.number().nullable(),
    changePercent: baseSchemas.percentage.nullable(),
  }),

  marketStats: z.object({
    totalCompanies: z.number(),
    totalVolume: z.number(),
    averagePrice: z.number(),
    topGainers: z.array(z.object({
      symbol: baseSchemas.symbol,
      changePercent: baseSchemas.percentage,
    })),
    topLosers: z.array(z.object({
      symbol: baseSchemas.symbol,
      changePercent: baseSchemas.percentage,
    })),
    mostActive: z.array(z.object({
      symbol: baseSchemas.symbol,
      volume: baseSchemas.volume,
    })),
  }),

  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
};

// Error response schema
export const errorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  timestamp: z.string(),
  path: z.string(),
  code: z.string().optional(),
});

// Success response schema
export const successSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.string(),
  });

// Paginated response schema
export const paginatedSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    pagination: responseSchemas.pagination,
    message: z.string().optional(),
    timestamp: z.string(),
  });

// Export all schemas
export const schemas = {
  base: baseSchemas,
  company: companySchemas,
  stock: stockSchemas,
  market: marketSchemas,
  search: searchSchemas,
  stats: statsSchemas,
  watchlist: watchlistSchemas,
  portfolio: portfolioSchemas,
  response: responseSchemas,
  error: errorSchema,
  success: successSchema,
  paginated: paginatedSchema,
};
