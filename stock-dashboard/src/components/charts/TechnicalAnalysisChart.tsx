/**
 * Technical Analysis Chart Component
 * 
 * A comprehensive chart that displays price data with multiple technical indicators.
 * Includes candlestick chart, moving averages, RSI, MACD, and Bollinger Bands.
 */

'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { PriceDataPoint, MovingAverageResult, RSIResult, MACDResult, BollingerBandsResult } from '../../lib/technical-indicators/types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface TechnicalAnalysisChartProps {
  data: PriceDataPoint[];
  sma20?: MovingAverageResult[];
  sma50?: MovingAverageResult[];
  ema12?: MovingAverageResult[];
  ema26?: MovingAverageResult[];
  rsi?: RSIResult[];
  macd?: MACDResult[];
  bollingerBands?: BollingerBandsResult[];
  showVolume?: boolean;
  showRSI?: boolean;
  showMACD?: boolean;
  showBollingerBands?: boolean;
  showMovingAverages?: boolean;
  height?: number;
  className?: string;
}

export default function TechnicalAnalysisChart({
  data,
  sma20,
  sma50,
  ema12,
  ema26,
  rsi,
  macd,
  bollingerBands,
  showVolume = true,
  showRSI = true,
  showMACD = true,
  showBollingerBands = true,
  showMovingAverages = true,
  height = 600,
  className = ''
}: TechnicalAnalysisChartProps) {
  const [activeTab, setActiveTab] = useState<'price' | 'rsi' | 'macd'>('price');
  const chartRef = useRef<any>(null);

  // Prepare data for charts
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const labels = data.map(d => d.date);
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);

    // Price chart data
    const priceData = {
      labels,
      datasets: [
        {
          label: 'Price',
          data: prices,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: false,
          yAxisID: 'y'
        }
      ]
    };

    // Add moving averages
    if (showMovingAverages && sma20) {
      priceData.datasets.push({
        label: 'SMA 20',
        data: sma20.map(d => d.value),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 1,
        fill: false,
        yAxisID: 'y'
      });
    }

    if (showMovingAverages && sma50) {
      priceData.datasets.push({
        label: 'SMA 50',
        data: sma50.map(d => d.value),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        fill: false,
        yAxisID: 'y'
      });
    }

    if (showMovingAverages && ema12) {
      priceData.datasets.push({
        label: 'EMA 12',
        data: ema12.map(d => d.value),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 1,
        fill: false,
        yAxisID: 'y'
      });
    }

    if (showMovingAverages && ema26) {
      priceData.datasets.push({
        label: 'EMA 26',
        data: ema26.map(d => d.value),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1,
        fill: false,
        yAxisID: 'y'
      });
    }

    // Add Bollinger Bands
    if (showBollingerBands && bollingerBands) {
      priceData.datasets.push({
        label: 'Upper Band',
        data: bollingerBands.map(d => d.upper),
        borderColor: 'rgba(156, 163, 175, 0.5)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 1,
        fill: false,
        yAxisID: 'y'
      });

      priceData.datasets.push({
        label: 'Middle Band',
        data: bollingerBands.map(d => d.middle),
        borderColor: 'rgba(156, 163, 175, 0.8)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 1,
        fill: false,
        yAxisID: 'y'
      });

      priceData.datasets.push({
        label: 'Lower Band',
        data: bollingerBands.map(d => d.lower),
        borderColor: 'rgba(156, 163, 175, 0.5)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 1,
        fill: false,
        yAxisID: 'y'
      });
    }

    // Volume data
    const volumeData = {
      labels,
      datasets: [
        {
          label: 'Volume',
          data: volumes,
                     backgroundColor: volumes.map((_, i) => {
             if (i === 0) return 'rgba(156, 163, 175, 0.5)';
             return data[i]?.close >= data[i - 1]?.close 
               ? 'rgba(34, 197, 94, 0.5)' 
               : 'rgba(239, 68, 68, 0.5)';
           }),
          borderColor: 'rgba(156, 163, 175, 0.8)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };

    // RSI data
    const rsiData = rsi ? {
      labels,
      datasets: [
        {
          label: 'RSI',
          data: rsi.map(d => d.value),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'Overbought (70)',
          data: new Array(labels.length).fill(70),
          borderColor: 'rgba(239, 68, 68, 0.5)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 1,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'Oversold (30)',
          data: new Array(labels.length).fill(30),
          borderColor: 'rgba(34, 197, 94, 0.5)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 1,
          fill: false,
          yAxisID: 'y'
        }
      ]
    } : null;

    // MACD data
    const macdData = macd ? {
      labels,
      datasets: [
        {
          label: 'MACD',
          data: macd.map(d => d.macd),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'Signal',
          data: macd.map(d => d.signal),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'Histogram',
          data: macd.map(d => d.histogram),
          backgroundColor: macd.map(d => d.histogram >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'),
          borderColor: 'rgba(156, 163, 175, 0.8)',
          borderWidth: 1,
          type: 'bar' as const,
          yAxisID: 'y'
        }
      ]
    } : null;

    return { priceData, volumeData, rsiData, macdData };
  }, [data, sma20, sma50, ema12, ema26, rsi, macd, bollingerBands, showVolume, showRSI, showMACD, showBollingerBands, showMovingAverages]);

  // Chart options
  const options = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            title: (context: any) => {
              const date = new Date(context[0].label);
              return date.toLocaleDateString();
            },
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              return `${label}: ${value.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time' as const,
          time: {
            unit: 'day' as const,
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: activeTab === 'price' ? 'Price' : activeTab === 'rsi' ? 'RSI' : 'MACD'
          }
        },
        y1: {
          type: 'linear' as const,
          display: showVolume && activeTab === 'price',
          position: 'right' as const,
          title: {
            display: true,
            text: 'Volume'
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };

    return baseOptions;
  }, [activeTab, showVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!chartData) {
    return (
      <div className={`flex items-center justify-center h-${height} bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (activeTab) {
      case 'price':
        return (
          <div className="space-y-4">
            <Line data={chartData.priceData} options={options} ref={chartRef} />
            {showVolume && (
              <div className="h-32">
                <Bar data={chartData.volumeData} options={{
                  ...options,
                  scales: {
                    ...options.scales,
                    y: {
                      ...options.scales.y,
                      title: { display: true, text: 'Volume' }
                    }
                  }
                }} />
              </div>
            )}
          </div>
        );
      case 'rsi':
        return chartData.rsiData ? (
          <Line data={chartData.rsiData} options={{
            ...options,
            scales: {
              ...options.scales,
              y: {
                ...options.scales.y,
                min: 0,
                max: 100,
                title: { display: true, text: 'RSI' }
              }
            }
          }} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">RSI data not available</p>
          </div>
        );
      case 'macd':
        return chartData.macdData ? (
          <Line data={chartData.macdData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">MACD data not available</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Chart Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveTab('price')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'price'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Price Chart
        </button>
        {showRSI && rsi && (
          <button
            onClick={() => setActiveTab('rsi')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rsi'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            RSI
          </button>
        )}
        {showMACD && macd && (
          <button
            onClick={() => setActiveTab('macd')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'macd'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            MACD
          </button>
        )}
      </div>

      {/* Chart Container */}
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>

      {/* Indicator Summary */}
      {activeTab === 'price' && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {sma20 && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">SMA 20</div>
              <div className="text-lg font-bold text-green-600">
                ₹{sma20[sma20.length - 1]?.value.toFixed(2) || 'N/A'}
              </div>
            </div>
          )}
          {sma50 && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">SMA 50</div>
              <div className="text-lg font-bold text-red-600">
                ₹{sma50[sma50.length - 1]?.value.toFixed(2) || 'N/A'}
              </div>
            </div>
          )}
          {rsi && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">RSI</div>
              <div className={`text-lg font-bold ${
                rsi[rsi.length - 1]?.value > 70 ? 'text-red-600' :
                rsi[rsi.length - 1]?.value < 30 ? 'text-green-600' : 'text-blue-600'
              }`}>
                {rsi[rsi.length - 1]?.value.toFixed(1) || 'N/A'}
              </div>
            </div>
          )}
          {macd && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">MACD</div>
              <div className={`text-lg font-bold ${
                macd[macd.length - 1]?.trend === 'bullish' ? 'text-green-600' :
                macd[macd.length - 1]?.trend === 'bearish' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {macd[macd.length - 1]?.trend || 'N/A'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
