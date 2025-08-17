/**
 * Technical Indicators Types
 * 
 * This module defines TypeScript interfaces for technical analysis indicators.
 * Each indicator has specific data structures for inputs, outputs, and configuration.
 */

// Base data point interface for price data
export interface PriceDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Moving Average Types
export interface MovingAverageConfig {
  period: number; // Number of periods to calculate
  source: 'close' | 'open' | 'high' | 'low' | 'volume'; // Price source to use
}

export interface MovingAverageResult {
  date: Date;
  value: number;
  period: number;
}

// RSI Configuration and Results
export interface RSIConfig {
  period: number; // Default 14
  overbought: number; // Default 70
  oversold: number; // Default 30
}

export interface RSIResult {
  date: Date;
  value: number;
  signal: 'overbought' | 'oversold' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
}

// Bollinger Bands Configuration and Results
export interface BollingerBandsConfig {
  period: number; // Default 20
  standardDeviations: number; // Default 2
  source: 'close' | 'open' | 'high' | 'low';
}

export interface BollingerBandsResult {
  date: Date;
  upper: number;
  middle: number; // SMA
  lower: number;
  bandwidth: number; // (Upper - Lower) / Middle
  percentB: number; // (Price - Lower) / (Upper - Lower)
}

// MACD Configuration and Results
export interface MACDConfig {
  fastPeriod: number; // Default 12
  slowPeriod: number; // Default 26
  signalPeriod: number; // Default 9
}

export interface MACDResult {
  date: Date;
  macd: number; // MACD line
  signal: number; // Signal line
  histogram: number; // MACD - Signal
  trend: 'bullish' | 'bearish' | 'neutral';
}

// Support and Resistance Levels
export interface SupportResistanceLevel {
  price: number;
  strength: number; // 0-1, how strong the level is
  type: 'support' | 'resistance';
  touches: number; // Number of times price touched this level
  lastTouch: Date;
}

export interface SupportResistanceResult {
  date: Date;
  support: SupportResistanceLevel[];
  resistance: SupportResistanceLevel[];
  currentPrice: number;
}

// Prediction Models
export interface PredictionConfig {
  horizon: number; // Days to predict ahead
  confidence: number; // Confidence level (0-1)
  algorithm: 'linear' | 'polynomial' | 'lstm' | 'ensemble';
}

export interface PricePrediction {
  date: Date;
  predictedPrice: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
  algorithm: string;
}

// Trading Signals
export interface TradingSignal {
  date: Date;
  type: 'buy' | 'sell' | 'hold';
  strength: 'strong' | 'moderate' | 'weak';
  indicators: {
    rsi?: RSIResult;
    macd?: MACDResult;
    bollinger?: BollingerBandsResult;
    movingAverages?: MovingAverageResult[];
  };
  reasoning: string[];
  confidence: number;
}

// Backtesting Results
export interface BacktestResult {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  trades: {
    date: Date;
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    pnl: number;
  }[];
}

// Alert Configuration
export interface AlertConfig {
  indicator: 'rsi' | 'macd' | 'bollinger' | 'moving_average';
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below';
  value: number;
  enabled: boolean;
}

export interface Alert {
  id: string;
  date: Date;
  symbol: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  triggered: boolean;
}

// Combined Technical Analysis Result
export interface TechnicalAnalysis {
  symbol: string;
  date: Date;
  price: PriceDataPoint;
  indicators: {
    sma?: MovingAverageResult[];
    ema?: MovingAverageResult[];
    rsi?: RSIResult;
    macd?: MACDResult;
    bollingerBands?: BollingerBandsResult;
    supportResistance?: SupportResistanceResult;
  };
  prediction?: PricePrediction;
  signal?: TradingSignal;
  alerts?: Alert[];
}
