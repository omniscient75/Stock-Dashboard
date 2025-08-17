// Enhanced stock data interfaces for Indian markets
// These interfaces define the structure of stock data with Indian market specifics

export interface StockData {
  symbol: string;           // Stock symbol (e.g., "RELIANCE", "TCS")
  companyName: string;      // Full company name
  currentPrice: number;     // Current stock price
  previousClose: number;    // Previous day's closing price
  change: number;           // Price change from previous close
  changePercent: number;    // Percentage change from previous close
  volume: number;           // Trading volume
  marketCap: number;        // Market capitalization
  peRatio?: number;         // Price-to-Earnings ratio (optional)
  dividendYield?: number;   // Dividend yield percentage (optional)
  high52Week: number;       // 52-week high
  low52Week: number;        // 52-week low
  sector?: string;          // Company sector (optional)
  industry?: string;        // Company industry (optional)
  exchange?: string;        // NSE or BSE
  lastUpdated: Date;        // When the data was last updated
}

// Simplified stock data for quick displays
export interface StockSummary {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  isPositive: boolean;      // Helper boolean for styling
}

// Historical price data for charts (OHLCV)
export interface HistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;   // Adjusted for splits/dividends
}

// Enhanced OHLCV data with validation
export interface OHLCVData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
  
  // Calculated fields
  change?: number;          // Close - Previous Close
  changePercent?: number;   // (Change / Previous Close) * 100
  range?: number;           // High - Low
  rangePercent?: number;    // (Range / Open) * 100
}

// Market scenario configuration
export interface MarketScenario {
  name: string;
  description: string;
  volatility: number;       // Daily volatility (0.01 = 1%)
  trend: number;           // Daily trend (-0.02 = -2% daily decline)
  volumeMultiplier: number; // Volume multiplier
  startDate: Date;
  endDate: Date;
}

// Indian company data structure
export interface IndianCompany {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;        // In crores (1 crore = 10 million)
  peRatio?: number;
  dividendYield?: number;
  exchange: 'NSE' | 'BSE' | 'BOTH';
  basePrice: number;        // Starting price for mock data
  volatility: number;       // Historical volatility
  avgVolume: number;        // Average daily volume
  description: string;
}

// Portfolio position interface
export interface PortfolioPosition {
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

// Watchlist interface
export interface WatchlistItem {
  symbol: string;
  addedAt: Date;
  targetPrice?: number;     // Optional target price for alerts
  notes?: string;           // Optional notes
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Market data interface
export interface MarketData {
  isOpen: boolean;
  lastUpdated: Date;
  indices: {
    nifty50: { value: number; change: number; changePercent: number };
    sensex: { value: number; change: number; changePercent: number };
    bankNifty: { value: number; change: number; changePercent: number };
  };
}

// Utility types for better type safety
export type StockSymbol = string;
export type Currency = 'INR' | 'USD' | 'EUR';
export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
export type Exchange = 'NSE' | 'BSE';

// Chart configuration interface
export interface ChartConfig {
  timeframe: Timeframe;
  showVolume: boolean;
  showMA: boolean;          // Moving averages
  showBollingerBands: boolean;
}

// Data validation rules
export interface ValidationRules {
  minPrice: number;
  maxPrice: number;
  minVolume: number;
  maxVolume: number;
  maxDailyChange: number;   // Maximum daily change percentage
  maxGap: number;           // Maximum gap between days
}

// Mock data generation options
export interface MockDataOptions {
  startDate: Date;
  endDate: Date;
  scenario?: MarketScenario;
  validationRules?: ValidationRules;
  includeWeekends?: boolean;
  randomSeed?: number;
}
