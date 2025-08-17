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
  DataSourceErrorCode,
} from './data-source.types';

/**
 * Alpha Vantage Data Source Implementation
 * 
 * WHY Alpha Vantage:
 * - Free tier available (500 requests/day)
 * - Comprehensive stock data
 * - Real-time and historical data
 * - Good documentation
 * - Reliable API
 */
export class AlphaVantageDataSource extends BaseDataSource {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';

  constructor(apiKey: string, config?: Partial<DataSourceConfig>) {
    const defaultConfig: DataSourceConfig = {
      name: 'Alpha Vantage',
      enabled: true,
      priority: 2,
      rateLimit: {
        requestsPerMinute: 5, // Alpha Vantage free tier limit
        requestsPerDay: 500,
      },
      retryConfig: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
      },
      ...config,
    };
    
    super(DataSourceType.ALPHA_VANTAGE, defaultConfig);
    this.apiKey = apiKey;
  }

  async getStockData(options: QueryOptions): Promise<DataSourceResponse<StockDataPoint[]>> {
    const { symbol, startDate, endDate, limit = 30 } = options;
    const normalizedSymbol = this.normalizeSymbol(symbol);
    
    if (!this.validateSymbol(normalizedSymbol)) {
      return this.createErrorResponse({
        code: DataSourceErrorCode.INVALID_RESPONSE,
        message: `Invalid symbol: ${symbol}`,
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('stock-data', { symbol: normalizedSymbol, limit });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const url = this.buildUrl('TIME_SERIES_DAILY', {
        symbol: normalizedSymbol,
        outputsize: limit > 100 ? 'full' : 'compact',
      });
      
      const data = await this.makeRequest<any>(url);
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API rate limit exceeded: ' + data['Note']);
      }
      
      return this.transformTimeSeriesData(data, normalizedSymbol, startDate, endDate, limit);
    }, 5 * 60 * 1000); // 5 minutes cache
  }

  async getLatestPrice(symbol: string): Promise<DataSourceResponse<LatestPriceData>> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    
    if (!this.validateSymbol(normalizedSymbol)) {
      return this.createErrorResponse({
        code: DataSourceErrorCode.INVALID_RESPONSE,
        message: `Invalid symbol: ${symbol}`,
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('latest-price', { symbol: normalizedSymbol });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const url = this.buildUrl('GLOBAL_QUOTE', {
        symbol: normalizedSymbol,
      });
      
      const data = await this.makeRequest<any>(url);
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API rate limit exceeded: ' + data['Note']);
      }
      
      return this.transformGlobalQuoteData(data, normalizedSymbol);
    }, 1 * 60 * 1000); // 1 minute cache for latest price
  }

  async getCompanyInfo(symbol: string): Promise<DataSourceResponse<CompanyData>> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    
    if (!this.validateSymbol(normalizedSymbol)) {
      return this.createErrorResponse({
        code: DataSourceErrorCode.INVALID_RESPONSE,
        message: `Invalid symbol: ${symbol}`,
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('company-info', { symbol: normalizedSymbol });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const url = this.buildUrl('OVERVIEW', {
        symbol: normalizedSymbol,
      });
      
      const data = await this.makeRequest<any>(url);
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API rate limit exceeded: ' + data['Note']);
      }
      
      return this.transformOverviewData(data, normalizedSymbol);
    }, 60 * 60 * 1000); // 1 hour cache for company info
  }

  async searchCompanies(options: SearchOptions): Promise<DataSourceResponse<CompanyData[]>> {
    const { query, type = 'all', limit = 10 } = options;
    
    if (!query || query.trim().length === 0) {
      return this.createErrorResponse({
        code: DataSourceErrorCode.INVALID_RESPONSE,
        message: 'Search query is required',
        retryable: false,
      });
    }

    const cacheKey = this.generateCacheKey('search-companies', { query, type, limit });
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const url = this.buildUrl('SYMBOL_SEARCH', {
        keywords: query,
      });
      
      const data = await this.makeRequest<any>(url);
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API rate limit exceeded: ' + data['Note']);
      }
      
      return this.transformSearchData(data, type, limit);
    }, 10 * 60 * 1000); // 10 minutes cache for search results
  }

  /**
   * Build API URL with parameters
   */
  private buildUrl(functionName: string, params: Record<string, any>): string {
    const url = new URL(this.baseUrl);
    url.searchParams.set('function', functionName);
    url.searchParams.set('apikey', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });
    
    return url.toString();
  }

  /**
   * Transform time series data from Alpha Vantage
   */
  private transformTimeSeriesData(
    data: any,
    symbol: string,
    startDate?: string,
    endDate?: string,
    limit?: number
  ): StockDataPoint[] {
    const timeSeriesKey = 'Time Series (Daily)';
    const timeSeries = data[timeSeriesKey];
    
    if (!timeSeries) {
      throw new Error('No time series data found');
    }
    
    const stockData: StockDataPoint[] = [];
    const dates = Object.keys(timeSeries).sort().reverse(); // Most recent first
    
    let count = 0;
    for (const date of dates) {
      if (limit && count >= limit) break;
      
      // Filter by date range if provided
      if (startDate && date < startDate) continue;
      if (endDate && date > endDate) continue;
      
      const dailyData = timeSeries[date];
      
      stockData.push({
        symbol,
        date,
        open: parseFloat(dailyData['1. open']),
        high: parseFloat(dailyData['2. high']),
        low: parseFloat(dailyData['3. low']),
        close: parseFloat(dailyData['4. close']),
        volume: parseInt(dailyData['5. volume']),
        change: 0, // Calculate if needed
        changePercent: 0, // Calculate if needed
      });
      
      count++;
    }
    
    return stockData;
  }

  /**
   * Transform global quote data from Alpha Vantage
   */
  private transformGlobalQuoteData(data: any, symbol: string): LatestPriceData {
    const quoteKey = 'Global Quote';
    const quote = data[quoteKey];
    
    if (!quote) {
      throw new Error('No quote data found');
    }
    
    return {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Transform overview data from Alpha Vantage
   */
  private transformOverviewData(data: any, symbol: string): CompanyData {
    return {
      symbol,
      name: data.Name || symbol,
      sector: data.Sector || 'Unknown',
      industry: data.Industry || 'Unknown',
      exchange: data.Exchange || 'Unknown',
      marketCap: parseFloat(data.MarketCapitalization) || 0,
      peRatio: data.PERatio ? parseFloat(data.PERatio) : undefined,
      dividendYield: data.DividendYield ? parseFloat(data.DividendYield) : undefined,
      basePrice: parseFloat(data.LatestPrice) || parseFloat(data['52WeekHigh']) || 100,
      volatility: 0.05, // Default volatility
      avgVolume: parseInt(data.Volume) || 0,
      description: data.Description || `${data.Name || symbol} company information`,
    };
  }

  /**
   * Transform search data from Alpha Vantage
   */
  private transformSearchData(data: any, type: string, limit: number): CompanyData[] {
    const matches = data.bestMatches || [];
    
    return matches.slice(0, limit).map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      sector: 'Unknown', // Alpha Vantage search doesn't provide sector
      industry: 'Unknown',
      exchange: match['4. region'] || 'Unknown',
      marketCap: 0, // Not provided in search results
      basePrice: 0,
      volatility: 0.05,
      avgVolume: 0,
      description: `${match['2. name']} (${match['1. symbol']})`,
    }));
  }

  /**
   * Override health check for Alpha Vantage
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Make a simple request to test connectivity
      const url = this.buildUrl('GLOBAL_QUOTE', { symbol: 'AAPL' });
      const data = await this.makeRequest<any>(url);
      
      // Check for API errors
      if (data['Error Message'] || data['Note']) {
        this.isHealthyStatus = false;
        return false;
      }
      
      this.isHealthyStatus = true;
      return true;
    } catch (error) {
      this.isHealthyStatus = false;
      return false;
    }
  }

  /**
   * Get API key status
   */
  getApiKeyStatus(): { hasKey: boolean; keyLength: number } {
    return {
      hasKey: !!this.apiKey && this.apiKey.length > 0,
      keyLength: this.apiKey?.length || 0,
    };
  }
}
