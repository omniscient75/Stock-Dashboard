/**
 * Technical Indicators Calculators
 * 
 * This module contains mathematical implementations of popular technical indicators.
 * Each function is optimized for performance and includes proper error handling.
 */

import {
  PriceDataPoint,
  MovingAverageConfig,
  MovingAverageResult,
  RSIConfig,
  RSIResult,
  BollingerBandsConfig,
  BollingerBandsResult,
  MACDConfig,
  MACDResult,
  SupportResistanceLevel,
  SupportResistanceResult
} from './types';

/**
 * Utility function to get price value based on source
 */
function getPriceValue(dataPoint: PriceDataPoint, source: string): number {
  switch (source) {
    case 'open': return dataPoint.open;
    case 'high': return dataPoint.high;
    case 'low': return dataPoint.low;
    case 'volume': return dataPoint.volume;
    case 'close':
    default:
      return dataPoint.close;
  }
}

/**
 * Simple Moving Average (SMA)
 * 
 * Formula: SMA = (P1 + P2 + ... + Pn) / n
 * Where P = Price, n = Number of periods
 * 
 * Why SMA? It smooths out price fluctuations and shows the overall trend.
 * Common periods: 20 (short-term), 50 (medium-term), 200 (long-term)
 */
export function calculateSMA(
  data: PriceDataPoint[],
  config: MovingAverageConfig
): MovingAverageResult[] {
  if (data.length < config.period) {
    return [];
  }

  const results: MovingAverageResult[] = [];
  
  for (let i = config.period - 1; i < data.length; i++) {
    let sum = 0;
    
    // Calculate sum of prices for the period
    for (let j = 0; j < config.period; j++) {
      sum += getPriceValue(data[i - j], config.source);
    }
    
    const sma = sum / config.period;
    
    results.push({
      date: data[i].date,
      value: Number(sma.toFixed(4)),
      period: config.period
    });
  }
  
  return results;
}

/**
 * Exponential Moving Average (EMA)
 * 
 * Formula: EMA = (Price × Multiplier) + (Previous EMA × (1 - Multiplier))
 * Multiplier = 2 / (Period + 1)
 * 
 * Why EMA? It gives more weight to recent prices, making it more responsive
 * to recent price changes than SMA.
 */
export function calculateEMA(
  data: PriceDataPoint[],
  config: MovingAverageConfig
): MovingAverageResult[] {
  if (data.length < config.period) {
    return [];
  }

  const results: MovingAverageResult[] = [];
  const multiplier = 2 / (config.period + 1);
  
  // Initialize EMA with SMA of first 'period' values
  let ema = 0;
  for (let i = 0; i < config.period; i++) {
    ema += getPriceValue(data[i], config.source);
  }
  ema = ema / config.period;
  
  // Add first EMA result
  results.push({
    date: data[config.period - 1].date,
    value: Number(ema.toFixed(4)),
    period: config.period
  });
  
  // Calculate EMA for remaining data points
  for (let i = config.period; i < data.length; i++) {
    const currentPrice = getPriceValue(data[i], config.source);
    ema = (currentPrice * multiplier) + (ema * (1 - multiplier));
    
    results.push({
      date: data[i].date,
      value: Number(ema.toFixed(4)),
      period: config.period
    });
  }
  
  return results;
}

/**
 * Relative Strength Index (RSI)
 * 
 * Formula: RSI = 100 - (100 / (1 + RS))
 * RS = Average Gain / Average Loss
 * 
 * Why RSI? It measures the speed and magnitude of price changes to identify
 * overbought (>70) or oversold (<30) conditions.
 */
