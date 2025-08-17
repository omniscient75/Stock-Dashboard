import {
  IDataSource,
  DataSourceResponse,
  QueryOptions,
  SearchOptions,
  StockDataPoint,
  LatestPriceData,
  CompanyData,
  DataSourceType,
  DataSourceConfig,
} from './data-source.types';
import { MockDataSource } from './mock-data-source';
import { AlphaVantageDataSource } from './alpha-vantage-data-source';

/**
 * Data Source Manager
 * 
 * WHY this manager:
 * - Handles switching between data sources
 * - Implements fallback strategies
 * - Provides unified interface
 * - Manages data source health and priorities
 * - Handles configuration and environment variables
 */
export class DataSourceManager {
  private dataSources: Map<string, IDataSource> = new Map();
  private currentSource: string = DataSourceType.MOCK;
  private fallbackOrder: string[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.initializeDataSources();
  }

  /**
   * Initialize all available data sources
   */
  private async initializeDataSources(): Promise<void> {
    try {
      // Always add mock data source as fallback
      const mockDataSource = new MockDataSource();
      this.dataSources.set(DataSourceType.MOCK, mockDataSource);

      // Add Alpha Vantage if API key is available
      const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
      if (alphaVantageKey) {
        const alphaVantageDataSource = new AlphaVantageDataSource(alphaVantageKey);
        this.dataSources.set(DataSourceType.ALPHA_VANTAGE, alphaVantageDataSource);
      }

      // Set fallback order (priority order)
      this.fallbackOrder = [
        DataSourceType.ALPHA_VANTAGE,
        DataSourceType.MOCK,
      ].filter(source => this.dataSources.has(source));

      // Set default source
      this.currentSource = this.fallbackOrder[0] || DataSourceType.MOCK;
      
      this.isInitialized = true;
      console.log(`[DataSourceManager] Initialized with sources: ${this.fallbackOrder.join(', ')}`);
      console.log(`[DataSourceManager] Current source: ${this.currentSource}`);
    } catch (error) {
      console.error('[DataSourceManager] Initialization error:', error);
      // Ensure mock data source is always available
      if (!this.dataSources.has(DataSourceType.MOCK)) {
        this.dataSources.set(DataSourceType.MOCK, new MockDataSource());
        this.currentSource = DataSourceType.MOCK;
      }
    }
  }

