import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatPercentage, getChangeColorClass } from '@/lib/utils';

// Stock price data interface
interface StockPriceData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high?: number;
  low?: number;
  open?: number;
}

// Stock price card props
interface StockPriceCardProps {
  data: StockPriceData;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  onClick?: () => void;
}

// Arrow icon component for price changes
const PriceArrow = ({ change }: { change: number }) => {
  if (change === 0) {
    return (
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  }
  
  return change > 0 ? (
    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
};

// Main stock price card component
export const StockPriceCard: React.FC<StockPriceCardProps> = ({
  data,
  variant = 'default',
  className,
  onClick,
}) => {
  const isPositive = data.change >= 0;
  const changeColorClass = getChangeColorClass(data.change);

  // Compact variant for smaller displays
  if (variant === 'compact') {
    return (
      <Card 
        className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {data.symbol}
                </h3>
                <PriceArrow change={data.change} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {data.name}
              </p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data.price)}
              </div>
              <div className={`text-sm font-medium ${changeColorClass}`}>
                {isPositive ? '+' : ''}{formatCurrency(data.change)} ({formatPercentage(data.changePercent)})
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant with more information
  if (variant === 'detailed') {
    return (
      <Card 
        className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${className}`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                {data.symbol}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.name}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <PriceArrow change={data.change} />
              <span className={`text-sm font-medium ${changeColorClass}`}>
                {formatPercentage(data.changePercent)}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main price display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.price)}
            </div>
            <div className={`text-lg font-medium ${changeColorClass}`}>
              {isPositive ? '+' : ''}{formatCurrency(data.change)}
            </div>
          </div>

          {/* Additional metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Volume</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {data.volume.toLocaleString()}
              </p>
            </div>
            {data.marketCap && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Market Cap</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(data.marketCap, 'INR', 'en-IN')}
                </p>
              </div>
            )}
            {data.high && data.low && (
              <>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">High</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(data.high)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Low</p>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(data.low)}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.symbol}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {data.name}
            </p>
          </div>
          <PriceArrow change={data.change} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.price)}
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${changeColorClass}`}>
              {isPositive ? '+' : ''}{formatCurrency(data.change)}
            </div>
            <div className={`text-sm font-medium ${changeColorClass}`}>
              {formatPercentage(data.changePercent)}
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Vol: {data.volume.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading skeleton for stock price card
export const StockPriceCardSkeleton = ({ variant = 'default' }: { variant?: 'default' | 'compact' | 'detailed' }) => {
  if (variant === 'compact') {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </CardContent>
    </Card>
  );
};