export function calculateRSI(
  data: PriceDataPoint[],
  config: RSIConfig = { period: 14, overbought: 70, oversold: 30 }
): RSIResult[] {
  if (data.length < config.period + 1) {
    return [];
  }

  const results: RSIResult[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, config.period).reduce((sum, gain) => sum + gain, 0) / config.period;
  let avgLoss = losses.slice(0, config.period).reduce((sum, loss) => sum + loss, 0) / config.period;
  
  // Calculate first RSI
  let rs = avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));
  
  results.push({
    date: data[config.period].date,
    value: Number(rsi.toFixed(2)),
    signal: rsi > config.overbought ? 'overbought' : rsi < config.oversold ? 'oversold' : 'neutral',
    strength: Math.abs(rsi - 50) > 20 ? 'strong' : Math.abs(rsi - 50) > 10 ? 'moderate' : 'weak'
  });
  
  // Calculate RSI for remaining data points using smoothing
  for (let i = config.period + 1; i < data.length; i++) {
    avgGain = ((avgGain * (config.period - 1)) + gains[i - 1]) / config.period;
    avgLoss = ((avgLoss * (config.period - 1)) + losses[i - 1]) / config.period;
    
    rs = avgGain / avgLoss;
    rsi = 100 - (100 / (1 + rs));
    
    results.push({
      date: data[i].date,
      value: Number(rsi.toFixed(2)),
      signal: rsi > config.overbought ? 'overbought' : rsi < config.oversold ? 'oversold' : 'neutral',
      strength: Math.abs(rsi - 50) > 20 ? 'strong' : Math.abs(rsi - 50) > 10 ? 'moderate' : 'weak'
    });
  }
  
  return results;
}

/**
 * Bollinger Bands
 * 
 * Formula:
 * Middle Band = SMA(period)
 * Upper Band = Middle + (Standard Deviation × multiplier)
 * Lower Band = Middle - (Standard Deviation × multiplier)
 * 
 * Why Bollinger Bands? They show price volatility and potential support/resistance levels.
 * When bands contract, volatility is low; when they expand, volatility is high.
 */
export function calculateBollingerBands(
  data: PriceDataPoint[],
  config: BollingerBandsConfig = { period: 20, standardDeviations: 2, source: 'close' }
): BollingerBandsResult[] {
  if (data.length < config.period) {
    return [];
  }

  const results: BollingerBandsResult[] = [];
  
  for (let i = config.period - 1; i < data.length; i++) {
    // Calculate SMA (middle band)
    let sum = 0;
    for (let j = 0; j < config.period; j++) {
      sum += getPriceValue(data[i - j], config.source);
    }
    const sma = sum / config.period;
    
    // Calculate standard deviation
    let variance = 0;
    for (let j = 0; j < config.period; j++) {
      const price = getPriceValue(data[i - j], config.source);
      variance += Math.pow(price - sma, 2);
    }
    const standardDeviation = Math.sqrt(variance / config.period);
    
    // Calculate bands
    const upper = sma + (standardDeviation * config.standardDeviations);
    const lower = sma - (standardDeviation * config.standardDeviations);
    const currentPrice = getPriceValue(data[i], config.source);
    
    // Calculate additional metrics
    const bandwidth = (upper - lower) / sma;
    const percentB = (currentPrice - lower) / (upper - lower);
    
    results.push({
      date: data[i].date,
      upper: Number(upper.toFixed(4)),
      middle: Number(sma.toFixed(4)),
      lower: Number(lower.toFixed(4)),
      bandwidth: Number(bandwidth.toFixed(4)),
      percentB: Number(percentB.toFixed(4))
    });
  }
  
  return results;
}

/**
 * Moving Average Convergence Divergence (MACD)
 * 
 * Formula:
 * MACD Line = EMA(fast) - EMA(slow)
 * Signal Line = EMA(MACD Line)
 * Histogram = MACD Line - Signal Line
 * 
 * Why MACD? It shows the relationship between two moving averages and helps
 * identify momentum changes and potential trend reversals.
 */