  /**
   * Get stock data with fallback strategy
   */
  async getStockData(options: QueryOptions): Promise<DataSourceResponse<StockDataPoint[]>> {
    await this.ensureInitialized();
    
    for (const sourceName of this.fallbackOrder) {
      try {
        const source = this.dataSources.get(sourceName);
        if (!source) continue;

        console.log(`[DataSourceManager] Trying ${sourceName} for stock data`);
        const response = await source.getStockData(options);
        
        if (response.success) {
          console.log(`[DataSourceManager] Success from ${sourceName}`);
          return response;
        }
        
        console.log(`[DataSourceManager] Failed from ${sourceName}: ${response.error}`);
      } catch (error) {
        console.error(`[DataSourceManager] Error from ${sourceName}:`, error);
      }
    }
    
    // All sources failed, return error
    return {
      success: false,
      error: 'All data sources failed to provide stock data',
      source: 'DataSourceManager',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get latest price with fallback strategy
   */
  async getLatestPrice(symbol: string): Promise<DataSourceResponse<LatestPriceData>> {
    await this.ensureInitialized();
    
    for (const sourceName of this.fallbackOrder) {
      try {
        const source = this.dataSources.get(sourceName);
        if (!source) continue;

        console.log(`[DataSourceManager] Trying ${sourceName} for latest price`);
        const response = await source.getLatestPrice(symbol);
        
        if (response.success) {
          console.log(`[DataSourceManager] Success from ${sourceName}`);
          return response;
        }
        
        console.log(`[DataSourceManager] Failed from ${sourceName}: ${response.error}`);
      } catch (error) {
        console.error(`[DataSourceManager] Error from ${sourceName}:`, error);
      }
    }
    
    return {
      success: false,
      error: 'All data sources failed to provide latest price',
      source: 'DataSourceManager',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get company info with fallback strategy
   */
  async getCompanyInfo(symbol: string): Promise<DataSourceResponse<CompanyData>> {
    await this.ensureInitialized();
    
    for (const sourceName of this.fallbackOrder) {
      try {
        const source = this.dataSources.get(sourceName);
        if (!source) continue;

        console.log(`[DataSourceManager] Trying ${sourceName} for company info`);
        const response = await source.getCompanyInfo(symbol);
        
        if (response.success) {
          console.log(`[DataSourceManager] Success from ${sourceName}`);
          return response;
        }
        
        console.log(`[DataSourceManager] Failed from ${sourceName}: ${response.error}`);
      } catch (error) {
        console.error(`[DataSourceManager] Error from ${sourceName}:`, error);
      }
    }
    
    return {
      success: false,
      error: 'All data sources failed to provide company info',
      source: 'DataSourceManager',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Search companies with fallback strategy
   */
  async searchCompanies(options: SearchOptions): Promise<DataSourceResponse<CompanyData[]>> {
    await this.ensureInitialized();
    
    for (const sourceName of this.fallbackOrder) {
      try {
        const source = this.dataSources.get(sourceName);
        if (!source) continue;

        console.log(`[DataSourceManager] Trying ${sourceName} for company search`);
        const response = await source.searchCompanies(options);
        
        if (response.success) {
          console.log(`[DataSourceManager] Success from ${sourceName}`);
          return response;
        }
        
        console.log(`[DataSourceManager] Failed from ${sourceName}: ${response.error}`);
      } catch (error) {
        console.error(`[DataSourceManager] Error from ${sourceName}:`, error);
      }
    }
    
    return {
      success: false,
      error: 'All data sources failed to provide search results',
      source: 'DataSourceManager',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Switch to a specific data source
   */
  async switchDataSource(sourceName: string): Promise<boolean> {
    await this.ensureInitialized();
    
    if (!this.dataSources.has(sourceName)) {
      console.error(`[DataSourceManager] Data source not found: ${sourceName}`);
      return false;
    }
    
    const source = this.dataSources.get(sourceName)!;
    
    // Check if the source is healthy
    const isHealthy = await source.isHealthy();
    if (!isHealthy) {
      console.error(`[DataSourceManager] Data source is not healthy: ${sourceName}`);
      return false;
    }
    
    this.currentSource = sourceName;
    console.log(`[DataSourceManager] Switched to: ${sourceName}`);
    return true;
  }

  /**
   * Get current data source
   */
  getCurrentSource(): string {
    return this.currentSource;
  }

  /**
   * Get available data sources
   */
  getAvailableSources(): string[] {
    return Array.from(this.dataSources.keys());
  }

  /**
   * Get data source status
   */
  async getDataSourceStatus(): Promise<Record<string, any>> {
    await this.ensureInitialized();
    
    const status: Record<string, any> = {};
    
    for (const [name, source] of this.dataSources.entries()) {
      try {
        const isHealthy = await source.isHealthy();
        const canMakeRequest = source.canMakeRequest();
        
        status[name] = {
          name: source.name,
          healthy: isHealthy,
          canMakeRequest,
          current: name === this.currentSource,
          config: source.config,
        };
        
        // Add rate limiter stats if available
        if (source.getRateLimitStats) {
          status[name].rateLimitStats = source.getRateLimitStats();
        }
        
        // Add cache stats if available
        if (source.getCacheStats) {
          status[name].cacheStats = source.getCacheStats();
        }
        
        // Add API key status for Alpha Vantage
        if (name === DataSourceType.ALPHA_VANTAGE && (source as any).getApiKeyStatus) {
          status[name].apiKeyStatus = (source as any).getApiKeyStatus();
        }
      } catch (error) {
        status[name] = {
          name: source.name,
          healthy: false,
          error: error.message,
          current: name === this.currentSource,
        };
      }
    }
    
    return status;
  }

  /**
   * Clear cache for all data sources
   */
  async clearAllCaches(): Promise<void> {
    await this.ensureInitialized();
    
    for (const source of this.dataSources.values()) {
      try {
        await source.clearCache();
      } catch (error) {
        console.error(`[DataSourceManager] Error clearing cache for ${source.name}:`, error);
      }
    }
    
    console.log('[DataSourceManager] Cleared all caches');
  }

  /**
   * Get fallback order
   */
  getFallbackOrder(): string[] {
    return [...this.fallbackOrder];
  }

  /**
   * Set fallback order
   */
  setFallbackOrder(order: string[]): void {
    // Validate that all sources in the order exist
    const validOrder = order.filter(source => this.dataSources.has(source));
    
    if (validOrder.length === 0) {
      console.error('[DataSourceManager] No valid sources in fallback order');
      return;
    }
    
    this.fallbackOrder = validOrder;
    console.log(`[DataSourceManager] Updated fallback order: ${this.fallbackOrder.join(' -> ')}`);
  }

  /**
   * Ensure the manager is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeDataSources();
    }
  }

  /**
   * Get environment configuration
   */
  getEnvironmentConfig(): {
    alphaVantageKey: boolean;
    mockDataEnabled: boolean;
    fallbackOrder: string[];
  } {
    return {
      alphaVantageKey: !!process.env.ALPHA_VANTAGE_API_KEY,
      mockDataEnabled: true, // Always enabled as fallback
      fallbackOrder: this.fallbackOrder,
    };
  }

  /**
   * Test all data sources
   */
  async testAllSources(): Promise<Record<string, any>> {
    await this.ensureInitialized();
    
    const results: Record<string, any> = {};
    
    for (const [name, source] of this.dataSources.entries()) {
      try {
        console.log(`[DataSourceManager] Testing ${name}...`);
        
        const startTime = Date.now();
        const testResponse = await source.getLatestPrice('AAPL');
        const endTime = Date.now();
        
        results[name] = {
          success: testResponse.success,
          responseTime: endTime - startTime,
          error: testResponse.error,
          source: testResponse.source,
          timestamp: testResponse.timestamp,
        };
        
        console.log(`[DataSourceManager] ${name} test result:`, results[name]);
      } catch (error) {
        results[name] = {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
        
        console.error(`[DataSourceManager] ${name} test error:`, error);
      }
    }
    
    return results;
  }
}

// Singleton instance
let dataSourceManagerInstance: DataSourceManager | null = null;

/**
 * Get the singleton instance of DataSourceManager
 */
export function getDataSourceManager(): DataSourceManager {
  if (!dataSourceManagerInstance) {
    dataSourceManagerInstance = new DataSourceManager();
  }
  return dataSourceManagerInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetDataSourceManager(): void {
  dataSourceManagerInstance = null;
}
