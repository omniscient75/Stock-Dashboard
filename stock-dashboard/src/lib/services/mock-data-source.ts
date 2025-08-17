import { BaseDataSource } from './base-data-source';
import {
  DataSourceConfig,
  DataSourceResponse,
  QueryOptions,
  SearchOptions,
  StockDataPoint,
  LatestPriceData,
  CompanyData,
  DataSourceType,
} from './data-source.types';
import { INDIAN_COMPANIES } from '../indian-companies';

/**
 * Mock Data Source Implementation
 * 
 * WHY mock data source:
 * - Provides consistent data for development and testing
 * - No external API dependencies
 * - Fast response times
 * - Predictable behavior for UI development
 */
export class MockDataSource extends BaseDataSource {
  constructor(config?: Partial<DataSourceConfig>) {
    const defaultConfig: DataSourceConfig = {
      name: 'Mock Data',
      enabled: true,
      priority: 1,
      rateLimit: {
        requestsPerMinute: 1000,
        requestsPerDay: 100000,
      },
      retryConfig: {
        maxRetries: 0,
        retryDelay: 0,
        backoffMultiplier: 1,
      },
      ...config,
    };
    
    super(DataSourceType.MOCK, defaultConfig);
  }

  async getStockData(options: QueryOptions): Promise<DataSourceResponse<StockDataPoint[]>> {
    const { symbol, startDate, endDate, limit = 30 } = options;
    const normalizedSymbol = this.normalizeSymbol(symbol);
    
    if (!this.validateSymbol(normalizedSymbol)) {
      return this.createErrorResponse({
        code: 'INVALID_SYMBOL',
        message: `Invalid symbol: ${symbol}`,
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('stock-data', { symbol: normalizedSymbol, limit });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      // Simulate network delay
      await this.simulateDelay(100, 300);
      
      return this.generateStockData(normalizedSymbol, limit, startDate, endDate);
    }, 2 * 60 * 1000); // 2 minutes cache
  }

  async getLatestPrice(symbol: string): Promise<DataSourceResponse<LatestPriceData>> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    
    if (!this.validateSymbol(normalizedSymbol)) {
      return this.createErrorResponse({
        code: 'INVALID_SYMBOL',
        message: `Invalid symbol: ${symbol}`,
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('latest-price', { symbol: normalizedSymbol });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      // Simulate network delay
      await this.simulateDelay(50, 150);
      
      return this.generateLatestPrice(normalizedSymbol);
    }, 30 * 1000); // 30 seconds cache for latest price
  }

  async getCompanyInfo(symbol: string): Promise<DataSourceResponse<CompanyData>> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    
    if (!this.validateSymbol(normalizedSymbol)) {
      return this.createErrorResponse({
        code: 'INVALID_SYMBOL',
        message: `Invalid symbol: ${symbol}`,
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('company-info', { symbol: normalizedSymbol });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      // Simulate network delay
      await this.simulateDelay(100, 200);
      
      const company = this.findCompany(normalizedSymbol);
      if (!company) {
        throw new Error(`Company not found: ${normalizedSymbol}`);
      }
      
      return this.transformToCompanyData(company);
    }, 10 * 60 * 1000); // 10 minutes cache for company info
  }

  async searchCompanies(options: SearchOptions): Promise<DataSourceResponse<CompanyData[]>> {
    const { query, type = 'all', limit = 10 } = options;
    
    if (!query || query.trim().length === 0) {
      return this.createErrorResponse({
        code: 'INVALID_QUERY',
        message: 'Search query is required',
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('search-companies', { query, type, limit });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      // Simulate network delay
      await this.simulateDelay(200, 500);
      
      return this.searchCompaniesData(query, type, limit);
    }, 5 * 60 * 1000); // 5 minutes cache for search results
  }

  /**
   * Generate realistic stock data
   */
  private generateStockData(
    symbol: string,
    days: number,
    startDate?: string,
    endDate?: string
  ): StockDataPoint[] {
    const data: StockDataPoint[] = [];
    const basePrice = this.getBasePrice(symbol);
    const volatility = this.getVolatility(symbol);
    
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    
    let currentPrice = basePrice;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      // Generate price movement
      const changePercent = (Math.random() - 0.5) * volatility * 2; // -volatility to +volatility
      const change = currentPrice * (changePercent / 100);
      const newPrice = currentPrice + change;
      
      // Generate OHLC data
      const open = currentPrice;
      const close = newPrice;
      const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.01;
      const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.01;
      const volume = Math.floor(Math.random() * 10000000) + 1000000; // 1M to 11M
      
      data.push({
        symbol,
        date: date.toISOString().split('T')[0],
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
      });
      
      currentPrice = close;
    }
    
    return data.reverse(); // Most recent first
  }

  /**
   * Generate latest price data
   */
  private generateLatestPrice(symbol: string): LatestPriceData {
    const basePrice = this.getBasePrice(symbol);
    const volatility = this.getVolatility(symbol);
    
    // Generate current price with some randomness
    const changePercent = (Math.random() - 0.5) * volatility;
    const change = basePrice * (changePercent / 100);
    const price = basePrice + change;
    
    const open = basePrice;
    const high = price + Math.random() * volatility * basePrice * 0.005;
    const low = price - Math.random() * volatility * basePrice * 0.005;
    const volume = Math.floor(Math.random() * 10000000) + 1000000;
    
    return {
      symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      open: Math.round(open * 100) / 100,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Find company in the Indian companies data
   */
  private findCompany(symbol: string): any {
    return INDIAN_COMPANIES.find(company => 
      company.symbol.toUpperCase() === symbol.toUpperCase()
    );
  }

  /**
   * Transform company data to standard format
   */
  private transformToCompanyData(company: any): CompanyData {
    return {
      symbol: company.symbol.toUpperCase(),
      name: company.name,
      sector: company.sector,
      industry: company.industry,
      exchange: company.exchange,
      marketCap: company.marketCap || Math.random() * 1000000 + 100000,
      peRatio: company.peRatio || Math.random() * 50 + 10,
      dividendYield: company.dividendYield || Math.random() * 5,
      basePrice: company.basePrice || Math.random() * 1000 + 100,
      volatility: company.volatility || Math.random() * 0.1 + 0.02,
      avgVolume: company.avgVolume || Math.floor(Math.random() * 10000000) + 1000000,
      description: company.description || `${company.name} is a leading company in the ${company.sector} sector.`,
    };
  }

  /**
   * Search companies based on query and type
   */
  private searchCompaniesData(query: string, type: string, limit: number): CompanyData[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    let filteredCompanies = INDIAN_COMPANIES.filter(company => {
      switch (type) {
        case 'symbol':
          return company.symbol.toLowerCase().includes(normalizedQuery);
        case 'name':
          return company.name.toLowerCase().includes(normalizedQuery);
        case 'sector':
          return company.sector.toLowerCase().includes(normalizedQuery);
        case 'all':
        default:
          return (
            company.symbol.toLowerCase().includes(normalizedQuery) ||
            company.name.toLowerCase().includes(normalizedQuery) ||
            company.sector.toLowerCase().includes(normalizedQuery)
          );
      }
    });
    
    // Sort by relevance (exact matches first)
    filteredCompanies.sort((a, b) => {
      const aExact = a.symbol.toLowerCase() === normalizedQuery || 
                     a.name.toLowerCase() === normalizedQuery;
      const bExact = b.symbol.toLowerCase() === normalizedQuery || 
                     b.name.toLowerCase() === normalizedQuery;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.name.localeCompare(b.name);
    });
    
    // Limit results
    filteredCompanies = filteredCompanies.slice(0, limit);
    
    return filteredCompanies.map(company => this.transformToCompanyData(company));
  }

  /**
   * Get base price for a symbol
   */
  private getBasePrice(symbol: string): number {
    const company = this.findCompany(symbol);
    if (company && company.basePrice) {
      return company.basePrice;
    }
    
    // Generate a realistic base price based on symbol
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 100 + (hash % 900); // 100 to 1000 range
  }

  /**
   * Get volatility for a symbol
   */
  private getVolatility(symbol: string): number {
    const company = this.findCompany(symbol);
    if (company && company.volatility) {
      return company.volatility;
    }
    
    // Generate realistic volatility
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 0.02 + (hash % 8) * 0.01; // 2% to 10% range
  }

  /**
   * Simulate network delay
   */
  private async simulateDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Override health check for mock data source
   */
  async isHealthy(): Promise<boolean> {
    // Mock data source is always healthy
    return true;
  }

  /**
   * Override rate limiting for mock data source
   */
  canMakeRequest(): boolean {
    // Mock data source has no rate limits
    return true;
  }
}
