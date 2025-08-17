import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names with proper Tailwind CSS conflict resolution
 * Uses clsx for conditional classes and tailwind-merge for deduplication
 * 
 * @param inputs - Class values to merge (strings, objects, arrays, etc.)
 * @returns Merged class string with conflicts resolved
 * 
 * @example
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4" (px-2 is overridden by px-4)
 * cn("text-red-500", { "text-blue-500": isActive }) // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with proper locale and currency symbol
 * 
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'INR')
 * @param locale - Locale for formatting (default: 'en-IN')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage with proper decimal places
 * 
 * @param value - Value to format as percentage
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 * 
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(decimals)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toString();
}

/**
 * Get color class based on value change (positive/negative)
 * 
 * @param change - Change value (positive or negative)
 * @param reverse - Reverse the color logic (default: false)
 * @returns Tailwind CSS color class
 */
export function getChangeColorClass(change: number, reverse: boolean = false): string {
  const isPositive = change > 0;
  const shouldUsePositive = reverse ? !isPositive : isPositive;
  
  return shouldUsePositive 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
}

/**
 * Debounce function to limit function calls
 * 
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

/**
 * Throttle function to limit function calls
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a random ID for components
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Random ID string
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if device is mobile based on screen width
 * 
 * @returns Boolean indicating if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if device is tablet based on screen width
 * 
 * @returns Boolean indicating if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if device is desktop based on screen width
 * 
 * @returns Boolean indicating if device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}
