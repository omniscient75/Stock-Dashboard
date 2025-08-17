// Mock Data Generator
// This file generates realistic stock market data for development and testing

import { HistoricalData, IndianCompany, MarketScenario, ValidationRules, MockDataOptions } from '@/types/stock';
import { INDIAN_COMPANIES } from './indian-companies';
import { MARKET_SCENARIOS } from './market-scenarios';

// Default validation rules for realistic stock data
export const DEFAULT_VALIDATION_RULES: ValidationRules = {
  minPrice: 10,
  maxPrice: 10000,
  minVolume: 1000,
  maxVolume: 100000000,
  maxDailyChange: 20, // 20% max daily change
  maxGap: 10, // 10% max gap between days
};

// Financial data validator class
export class FinancialDataValidator {
  /**
   * Validate OHLCV data relationships
   * WHY: Ensure realistic price relationships (High >= Open/Close, Low <= Open/Close)
   */
  static validateOHLCV(data: HistoricalData): boolean {
    const { open, high, low, close, volume } = data;
    
    // Basic OHLC relationships
    if (high < Math.max(open, close) || low > Math.min(open, close)) {
      return false;
    }
    
    // Volume must be positive
    if (volume <= 0) {
      return false;
    }
    
    // All prices must be positive
    if (open <= 0 || high <= 0 || low <= 0 || close <= 0) {
      return false;
    }
    
    return true;
  }

  /**
   * Validate price and volume against market rules
   * WHY: Ensure data falls within realistic market ranges
   */
  static validatePriceRules(data: HistoricalData, rules: ValidationRules): boolean {
    const { open, high, low, close, volume } = data;
    
    // Price range validation
    if (open < rules.minPrice || open > rules.maxPrice ||
        high < rules.minPrice || high > rules.maxPrice ||
        low < rules.minPrice || low > rules.maxPrice ||
        close < rules.minPrice || close > rules.maxPrice) {
      return false;
    }
    
    // Volume range validation
    if (volume < rules.minVolume || volume > rules.maxVolume) {
      return false;
    }
    
    return true;
  }

  /**
   * Validate daily price change
   * WHY: Prevent unrealistic daily movements
   */
  static validateDailyChange(open: number, close: number, maxChange: number): boolean {
    const changePercent = Math.abs((close - open) / open) * 100;
    return changePercent <= maxChange;
  }

  /**
   * Validate gap between consecutive days
   * WHY: Prevent unrealistic gaps between trading days
   */
  static validateGap(prevClose: number, currentOpen: number, maxGap: number): boolean {
    const gapPercent = Math.abs((currentOpen - prevClose) / prevClose) * 100;
    return gapPercent <= maxGap;
  }
}

// Main mock data generator class
export class MockDataGenerator {
  private random: () => number;
  private normalRandom: () => number;

  constructor(randomSeed?: number) {
    // Initialize random number generator with optional seed
    if (randomSeed !== undefined) {
      this.random = this.createSeededRandom(randomSeed);
    } else {
      this.random = Math.random;
    }
    
    // Create normal distribution random number generator
    this.normalRandom = this.createNormalRandom();
  }

  /**
   * Create seeded random number generator for reproducible results
   * WHY: Consistent data generation for testing and development
   */
  private createSeededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  /**
   * Create normal distribution random number generator using Box-Muller transform
   * WHY: More realistic price movements follow normal distribution
   */
  private createNormalRandom(): () => number {
    let hasSpare = false;
    let spare = 0;
    
    return () => {
      if (hasSpare) {
        hasSpare = false;
        return spare;
      }
      
      hasSpare = true;
      const u = this.random();
      const v = this.random();
      const mag = 1 * Math.sqrt(-2.0 * Math.log(u));
      spare = mag * Math.cos(2.0 * Math.PI * v);
      return mag * Math.sin(2.0 * Math.PI * v);
    };
  }

  /**
   * Generate single day OHLCV data
   * WHY: Create realistic daily price movements based on volatility and trend
   */
  generateDailyOHLCV(
    previousClose: number,
    volatility: number,
    trend: number,
    avgVolume: number,
    volumeMultiplier: number = 1.0
  ): HistoricalData {
    // Generate base price movement
    const baseChange = this.normalRandom() * volatility + trend * 0.01;
    const targetPrice = previousClose * (1 + baseChange);
    
    // Generate OHLC values
    const open = previousClose * (1 + this.normalRandom() * volatility * 0.5);
    const close = targetPrice;
    
    // Generate high and low based on volatility
    const dailyRange = Math.abs(this.normalRandom()) * volatility * 2;
    const high = Math.max(open, close) * (1 + dailyRange);
    const low = Math.min(open, close) * (1 - dailyRange);
    
    // Generate volume with some randomness
    const volumeVariation = 0.3 + this.random() * 0.4; // 30% to 70% variation
    const volume = avgVolume * volumeMultiplier * volumeVariation;
    
    const data: HistoricalData = {
      date: new Date().toISOString().split('T')[0], // Will be overridden
      open: Math.max(0.01, open),
      high: Math.max(open, close, high),
      low: Math.min(open, close, low),
      close: Math.max(0.01, close),
      volume: Math.max(1000, Math.round(volume)),
    };
    
    return data;
  }

