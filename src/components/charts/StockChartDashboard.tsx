'use client';

import React, { useState, useMemo } from 'react';
import { StockLineChart } from './StockLineChart';
import { CandlestickChart } from './CandlestickChart';
import { VolumeChart } from './VolumeChart';
import { HistoricalData } from '@/types/stock';
import { formatCurrency, formatPercentage, calculateChangePercent } from '@/utils/stock-utils';

interface StockChartDashboardProps {
  data: HistoricalData[];
  symbol: string;
  companyName?: string;
  loading?: boolean;
  error?: string | null;
}

type ChartType = 'line' | 'candlestick' | 'volume' | 'combined';

/**
 * StockChartDashboard Component
 * 
 * WHY this component structure:
 * - Combines multiple chart types in a single dashboard
 * - Provides chart type switching for different analysis needs
 * - Shows key metrics alongside charts for quick insights
 * - Responsive layout that adapts to different screen sizes
 * - Centralized state management for chart interactions
 */
export const StockChartDashboard: React.FC<StockChartDashboardProps> = ({
  data,
  symbol,
  companyName,
  loading = false,
  error = null,
}) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('combined');
  const [showVolume, setShowVolume] = useState(true);

  // Calculate key metrics from the data
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const latest = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];
    const first = sortedData[0];

    const currentPrice = Number(latest.close);
    const previousPrice = previous ? Number(previous.close) : currentPrice;
    const openPrice = Number(latest.open);
    const dayChange = currentPrice - openPrice;
    const dayChangePercent = ((dayChange / openPrice) * 100);
    const periodChange = currentPrice - Number(first.close);
    const periodChangePercent = ((periodChange / Number(first.close)) * 100);

    const high = Math.max(...sortedData.map(d => Number(d.high)));
    const low = Math.min(...sortedData.map(d => Number(d.low)));
    const avgVolume = sortedData.reduce((sum, d) => sum + Number(d.volume), 0) / sortedData.length;

    return {
      currentPrice,
      previousPrice,
      dayChange,
      dayChangePercent,
      periodChange,
      periodChangePercent,
      high,
      low,
      avgVolume,
      openPrice,
    };
  }, [data]);

  // Chart type options
  const chartTypes: { value: ChartType; label: string; description: string }[] = [
    {
      value: 'combined',
      label: 'Combined View',
      description: 'Price and volume charts together',
    },
    {
      value: 'line',
      label: 'Line Chart',
      description: 'Simple price trend visualization',
    },
    {
      value: 'candlestick',
      label: 'Candlestick',
      description: 'Detailed OHLCV analysis',
    },
    {
      value: 'volume',
      label: 'Volume',
      description: 'Trading volume patterns',
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading stock charts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Chart Error
            </h3>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty data state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500">
              No chart data available for {symbol}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header with company info and metrics */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {symbol}
            </h2>
            {companyName && (
              <p className="text-gray-600">{companyName}</p>
            )}
          </div>

          {/* Key Metrics */}
          {metrics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(metrics.currentPrice)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Day Change</p>
                <p className={`text-lg font-semibold ${
                  metrics.dayChange >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {metrics.dayChange >= 0 ? '+' : ''}{formatCurrency(metrics.dayChange)}
                  <span className="text-sm ml-1">
                    ({metrics.dayChangePercent >= 0 ? '+' : ''}{formatPercentage(metrics.dayChangePercent)})
                  </span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Period Change</p>
                <p className={`text-lg font-semibold ${
                  metrics.periodChange >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {metrics.periodChange >= 0 ? '+' : ''}{formatCurrency(metrics.periodChange)}
                  <span className="text-sm ml-1">
                    ({metrics.periodChangePercent >= 0 ? '+' : ''}{formatPercentage(metrics.periodChangePercent)})
                  </span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Range</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(metrics.low)} - {formatCurrency(metrics.high)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Controls */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Chart Type Selector */}
          <div className="flex flex-wrap gap-2">
            {chartTypes.map((chartType) => (
              <button
                key={chartType.value}
                onClick={() => setSelectedChartType(chartType.value)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedChartType === chartType.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title={chartType.description}
              >
                {chartType.label}
              </button>
            ))}
          </div>

          {/* Volume Toggle */}
          {selectedChartType === 'combined' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">
                Show Volume:
              </label>
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showVolume ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showVolume ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="p-4">
        {selectedChartType === 'line' && (
          <StockLineChart
            data={data}
            title={`${symbol} Price Chart`}
            height={400}
          />
        )}

        {selectedChartType === 'candlestick' && (
          <CandlestickChart
            data={data}
            title={`${symbol} OHLCV Chart`}
            height={500}
            showVolume={showVolume}
          />
        )}

        {selectedChartType === 'volume' && (
          <VolumeChart
            data={data}
            title={`${symbol} Volume Chart`}
            height={400}
            showPriceOverlay={true}
          />
        )}

        {selectedChartType === 'combined' && (
          <div className="space-y-6">
            {/* Main Price Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Price Chart
              </h3>
              <StockLineChart
                data={data}
                title=""
                height={300}
                showLegend={false}
              />
            </div>

            {/* Volume Chart */}
            {showVolume && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Trading Volume
                </h3>
                <VolumeChart
                  data={data}
                  title=""
                  height={200}
                  showPriceOverlay={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
