// Stock Market Data Types
// This file defines all TypeScript interfaces for stock market data

export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
  dividendYield?: number;
  sector?: string;
  industry?: string;
  exchange: Exchange;
  isPositive: boolean;
}

export interface StockSummary {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}

export interface OHLCVData extends HistoricalData {
  change: number;
  changePercent: number;
  range: number;
  rangePercent: number;
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
}

export interface WatchlistItem {
  symbol: string;
  companyName: string;
  currentPrice: number;
  targetPrice?: number;
  notes?: string;
  addedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MarketData {
  indices: {
    nifty50: {
      value: number;
      change: number;
      changePercent: number;
    };
    sensex: {
      value: number;
      change: number;
      changePercent: number;
    };
    bankNifty: {
      value: number;
      change: number;
      changePercent: number;
    };
  };
  topGainers: StockSummary[];
  topLosers: StockSummary[];
  mostActive: StockSummary[];
}

export interface MarketScenario {
  name: string;
  description: string;
  volatility: number; // 0.1 to 2.0
  trend: number; // -1.0 to 1.0 (negative = bearish, positive = bullish)
  volumeMultiplier: number; // 0.5 to 3.0
  startDate?: string;
  endDate?: string;
}

export interface IndianCompany {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number; // in crores
  peRatio: number;
  dividendYield: number;
  exchange: Exchange;
  basePrice: number;
  volatility: number;
  avgVolume: number;
  description: string;
}

export interface ValidationRules {
  minPrice: number;
  maxPrice: number;
  minVolume: number;
  maxVolume: number;
  maxDailyChange: number; // percentage
  maxGap: number; // percentage
}

export interface MockDataOptions {
  companies?: string[];
  days?: number;
  scenario?: string;
  startDate?: string;
  endDate?: string;
  validationRules?: ValidationRules;
}

// Utility types
export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';
export type Exchange = 'NSE' | 'BSE' | 'NYSE' | 'NASDAQ';
