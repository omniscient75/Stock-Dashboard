// Mock data generator for realistic stock market data
// This service generates OHLCV data with proper validation and market patterns

import { 
  OHLCVData, 
  ValidationRules, 
  MockDataOptions,
  IndianCompany
} from '@/types/stock';
import { getScenario, createCustomScenario } from './market-scenarios';
import { INDIAN_COMPANIES, getCompanyBySymbol } from './indian-companies';

// Default validation rules for Indian markets
const DEFAULT_VALIDATION_RULES: ValidationRules = {
  minPrice: 10,           // Minimum price ₹10
  maxPrice: 50000,        // Maximum price ₹50,000
  minVolume: 1000,        // Minimum volume 1,000 shares
  maxVolume: 100000000,   // Maximum volume 10 crore shares
  maxDailyChange: 0.20,   // Maximum 20% daily change
  maxGap: 0.10,           // Maximum 10% gap between days
};

// Financial data validation class
export class FinancialDataValidator {
  /**
   * Validates OHLCV data relationships
   * @param data - OHLCV data to validate
   * @returns Array of validation errors
   */
  static validateOHLCV(data: OHLCVData): string[] {
    const errors: string[] = [];

    // High must be >= Open and Close
    if (data.high < data.open || data.high < data.close) {
      errors.push('High price must be greater than or equal to Open and Close prices');
    }

    // Low must be <= Open and Close
    if (data.low > data.open || data.low > data.close) {
      errors.push('Low price must be less than or equal to Open and Close prices');
    }

    // Volume must be positive
    if (data.volume <= 0) {
      errors.push('Volume must be positive');
    }

    // Price must be positive
    if (data.open <= 0 || data.high <= 0 || data.low <= 0 || data.close <= 0) {
      errors.push('All prices must be positive');
    }

    return errors;
  }

  /**
   * Validates price data against rules
   * @param data - OHLCV data to validate
   * @param rules - Validation rules
   * @returns Array of validation errors
   */
  static validatePriceRules(data: OHLCVData, rules: ValidationRules): string[] {
    const errors: string[] = [];

    // Check price range
    if (data.close < rules.minPrice || data.close > rules.maxPrice) {
      errors.push(`Close price must be between ₹${rules.minPrice} and ₹${rules.maxPrice}`);
    }

    // Check volume range
    if (data.volume < rules.minVolume || data.volume > rules.maxVolume) {
      errors.push(`Volume must be between ${rules.minVolume.toLocaleString()} and ${rules.maxVolume.toLocaleString()}`);
    }

    return errors;
  }

  /**
   * Validates daily change percentage
   * @param currentClose - Current closing price
   * @param previousClose - Previous closing price
   * @param maxChange - Maximum allowed change
   * @returns Validation error or null
   */
  static validateDailyChange(
    currentClose: number, 
    previousClose: number, 
    maxChange: number
  ): string | null {
    if (previousClose === 0) return null;
    
    const changePercent = Math.abs((currentClose - previousClose) / previousClose);
    if (changePercent > maxChange) {
      return `Daily change ${(changePercent * 100).toFixed(2)}% exceeds maximum ${(maxChange * 100).toFixed(2)}%`;
    }
    
    return null;
  }

  /**
   * Validates gap between trading days
   * @param currentOpen - Current opening price
   * @param previousClose - Previous closing price
   * @param maxGap - Maximum allowed gap
   * @returns Validation error or null
   */
  static validateGap(
    currentOpen: number, 
    previousClose: number, 
    maxGap: number
  ): string | null {
    if (previousClose === 0) return null;
    
    const gapPercent = Math.abs((currentOpen - previousClose) / previousClose);
    if (gapPercent > maxGap) {
      return `Gap ${(gapPercent * 100).toFixed(2)}% exceeds maximum ${(maxGap * 100).toFixed(2)}%`;
    }
    
    return null;
  }
}

// Mock data generator class
export class MockDataGenerator {
  private randomSeed: number;

