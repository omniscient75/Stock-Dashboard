// Utility functions for stock data formatting and calculations
// These functions help maintain consistency across the application

import { StockData, StockSummary } from '@/types/stock';

/**
 * Formats a number as currency with proper locale
 * @param value - The number to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number as a percentage
 * @param value - The decimal value (e.g., 0.05 for 5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats large numbers with K, M, B suffixes
 * @param value - The number to format
 * @returns Formatted number string
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(1)}T`;
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Formats volume with proper suffixes
 * @param volume - Trading volume
 * @returns Formatted volume string
 */
export function formatVolume(volume: number): string {
  return formatLargeNumber(volume);
}

/**
 * Calculates the change percentage between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change as decimal
 */
export function calculateChangePercent(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous);
}

/**
 * Determines if a change is positive (for styling)
 * @param change - The change value
 * @returns True if positive, false if negative
 */
export function isPositiveChange(change: number): boolean {
  return change >= 0;
}

/**
 * Converts StockData to StockSummary for simplified displays
 * @param stockData - Full stock data
 * @returns Simplified stock summary
 */
export function toStockSummary(stockData: StockData): StockSummary {
  return {
    symbol: stockData.symbol,
    companyName: stockData.companyName,
    currentPrice: stockData.currentPrice,
    change: stockData.change,
    changePercent: stockData.changePercent,
    isPositive: isPositiveChange(stockData.change),
  };
}

/**
 * Formats a date for display
 * @param date - Date to format
 * @param includeTime - Whether to include time (default: false)
 * @returns Formatted date string
 */
export function formatDate(date: Date, includeTime: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Gets the appropriate color class for price changes
 * @param change - The price change
 * @returns Tailwind CSS class for text color
 */
export function getChangeColorClass(change: number): string {
  if (change > 0) return 'text-profit';
  if (change < 0) return 'text-loss';
  return 'text-neutral';
}

/**
 * Validates a stock symbol format
 * @param symbol - Stock symbol to validate
 * @returns True if valid format
 */
export function isValidStockSymbol(symbol: string): boolean {
  // Basic validation: 1-5 uppercase letters
  return /^[A-Z]{1,5}$/.test(symbol);
}

/**
 * Delays execution for a specified time (useful for API rate limiting)
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounces a function to limit how often it can be called
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
