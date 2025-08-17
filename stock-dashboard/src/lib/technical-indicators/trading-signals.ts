/**
 * Trading Signals Generator
 * 
 * This module combines multiple technical indicators to generate trading signals.
 * It uses a scoring system to determine buy/sell/hold recommendations with confidence levels.
 */

import {
  PriceDataPoint,
  TradingSignal,
  RSIResult,
  MACDResult,
  BollingerBandsResult,
  MovingAverageResult,
  SupportResistanceLevel
} from './types';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateSupportResistance
} from './calculators';

/**
 * Signal Strength Configuration
 * 
 * Defines weights for different indicators in the signal generation process.
 * Higher weights mean the indicator has more influence on the final signal.
 */
export interface SignalConfig {
  rsiWeight: number; // Default 0.25
  macdWeight: number; // Default 0.25
  bollingerWeight: number; // Default 0.20
  movingAverageWeight: number; // Default 0.20
  supportResistanceWeight: number; // Default 0.10
  volumeWeight: number; // Default 0.10
}

/**
 * Generate comprehensive trading signal based on multiple indicators
 */
export function generateTradingSignal(
  data: PriceDataPoint[],
  config: SignalConfig = {
    rsiWeight: 0.25,
    macdWeight: 0.25,
    bollingerWeight: 0.20,
    movingAverageWeight: 0.20,
    supportResistanceWeight: 0.10,
    volumeWeight: 0.10
  }
): TradingSignal {
  if (data.length < 50) {
    throw new Error('Insufficient data for signal generation');
  }

  const currentPrice = data[data.length - 1].close;
  const currentDate = data[data.length - 1].date;
  
  // Calculate all indicators
  const indicators = {
    rsi: calculateRSI(data),
    macd: calculateMACD(data),
    bollinger: calculateBollingerBands(data),
    sma20: calculateSMA(data, { period: 20, source: 'close' }),
    sma50: calculateSMA(data, { period: 50, source: 'close' }),
    ema12: calculateEMA(data, { period: 12, source: 'close' }),
    ema26: calculateEMA(data, { period: 26, source: 'close' }),
    supportResistance: calculateSupportResistance(data)
  };

  // Get latest indicator values
  const latestRSI = indicators.rsi[indicators.rsi.length - 1];
  const latestMACD = indicators.macd[indicators.macd.length - 1];
  const latestBollinger = indicators.bollinger[indicators.bollinger.length - 1];
  const latestSMA20 = indicators.sma20[indicators.sma20.length - 1];
  const latestSMA50 = indicators.sma50[indicators.sma50.length - 1];
  const latestEMA12 = indicators.ema12[indicators.ema12.length - 1];
  const latestEMA26 = indicators.ema26[indicators.ema26.length - 1];

  // Calculate individual signal scores
  const scores = {
    rsi: calculateRSIScore(latestRSI),
    macd: calculateMACDScore(latestMACD),
    bollinger: calculateBollingerScore(latestBollinger, currentPrice),
    movingAverage: calculateMovingAverageScore(latestSMA20, latestSMA50, latestEMA12, latestEMA26, currentPrice),
    supportResistance: calculateSupportResistanceScore(indicators.supportResistance, currentPrice),
    volume: calculateVolumeScore(data)
  };

  // Calculate weighted signal score
  const weightedScore = 
    scores.rsi * config.rsiWeight +
    scores.macd * config.macdWeight +
    scores.bollinger * config.bollingerWeight +
    scores.movingAverage * config.movingAverageWeight +
    scores.supportResistance * config.supportResistanceWeight +
    scores.volume * config.volumeWeight;

  // Determine signal type and strength
  const signal = determineSignalType(weightedScore);
  const strength = determineSignalStrength(Math.abs(weightedScore));
  const confidence = Math.min(1, Math.abs(weightedScore));

  // Generate reasoning
  const reasoning = generateReasoning(scores, indicators, currentPrice);

  return {
    date: currentDate,
    type: signal,
    strength,
    confidence: Number(confidence.toFixed(3)),
    indicators: {
      rsi: latestRSI,
      macd: latestMACD,
      bollinger: latestBollinger,
      movingAverages: [latestSMA20, latestSMA50, latestEMA12, latestEMA26]
    },
    reasoning
  };
}

/**
 * Calculate RSI signal score (-1 to 1)
 * Negative = bearish, Positive = bullish
 */
function calculateRSIScore(rsi: RSIResult): number {
  if (rsi.signal === 'overbought') {
    return -0.8; // Bearish signal
  } else if (rsi.signal === 'oversold') {
    return 0.8; // Bullish signal
  } else {
    // Neutral RSI - slight bias based on position
    return (rsi.value - 50) / 50 * 0.3;
  }
}

