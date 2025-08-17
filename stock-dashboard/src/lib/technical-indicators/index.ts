/**
 * Technical Analysis Service
 * 
 * This is the main entry point for all technical analysis functionality.
 * It provides a unified interface for indicators, predictions, signals, and backtesting.
 */

// Export all types
export * from './types';

// Export all calculators
export * from './calculators';

// Export prediction models
export * from './predictions';

// Export trading signals
export * from './trading-signals';

// Export backtesting
export * from './backtesting';

// Main service class
import {
  PriceDataPoint,
  TechnicalAnalysis,
  PredictionConfig,
  TradingSignal,
  BacktestConfig,
  BacktestResult
} from './types';
import { calculateAllIndicators } from './calculators';
import { getPrediction } from './predictions';
import { generateTradingSignal, generateMultiTimeframeSignals } from './trading-signals';
import { runBacktest, optimizeStrategy, generateBacktestReport } from './backtesting';

/**
 * Technical Analysis Service
 * 
 * Provides a comprehensive interface for all technical analysis features.
 */
export class TechnicalAnalysisService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Perform complete technical analysis on price data
   */
  async analyzeStock(
    symbol: string,
    data: PriceDataPoint[],
    predictionConfig?: PredictionConfig
  ): Promise<TechnicalAnalysis> {
    const cacheKey = `${symbol}_${data.length}_${data[data.length - 1].date.getTime()}`;
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    if (data.length < 50) {
      throw new Error('Insufficient data for technical analysis');
    }

    try {
      // Calculate all indicators
      const indicators = calculateAllIndicators(data);
      
      // Generate trading signal
      const signal = generateTradingSignal(data);
      
      // Generate prediction if config provided
      let prediction = undefined;
      if (predictionConfig) {
        try {
          prediction = getPrediction(data, predictionConfig);
        } catch (error) {
          console.warn('Prediction failed:', error);
        }
      }

      const analysis: TechnicalAnalysis = {
        symbol,
        date: data[data.length - 1].date,
        price: data[data.length - 1],
        indicators: {
          sma: [indicators.sma20[indicators.sma20.length - 1], indicators.sma50[indicators.sma50.length - 1]],
          ema: [indicators.ema12[indicators.ema12.length - 1], indicators.ema26[indicators.ema26.length - 1]],
          rsi: indicators.rsi[indicators.rsi.length - 1],
          macd: indicators.macd[indicators.macd.length - 1],
          bollingerBands: indicators.bollingerBands[indicators.bollingerBands.length - 1],
          supportResistance: {
            date: data[data.length - 1].date,
            support: indicators.supportResistance.filter(l => l.type === 'support'),
            resistance: indicators.supportResistance.filter(l => l.type === 'resistance'),
            currentPrice: data[data.length - 1].close
          }
        },
        prediction,
        signal,
        alerts: []
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: analysis,
        timestamp: Date.now()
      });

      return analysis;
    } catch (error) {
      throw new Error(`Technical analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate multi-timeframe analysis
   */
  async generateMultiTimeframeAnalysis(
    symbol: string,
    data: PriceDataPoint[]
  ): Promise<{
    shortTerm: TradingSignal;
    mediumTerm: TradingSignal;
    longTerm: TradingSignal;
  }> {
    try {
      return generateMultiTimeframeSignals(data);
    } catch (error) {
      throw new Error(`Multi-timeframe analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Run backtest on historical data
   */
  async runBacktest(
    data: PriceDataPoint[],
    config: BacktestConfig
  ): Promise<BacktestResult> {
    try {
      return runBacktest(data, config);
    } catch (error) {
      throw new Error(`Backtest failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Optimize strategy parameters
   */
  async optimizeStrategy(
    data: PriceDataPoint[],
    baseConfig: BacktestConfig,
    paramRanges: {
      positionSize?: number[];
      stopLoss?: number[];
      takeProfit?: number[];
    }
  ): Promise<{ config: BacktestConfig; result: BacktestResult }> {
    try {
      return optimizeStrategy(data, baseConfig, paramRanges);
    } catch (error) {
      throw new Error(`Strategy optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate backtest report
   */
  generateReport(result: BacktestResult): string {
    return generateBacktestReport(result);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const technicalAnalysisService = new TechnicalAnalysisService();

/**
 * Utility functions for common analysis tasks
 */

/**
 * Convert historical data to price data points
 */
export function convertToPriceDataPoints(data: any[]): PriceDataPoint[] {
  return data.map(item => ({
    date: new Date(item.date || item.timestamp),
    open: Number(item.open),
    high: Number(item.high),
    low: Number(item.low),
    close: Number(item.close),
    volume: Number(item.volume || 0)
  }));
}

/**
 * Validate price data
 */
export function validatePriceData(data: PriceDataPoint[]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  for (const point of data) {
    if (!point.date || !point.open || !point.high || !point.low || !point.close) {
      return false;
    }
    
    // Validate OHLC relationships
    if (point.high < point.low || point.high < point.open || point.high < point.close ||
        point.low > point.open || point.low > point.close) {
      return false;
    }
  }

  return true;
}

/**
 * Get default prediction configuration
 */
export function getDefaultPredictionConfig(): PredictionConfig {
  return {
    horizon: 7, // 7 days
    confidence: 0.8,
    algorithm: 'ensemble'
  };
}

/**
 * Get default backtest configuration
 */
export function getDefaultBacktestConfig(): BacktestConfig {
  return {
    initialCapital: 10000,
    positionSize: 0.2, // 20% per trade
    stopLoss: 0.1, // 10% stop loss
    takeProfit: 0.2, // 20% take profit
    maxPositions: 3,
    commission: 0.001, // 0.1% commission
    slippage: 0.0005, // 0.05% slippage
    strategy: 'signal_based'
  };
}

/**
 * Format technical analysis for display
 */
export function formatTechnicalAnalysis(analysis: TechnicalAnalysis): {
  summary: string;
  indicators: Record<string, any>;
  signals: string[];
  alerts: string[];
} {
  const summary = `${analysis.symbol} Technical Analysis - ${analysis.date.toLocaleDateString()}`;
  
  const indicators: Record<string, any> = {};
  
  if (analysis.indicators.rsi) {
    indicators.RSI = {
      value: analysis.indicators.rsi.value.toFixed(2),
      signal: analysis.indicators.rsi.signal,
      strength: analysis.indicators.rsi.strength
    };
  }
  
  if (analysis.indicators.macd) {
    indicators.MACD = {
      value: analysis.indicators.macd.macd.toFixed(4),
      signal: analysis.indicators.macd.signal.toFixed(4),
      histogram: analysis.indicators.macd.histogram.toFixed(4),
      trend: analysis.indicators.macd.trend
    };
  }
  
  if (analysis.indicators.bollingerBands) {
    indicators['Bollinger Bands'] = {
      upper: analysis.indicators.bollingerBands.upper.toFixed(2),
      middle: analysis.indicators.bollingerBands.middle.toFixed(2),
      lower: analysis.indicators.bollingerBands.lower.toFixed(2),
      bandwidth: analysis.indicators.bollingerBands.bandwidth.toFixed(4)
    };
  }
  
  const signals: string[] = [];
  if (analysis.signal) {
    signals.push(`${analysis.signal.type.toUpperCase()} signal (${analysis.signal.strength})`);
    signals.push(`Confidence: ${(analysis.signal.confidence * 100).toFixed(1)}%`);
    signals.push(...analysis.signal.reasoning);
  }
  
  const alerts: string[] = [];
  if (analysis.alerts) {
    alerts.push(...analysis.alerts);
  }
  
  return { summary, indicators, signals, alerts };
}