  constructor(seed?: number) {
    this.randomSeed = seed || Math.floor(Math.random() * 1000000);
  }

  /**
   * Generates a pseudo-random number (seeded for consistency)
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number between min and max
   */
  private random(min: number = 0, max: number = 1): number {
    this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
    const random = this.randomSeed / 233280;
    return min + random * (max - min);
  }

  /**
   * Generates a random number from normal distribution
   * @param mean - Mean of the distribution
   * @param stdDev - Standard deviation
   * @returns Random number from normal distribution
   */
  private normalRandom(mean: number = 0, stdDev: number = 1): number {
    // Box-Muller transform
    const u1 = this.random();
    const u2 = this.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  /**
   * Generates realistic OHLCV data for a single day
   * @param previousClose - Previous day's closing price
   * @param volatility - Daily volatility
   * @param trend - Daily trend
   * @param avgVolume - Average volume
   * @param volumeMultiplier - Volume multiplier
   * @returns OHLCV data for the day
   */
  generateDailyOHLCV(
    previousClose: number,
    volatility: number,
    trend: number,
    avgVolume: number,
    volumeMultiplier: number = 1.0
  ): OHLCVData {
    // Generate price movement using normal distribution
    const priceChange = this.normalRandom(trend, volatility);
    const targetClose = previousClose * (1 + priceChange);

    // Generate open price (slight gap from previous close)
    const gap = this.normalRandom(0, volatility * 0.5);
    const open = previousClose * (1 + gap);

    // Generate close price
    const close = targetClose;

    // Generate high and low prices
    const intradayVolatility = volatility * 0.7;
    const highOffset = Math.abs(this.normalRandom(0, intradayVolatility));
    const lowOffset = Math.abs(this.normalRandom(0, intradayVolatility));

    const high = Math.max(open, close) * (1 + highOffset);
    const low = Math.min(open, close) * (1 - lowOffset);

    // Generate volume with some randomness
    const volumeVariation = this.normalRandom(1, 0.3); // ±30% variation
    const volume = Math.max(1000, avgVolume * volumeMultiplier * volumeVariation);

    return {
      date: new Date(), // Will be set by caller
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(volume),
      adjustedClose: parseFloat(close.toFixed(2)),
    };
  }

  /**
   * Generates historical OHLCV data for a company
   * @param company - Company data
   * @param options - Generation options
   * @returns Array of OHLCV data
   */
  generateHistoricalData(
    company: IndianCompany,
    options: MockDataOptions
  ): OHLCVData[] {
    const {
      startDate,
      endDate,
      scenario = getScenario('normal') || createCustomScenario('default', 0.02, 0.001),
      validationRules = DEFAULT_VALIDATION_RULES,
      includeWeekends = false,
    } = options;

    const data: OHLCVData[] = [];
    let currentPrice = company.basePrice;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Skip weekends if not included
      if (!includeWeekends && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Generate daily data
      const dailyData = this.generateDailyOHLCV(
        currentPrice,
        scenario.volatility,
        scenario.trend,
        company.avgVolume,
        scenario.volumeMultiplier
      );

      // Set the date
      dailyData.date = new Date(currentDate);

      // Validate the data
      const validationErrors = [
        ...FinancialDataValidator.validateOHLCV(dailyData),
        ...FinancialDataValidator.validatePriceRules(dailyData, validationRules),
      ];

      // If validation fails, regenerate with adjusted parameters
      if (validationErrors.length > 0) {
        console.warn(`Validation errors for ${company.symbol} on ${currentDate.toISOString()}:`, validationErrors);
        // For now, we'll use the data as is, but in production you might want to regenerate
      }

      data.push(dailyData);
      currentPrice = dailyData.close;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  /**
   * Generates data for multiple companies
   * @param symbols - Array of company symbols
   * @param options - Generation options
   * @returns Object with company symbol as key and OHLCV data as value
   */
  generateMultiCompanyData(
    symbols: string[],
    options: MockDataOptions
  ): Record<string, OHLCVData[]> {
    const result: Record<string, OHLCVData[]> = {};

    for (const symbol of symbols) {
      const company = getCompanyBySymbol(symbol);
      if (!company) {
        console.warn(`Company not found for symbol: ${symbol}`);
        continue;
      }

      result[symbol] = this.generateHistoricalData(company, options);
    }

    return result;
  }

  /**
   * Generates data for all Indian companies
   * @param options - Generation options
   * @returns Object with company symbol as key and OHLCV data as value
   */
  generateAllCompaniesData(options: MockDataOptions): Record<string, OHLCVData[]> {
    const symbols = INDIAN_COMPANIES.map((company: IndianCompany) => company.symbol);
    return this.generateMultiCompanyData(symbols, options);
  }

  /**
   * Generates data for a specific market scenario
   * @param scenarioName - Name of the scenario
   * @param symbols - Array of company symbols
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Object with company symbol as key and OHLCV data as value
   */
  generateScenarioData(
    scenarioName: string,
    symbols: string[],
    startDate: Date,
    endDate: Date
  ): Record<string, OHLCVData[]> {
    const scenario = getScenario(scenarioName);
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioName}`);
    }

    const options: MockDataOptions = {
      startDate,
      endDate,
      scenario,
      validationRules: DEFAULT_VALIDATION_RULES,
      includeWeekends: false,
    };

    return this.generateMultiCompanyData(symbols, options);
  }

  /**
   * Analyzes generated data for statistical properties
   * @param data - Array of OHLCV data
   * @returns Statistical analysis
   */
  analyzeData(data: OHLCVData[]): {
    totalDays: number;
    avgVolume: number;
    avgChange: number;
    avgChangePercent: number;
    maxGain: number;
    maxLoss: number;
    volatility: number;
  } {
    if (!data || data.length < 2) {
      throw new Error('Insufficient data to analyze. Need at least 2 data points.');
    }

    const volumes = data.map(d => d.volume);
    const changes: number[] = [];
    const changePercents: number[] = [];
    
    // Calculate changes and percentages
    for (let i = 1; i < data.length; i++) {
      const prevData = data[i - 1];
      const currentData = data[i];
      
      if (!prevData || !currentData) continue;
      
      const prevClose = prevData.close;
      const currentClose = currentData.close;
      
      if (typeof prevClose === 'number' && typeof currentClose === 'number') {
        const change = currentClose - prevClose;
        changes.push(change);
        changePercents.push(change / prevClose);
      }
    }

    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const avgChangePercent = changePercents.reduce((sum, pct) => sum + pct, 0) / changePercents.length;
    const maxGain = Math.max(...changePercents);
    const maxLoss = Math.min(...changePercents);
    const volatility = Math.sqrt(changePercents.reduce((sum, pct) => sum + Math.pow(pct - avgChangePercent, 2), 0) / changePercents.length);

    return {
      totalDays: data.length,
      avgVolume: Math.floor(avgVolume),
      avgChange: parseFloat(avgChange.toFixed(2)),
      avgChangePercent: parseFloat((avgChangePercent * 100).toFixed(2)),
      maxGain: parseFloat((maxGain * 100).toFixed(2)),
      maxLoss: parseFloat((maxLoss * 100).toFixed(2)),
      volatility: parseFloat((volatility * 100).toFixed(2)),
    };
  }
}

// Export utility functions
export function createMockDataGenerator(seed?: number): MockDataGenerator {
  return new MockDataGenerator(seed);
}

export function generateSampleData(
  symbol: string,
  days: number = 30,
  scenario: string = 'normal'
): OHLCVData[] {
  const generator = new MockDataGenerator();
  const company = getCompanyBySymbol(symbol);
  
  if (!company) {
    throw new Error(`Company not found: ${symbol}`);
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const options: MockDataOptions = {
    startDate,
    endDate,
    scenario: getScenario(scenario) || getScenario('normal')!,
    validationRules: DEFAULT_VALIDATION_RULES,
    includeWeekends: false,
  };

  return generator.generateHistoricalData(company, options);
}