/**
 * Calculate MACD signal score (-1 to 1)
 */
function calculateMACDScore(macd: MACDResult): number {
  if (macd.trend === 'bullish') {
    return 0.7;
  } else if (macd.trend === 'bearish') {
    return -0.7;
  } else {
    // Neutral - slight bias based on histogram
    return Math.sign(macd.histogram) * Math.min(0.3, Math.abs(macd.histogram) / 10);
  }
}

/**
 * Calculate Bollinger Bands signal score (-1 to 1)
 */
function calculateBollingerScore(bollinger: BollingerBandsResult, currentPrice: number): number {
  const { upper, lower, percentB } = bollinger;
  
  if (currentPrice > upper) {
    return -0.6; // Price above upper band - potential reversal
  } else if (currentPrice < lower) {
    return 0.6; // Price below lower band - potential reversal
  } else {
    // Price within bands - slight bias based on position
    return (percentB - 0.5) * 0.4;
  }
}

/**
 * Calculate Moving Average signal score (-1 to 1)
 */
function calculateMovingAverageScore(
  sma20: MovingAverageResult,
  sma50: MovingAverageResult,
  ema12: MovingAverageResult,
  ema26: MovingAverageResult,
  currentPrice: number
): number {
  let score = 0;
  
  // SMA crossover
  if (sma20.value > sma50.value) {
    score += 0.3; // Bullish
  } else {
    score -= 0.3; // Bearish
  }
  
  // EMA crossover
  if (ema12.value > ema26.value) {
    score += 0.3; // Bullish
  } else {
    score -= 0.3; // Bearish
  }
  
  // Price vs SMA20
  if (currentPrice > sma20.value) {
    score += 0.2; // Bullish
  } else {
    score -= 0.2; // Bearish
  }
  
  return Math.max(-1, Math.min(1, score));
}

/**
 * Calculate Support/Resistance signal score (-1 to 1)
 */
function calculateSupportResistanceScore(
  levels: SupportResistanceLevel[],
  currentPrice: number
): number {
  let score = 0;
  
  for (const level of levels) {
    const distance = Math.abs(currentPrice - level.price) / currentPrice;
    
    if (distance < 0.02) { // Within 2% of level
      if (level.type === 'support' && currentPrice > level.price) {
        score += 0.4 * level.strength; // Bouncing off support
      } else if (level.type === 'resistance' && currentPrice < level.price) {
        score -= 0.4 * level.strength; // Hitting resistance
      }
    }
  }
  
  return Math.max(-1, Math.min(1, score));
}

/**
 * Calculate Volume signal score (-1 to 1)
 */
function calculateVolumeScore(data: PriceDataPoint[]): number {
  if (data.length < 20) return 0;
  
  const recentVolume = data.slice(-5).map(d => d.volume);
  const avgVolume = recentVolume.reduce((sum, v) => sum + v, 0) / recentVolume.length;
  const currentVolume = data[data.length - 1].volume;
  
  // Volume spike analysis
  const volumeRatio = currentVolume / avgVolume;
  
  if (volumeRatio > 1.5) {
    // High volume - check if it's bullish or bearish
    const priceChange = data[data.length - 1].close - data[data.length - 2].close;
    return Math.sign(priceChange) * 0.3;
  } else if (volumeRatio < 0.7) {
    // Low volume - neutral to slightly bearish
    return -0.1;
  }
  
  return 0;
}

/**
 * Determine signal type based on weighted score
 */
function determineSignalType(score: number): 'buy' | 'sell' | 'hold' {
  if (score > 0.3) {
    return 'buy';
  } else if (score < -0.3) {
    return 'sell';
  } else {
    return 'hold';
  }
}

/**
 * Determine signal strength based on absolute score
 */
function determineSignalStrength(absoluteScore: number): 'strong' | 'moderate' | 'weak' {
  if (absoluteScore > 0.6) {
    return 'strong';
  } else if (absoluteScore > 0.3) {
    return 'moderate';
  } else {
    return 'weak';
  }
}

/**
 * Generate reasoning for the trading signal
 */
