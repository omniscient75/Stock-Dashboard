'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { HistoricalData } from '@/types/stock';

// Register Chart.js components for candlestick chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CandlestickChartProps {
  data: HistoricalData[];
  title?: string;
  height?: number;
  showVolume?: boolean;
  loading?: boolean;
  error?: string | null;
}

/**
 * CandlestickChart Component
 * 
 * WHY this approach:
 * - Uses Bar chart as base since Chart.js doesn't have built-in candlestick
 * - Each bar represents a candlestick with custom styling
 * - Volume bars are shown below price chart for context
 * - Custom tooltips show OHLCV data in financial format
 * - Responsive design adapts to different screen sizes
 */
export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  title = 'Stock Price (OHLCV)',
  height = 500,
  showVolume = true,
  loading = false,
  error = null,
}) => {
  const chartRef = useRef<ChartJS>(null);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData: ChartData<'bar'> = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate candlestick colors based on open vs close
    const candlestickData = sortedData.map(item => {
      const open = Number(item.open);
      const close = Number(item.close);
      const isGreen = close >= open; // Green if close >= open (bullish)
      
      return {
        open,
        high: Number(item.high),
        low: Number(item.low),
        close,
        volume: Number(item.volume),
        isGreen,
        date: item.date,
      };
    });

    // Create datasets for candlestick chart
    const datasets = [
      // High-Low range (body of candlestick)
      {
        label: 'High-Low Range',
        data: candlestickData.map(item => ({
          x: format(new Date(item.date), 'MMM dd'),
          y: item.high - item.low,
          base: item.low,
          open: item.open,
          close: item.close,
          isGreen: item.isGreen,
          volume: item.volume,
          date: item.date,
        })),
        backgroundColor: candlestickData.map(item => 
          item.isGreen ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: candlestickData.map(item => 
          item.isGreen ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
        borderRadius: 0,
        borderSkipped: false,
      },
    ];

    // Add volume dataset if requested
    if (showVolume) {
      const maxVolume = Math.max(...candlestickData.map(item => item.volume));
      datasets.push({
        label: 'Volume',
        data: candlestickData.map(item => ({
          x: format(new Date(item.date), 'MMM dd'),
          y: (item.volume / maxVolume) * 50, // Scale volume to reasonable height
          volume: item.volume,
          date: item.date,
        })),
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: 'rgba(156, 163, 175, 0.5)',
        borderWidth: 1,
        borderRadius: 2,
        yAxisID: 'volume',
      });
    }

    return {
      labels: candlestickData.map(item => format(new Date(item.date), 'MMM dd')),
      datasets,
    };
  }, [data, showVolume]);

  // Chart configuration options
  const options: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const dataIndex = context[0].dataIndex;
            const date = data[dataIndex]?.date;
            return date ? format(new Date(date), 'MMM dd, yyyy') : '';
          },
          label: (context) => {
            const datasetIndex = context.datasetIndex;
            const dataPoint = context.parsed;
            
            if (datasetIndex === 0) {
              // Price data
              const item = data[context.dataIndex];
              return [
                `Open: ₹${Number(item.open).toFixed(2)}`,
                `High: ₹${Number(item.high).toFixed(2)}`,
                `Low: ₹${Number(item.low).toFixed(2)}`,
                `Close: ₹${Number(item.close).toFixed(2)}`,
                `Change: ${Number(item.close) >= Number(item.open) ? '+' : ''}${(Number(item.close) - Number(item.open)).toFixed(2)}`,
              ];
            } else if (datasetIndex === 1 && showVolume) {
              // Volume data
              const volume = Number(data[context.dataIndex].volume);
              return `Volume: ${volume.toLocaleString()}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
          color: '#6b7280',
        },
      },
      y: {
        display: true,
        position: 'left' as const,
        title: {
          display: false,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
          color: '#6b7280',
          callback: (value) => `₹${Number(value).toFixed(0)}`,
        },
      },
      volume: {
        display: showVolume,
        position: 'right' as const,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false, // Hide volume axis labels
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
  }), [title, showVolume, data]);

  // Cleanup chart instance on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center bg-white rounded-lg border border-gray-200"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading candlestick chart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-white rounded-lg border border-gray-200"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty data state
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-white rounded-lg border border-gray-200"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-2">📊</div>
          <p className="text-gray-500 text-sm">No OHLCV data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4"
      style={{ height }}
    >
      <Bar 
        ref={chartRef}
        data={chartData} 
        options={options}
      />
    </div>
  );
};