export function calculateMACD(
  data: PriceDataPoint[],
  config: MACDConfig = { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
): MACDResult[] {
  if (data.length < config.slowPeriod + config.signalPeriod) {
    return [];
  }

  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(data, { period: config.fastPeriod, source: 'close' });
  const slowEMA = calculateEMA(data, { period: config.slowPeriod, source: 'close' });
  
  // Calculate MACD line
  const macdLine: { date: Date; value: number }[] = [];
  const slowStartIndex = config.slowPeriod - config.fastPeriod;
  
  for (let i = 0; i < fastEMA.length; i++) {
    const slowIndex = i + slowStartIndex;
    if (slowIndex < slowEMA.length) {
      macdLine.push({
        date: fastEMA[i].date,
        value: fastEMA[i].value - slowEMA[slowIndex].value
      });
    }
  }
  
  // Calculate signal line (EMA of MACD line)
  const signalLine = calculateEMA(
    macdLine.map(point => ({
      date: point.date,
      open: point.value,
      high: point.value,
      low: point.value,
      close: point.value,
      volume: 0
    })),
    { period: config.signalPeriod, source: 'close' }
  );
  
  // Calculate final MACD results
  const results: MACDResult[] = [];
  const signalStartIndex = config.signalPeriod - 1;
  
  for (let i = 0; i < signalLine.length; i++) {
    const macdIndex = i + signalStartIndex;
    if (macdIndex < macdLine.length) {
      const macd = macdLine[macdIndex].value;
      const signal = signalLine[i].value;
      const histogram = macd - signal;
      
      // Determine trend
      let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      if (macd > signal && histogram > 0) {
        trend = 'bullish';
      } else if (macd < signal && histogram < 0) {
        trend = 'bearish';
      }
      
      results.push({
        date: signalLine[i].date,
        macd: Number(macd.toFixed(4)),
        signal: Number(signal.toFixed(4)),
        histogram: Number(histogram.toFixed(4)),
        trend
      });
    }
  }
  
  return results;
}

/**
 * Support and Resistance Levels
 * 
 * This algorithm identifies potential support and resistance levels by finding
 * price points where the stock has bounced multiple times.
 * 
 * Why Support/Resistance? These levels often act as psychological barriers
 * where buyers or sellers are likely to enter the market.
 */
export function calculateSupportResistance(
  data: PriceDataPoint[],
  lookbackPeriod: number = 50,
  tolerance: number = 0.02 // 2% tolerance for level identification
): SupportResistanceLevel[] {
  if (data.length < lookbackPeriod) {
    return [];
  }

  const levels: SupportResistanceLevel[] = [];
  const recentData = data.slice(-lookbackPeriod);
  
  // Find local minima and maxima
  for (let i = 1; i < recentData.length - 1; i++) {
    const current = recentData[i];
    const prev = recentData[i - 1];
    const next = recentData[i + 1];
    
    // Check for local minimum (potential support)
    if (current.low < prev.low && current.low < next.low) {
      const level = findOrCreateLevel(levels, current.low, 'support', tolerance);
      level.touches++;
      level.lastTouch = current.date;
    }
    
    // Check for local maximum (potential resistance)
    if (current.high > prev.high && current.high > next.high) {
      const level = findOrCreateLevel(levels, current.high, 'resistance', tolerance);
      level.touches++;
      level.lastTouch = current.date;
    }
  }
  
  // Calculate strength based on touches and recency
  const currentPrice = recentData[recentData.length - 1].close;
  const maxTouches = Math.max(...levels.map(l => l.touches));
  
  levels.forEach(level => {
    const touchStrength = level.touches / maxTouches;
    const recencyStrength = 1 - (Date.now() - level.lastTouch.getTime()) / (30 * 24 * 60 * 60 * 1000); // 30 days
    level.strength = Math.min(1, (touchStrength + recencyStrength) / 2);
  });
  
  // Sort by strength and return top levels
  return levels
    .filter(level => level.strength > 0.3) // Only significant levels
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5); // Top 5 levels
}

/**
 * Helper function to find or create a support/resistance level
 */
function findOrCreateLevel(
  levels: SupportResistanceLevel[],
  price: number,
  type: 'support' | 'resistance',
  tolerance: number
): SupportResistanceLevel {
  // Check if a similar level already exists
  for (const level of levels) {
    if (level.type === type && Math.abs(level.price - price) / price < tolerance) {
      return level;
    }
  }
  
  // Create new level
  const newLevel: SupportResistanceLevel = {
    price,
    strength: 0,
    type,
    touches: 0,
    lastTouch: new Date()
  };
  
  levels.push(newLevel);
  return newLevel;
}

/**
 * Calculate all technical indicators for a given dataset
 */
export function calculateAllIndicators(data: PriceDataPoint[]) {
  return {
    sma20: calculateSMA(data, { period: 20, source: 'close' }),
    sma50: calculateSMA(data, { period: 50, source: 'close' }),
    ema12: calculateEMA(data, { period: 12, source: 'close' }),
    ema26: calculateEMA(data, { period: 26, source: 'close' }),
    rsi: calculateRSI(data),
    macd: calculateMACD(data),
    bollingerBands: calculateBollingerBands(data),
    supportResistance: calculateSupportResistance(data)
  };
}