function generateReasoning(
  scores: Record<string, number>,
  indicators: any,
  currentPrice: number
): string[] {
  const reasoning: string[] = [];
  
  // RSI reasoning
  if (Math.abs(scores.rsi) > 0.5) {
    const rsi = indicators.rsi[indicators.rsi.length - 1];
    if (rsi.signal === 'overbought') {
      reasoning.push(`RSI is overbought (${rsi.value.toFixed(1)}) - potential reversal`);
    } else if (rsi.signal === 'oversold') {
      reasoning.push(`RSI is oversold (${rsi.value.toFixed(1)}) - potential bounce`);
    }
  }
  
  // MACD reasoning
  if (Math.abs(scores.macd) > 0.5) {
    const macd = indicators.macd[indicators.macd.length - 1];
    if (macd.trend === 'bullish') {
      reasoning.push(`MACD shows bullish momentum (${macd.histogram.toFixed(3)})`);
    } else if (macd.trend === 'bearish') {
      reasoning.push(`MACD shows bearish momentum (${macd.histogram.toFixed(3)})`);
    }
  }
  
  // Moving Average reasoning
  if (Math.abs(scores.movingAverage) > 0.3) {
    const sma20 = indicators.sma20[indicators.sma20.length - 1];
    const sma50 = indicators.sma50[indicators.sma50.length - 1];
    
    if (sma20.value > sma50.value) {
      reasoning.push(`Short-term MA (${sma20.value.toFixed(2)}) above long-term MA (${sma50.value.toFixed(2)})`);
    } else {
      reasoning.push(`Short-term MA (${sma20.value.toFixed(2)}) below long-term MA (${sma50.value.toFixed(2)})`);
    }
  }
  
  // Bollinger Bands reasoning
  if (Math.abs(scores.bollinger) > 0.4) {
    const bb = indicators.bollinger[indicators.bollinger.length - 1];
    if (currentPrice > bb.upper) {
      reasoning.push(`Price above upper Bollinger Band - potential reversal`);
    } else if (currentPrice < bb.lower) {
      reasoning.push(`Price below lower Bollinger Band - potential bounce`);
    }
  }
  
  // Support/Resistance reasoning
  if (Math.abs(scores.supportResistance) > 0.2) {
    reasoning.push(`Price near significant support/resistance level`);
  }
  
  // Volume reasoning
  if (Math.abs(scores.volume) > 0.2) {
    if (scores.volume > 0) {
      reasoning.push(`High volume confirms bullish momentum`);
    } else {
      reasoning.push(`High volume confirms bearish momentum`);
    }
  }
  
  return reasoning;
}

/**
 * Generate multiple signals for different timeframes
 */
export function generateMultiTimeframeSignals(data: PriceDataPoint[]): {
  shortTerm: TradingSignal;
  mediumTerm: TradingSignal;
  longTerm: TradingSignal;
} {
  // Short-term signal (more weight to RSI and MACD)
  const shortTermConfig: SignalConfig = {
    rsiWeight: 0.35,
    macdWeight: 0.35,
    bollingerWeight: 0.20,
    movingAverageWeight: 0.10,
    supportResistanceWeight: 0.05,
    volumeWeight: 0.15
  };
  
  // Medium-term signal (balanced weights)
  const mediumTermConfig: SignalConfig = {
    rsiWeight: 0.25,
    macdWeight: 0.25,
    bollingerWeight: 0.20,
    movingAverageWeight: 0.20,
    supportResistanceWeight: 0.10,
    volumeWeight: 0.10
  };
  
  // Long-term signal (more weight to moving averages)
  const longTermConfig: SignalConfig = {
    rsiWeight: 0.15,
    macdWeight: 0.15,
    bollingerWeight: 0.20,
    movingAverageWeight: 0.35,
    supportResistanceWeight: 0.15,
    volumeWeight: 0.05
  };
  
  return {
    shortTerm: generateTradingSignal(data, shortTermConfig),
    mediumTerm: generateTradingSignal(data, mediumTermConfig),
    longTerm: generateTradingSignal(data, longTermConfig)
  };
}

/**
 * Generate alert conditions based on signal
 */
export function generateSignalAlerts(signal: TradingSignal): string[] {
  const alerts: string[] = [];
  
  if (signal.type === 'buy' && signal.strength === 'strong') {
    alerts.push('Strong buy signal detected');
  } else if (signal.type === 'sell' && signal.strength === 'strong') {
    alerts.push('Strong sell signal detected');
  }
  
  if (signal.confidence > 0.8) {
    alerts.push('High confidence signal');
  }
  
  // Check for divergences
  if (signal.indicators.rsi && signal.indicators.macd) {
    const rsi = signal.indicators.rsi;
    const macd = signal.indicators.macd;
    
    if ((rsi.signal === 'overbought' && macd.trend === 'bullish') ||
        (rsi.signal === 'oversold' && macd.trend === 'bearish')) {
      alerts.push('Potential indicator divergence detected');
    }
  }
  
  return alerts;
}
