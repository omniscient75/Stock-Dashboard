// Stock Market Utility Functions
// This file contains helper functions for formatting and calculating stock data

import { StockSummary, HistoricalData } from '@/types/stock';

/**
 * Format currency values with proper symbols and decimal places
 * WHY: Consistent currency formatting across the application
 */
export const formatCurrency = (value: number, currency: string = 'INR'): string => {
  if (isNaN(value)) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage values with proper decimal places
 * WHY: Consistent percentage display for changes and yields
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (isNaN(value)) return '0.00%';
  
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 * WHY: Readable display of large numbers like market cap and volume
 */
export const formatLargeNumber = (value: number): string => {
  if (isNaN(value)) return '0';
  
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  
  return value.toLocaleString();
};

/**
 * Format volume with appropriate units
 * WHY: Consistent volume display across charts and tables
 */
export const formatVolume = (volume: number): string => {
  if (isNaN(volume)) return '0';
  
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  
  return volume.toLocaleString();
};

/**
 * Calculate percentage change between two values
 * WHY: Standard formula for calculating price changes
 */
export const calculateChangePercent = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Check if a change is positive (gain) or negative (loss)
 * WHY: Determine color coding for UI elements
 */
export const isPositiveChange = (change: number): boolean => {
  return change >= 0;
};

/**
 * Convert StockData to StockSummary for simplified display
 * WHY: Reusable function for creating summary objects
 */
export const toStockSummary = (stock: any): StockSummary => {
  return {
    symbol: stock.symbol,
    companyName: stock.companyName,
    currentPrice: stock.currentPrice,
    change: stock.change,
    changePercent: stock.changePercent,
    isPositive: isPositiveChange(stock.change),
  };
};

/**
 * Format date strings for display
 * WHY: Consistent date formatting across the application
 */
export const formatDate = (dateString: string, format: string = 'short'): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-IN');
    case 'long':
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return date.toLocaleTimeString('en-IN');
    default:
      return date.toLocaleDateString('en-IN');
  }
};

/**
 * Get CSS class for change colors (profit/loss)
 * WHY: Consistent color coding for financial data
 */
export const getChangeColorClass = (change: number): string => {
  if (change > 0) return 'text-profit';
  if (change < 0) return 'text-loss';
  return 'text-neutral';
};

/**
 * Validate stock symbol format
 * WHY: Ensure proper symbol format before API calls
 */
export const isValidStockSymbol = (symbol: string): boolean => {
  // Basic validation for stock symbols
  const symbolRegex = /^[A-Z]{1,5}$/;
  return symbolRegex.test(symbol);
};

/**
 * Delay execution for specified milliseconds
 * WHY: Simulate API delays in development
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce function to limit API calls
 * WHY: Prevent excessive API calls during rapid user input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Calculate moving average for technical analysis
 * WHY: Common technical indicator for trend analysis
 */
export const calculateMovingAverage = (data: number[], period: number): number[] => {
  if (data.length < period) return [];
  
  const result: number[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  
  return result;
};

/**
 * Calculate volatility (standard deviation of returns)
 * WHY: Measure of price volatility for risk assessment
 */
export const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0;
  
  // Calculate returns
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  // Calculate mean return
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  
  // Calculate variance
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
  
  // Return standard deviation (volatility)
  return Math.sqrt(variance);
};

/**
 * Get color for volatility level
 * WHY: Visual indication of risk levels
 */
export const getVolatilityColor = (volatility: number): string => {
  if (volatility < 0.02) return 'text-green-600'; // Low volatility
  if (volatility < 0.05) return 'text-yellow-600'; // Medium volatility
  return 'text-red-600'; // High volatility
};