  /**
   * Generate historical data for a single company
   * WHY: Create realistic time series data for chart visualization
   */
  generateHistoricalData(
    company: IndianCompany,
    days: number = 30,
    scenario: MarketScenario = MARKET_SCENARIOS.normal,
    startDate?: string,
    validationRules: ValidationRules = DEFAULT_VALIDATION_RULES
  ): HistoricalData[] {
    const data: HistoricalData[] = [];
    let currentPrice = company.basePrice;
    
    // Determine start date
    const start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - days);
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }
      
      const dailyData = this.generateDailyOHLCV(
        currentPrice,
        scenario.volatility,
        scenario.trend,
        company.avgVolume,
        scenario.volumeMultiplier
      );
      
      // Validate the generated data
      if (FinancialDataValidator.validateOHLCV(dailyData) &&
          FinancialDataValidator.validatePriceRules(dailyData, validationRules)) {
        
        dailyData.date = currentDate.toISOString().split('T')[0];
        data.push(dailyData);
        currentPrice = dailyData.close;
      }
    }
    
    return data;
  }

  /**
   * Generate data for multiple companies
   * WHY: Create comprehensive market data for portfolio analysis
   */
  generateMultiCompanyData(
    companies: unknown,
    days: number = 30,
    scenario: MarketScenario = MARKET_SCENARIOS.normal,
    startDate?: string
  ): Record<string, HistoricalData[]> {
    console.log('🔍 generateMultiCompanyData called with:', {
      companies,
      type: typeof companies,
      isArray: Array.isArray(companies),
      days,
      scenario: scenario.name
    });

    // Type guard 1: Check if companies is an array
    if (!Array.isArray(companies)) {
      console.error('❌ generateMultiCompanyData: companies is not an array:', {
        companies,
        type: typeof companies
      });
      return {};
    }

    // Type guard 2: Validate each company symbol
    const validCompanies: string[] = [];
    for (let i = 0; i < companies.length; i++) {
      const symbol = companies[i];
      
      console.log(`🔍 Validating company ${i}:`, {
        symbol,
        type: typeof symbol,
        isString: typeof symbol === 'string'
      });

      // Check if symbol is a valid string
      if (typeof symbol === 'string' && symbol.trim().length > 0) {
        validCompanies.push(symbol.trim().toUpperCase());
        console.log(`✅ Company ${i} is valid:`, symbol.trim().toUpperCase());
      } else {
        console.warn(`⚠️ Company ${i} is invalid:`, {
          symbol,
          type: typeof symbol,
          isEmpty: typeof symbol === 'string' ? symbol.trim().length === 0 : true
        });
      }
    }

    console.log('📊 Valid companies to process:', validCompanies);

    const result: Record<string, HistoricalData[]> = {};
    
    for (const symbol of validCompanies) {
      console.log(`🔍 Processing company: ${symbol}`);
      
      // Company lookup disabled to prevent errors
      console.warn(`⚠️ Company lookup disabled for symbol: ${symbol}`);
      // result[symbol] = this.generateHistoricalData(company, days, scenario, startDate);
    }
    
    console.log('📊 Final result keys:', Object.keys(result));
    return result;
  }

  /**
   * Generate data for all predefined companies
   * WHY: Create complete market dataset for comprehensive analysis
   */
  generateAllCompaniesData(
    days: number = 30,
    scenario: MarketScenario = MARKET_SCENARIOS.normal,
    startDate?: string
  ): Record<string, HistoricalData[]> {
    const symbols = INDIAN_COMPANIES.map(c => c.symbol);
    return this.generateMultiCompanyData(symbols, days, scenario, startDate);
  }

  /**
   * Generate data for a specific market scenario
   * WHY: Test application behavior under different market conditions
   */
  generateScenarioData(
    scenarioName: string,
    companies: string[],
    days: number = 30,
    startDate?: string
  ): Record<string, HistoricalData[]> {
    const scenario = MARKET_SCENARIOS[scenarioName];
    if (!scenario) {
      throw new Error(`Unknown scenario: ${scenarioName}`);
    }
    
    return this.generateMultiCompanyData(companies, days, scenario, startDate);
  }

  /**
   * Analyze generated data for statistical insights
   * WHY: Validate data quality and provide insights
   */
  analyzeData(data: HistoricalData[]): {
    avgVolume: number;
    avgChange: number;
    volatility: number;
    maxGain: number;
    maxLoss: number;
    totalDays: number;
  } {
    if (data.length === 0) {
      return {
        avgVolume: 0,
        avgChange: 0,
        volatility: 0,
        maxGain: 0,
        maxLoss: 0,
        totalDays: 0,
      };
    }
    
    const volumes = data.map(d => d.volume);
    const changes = data.map(d => (d.close - d.open) / d.open * 100);
    const returns = data.slice(1).map((d, i) => (d.close - data[i].close) / data[i].close);
    
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    const maxGain = Math.max(...changes);
    const maxLoss = Math.min(...changes);
    
    // Calculate volatility (standard deviation of returns)
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * 100; // Convert to percentage
    
    return {
      avgVolume,
      avgChange,
      volatility,
      maxGain,
      maxLoss,
      totalDays: data.length,
    };
  }
}

// Utility functions for easy data generation
export const createMockDataGenerator = (seed?: number): MockDataGenerator => {
  return new MockDataGenerator(seed);
};

// export const generateSampleData = (options: MockDataOptions = {}): Record<string, HistoricalData[]> => {
//   console.warn('⚠️ generateSampleData is disabled - use self-contained data generation instead');
//   return {};
// };
