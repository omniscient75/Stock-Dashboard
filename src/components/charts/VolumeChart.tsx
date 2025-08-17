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

// Register Chart.js components for volume chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VolumeChartProps {
  data: HistoricalData[];
  title?: string;
  height?: number;
  showPriceOverlay?: boolean;
  loading?: boolean;
  error?: string | null;
}

/**
 * VolumeChart Component
 * 
 * WHY this component:
 * - Shows trading volume as bars for easy pattern recognition
 * - Optional price overlay helps correlate volume with price movements
 * - Color-coded bars based on price direction (green/red)
 * - Responsive design with proper scaling for large volume numbers
 * - Custom tooltips show both volume and price information
 */
export const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  title = 'Trading Volume',
  height = 300,
  showPriceOverlay = false,
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

    // Calculate volume data with price direction
    const volumeData = sortedData.map(item => {
      const open = Number(item.open);
      const close = Number(item.close);
      const volume = Number(item.volume);
      const isGreen = close >= open;
      
      return {
        volume,
        open,
        close,
        isGreen,
        date: item.date,
        change: close - open,
        changePercent: ((close - open) / open) * 100,
      };
    });

    // Create volume dataset
    const datasets = [
      {
        label: 'Volume',
        data: volumeData.map(item => ({
          x: format(new Date(item.date), 'MMM dd'),
          y: item.volume,
          open: item.open,
          close: item.close,
          change: item.change,
          changePercent: item.changePercent,
          date: item.date,
        })),
        backgroundColor: volumeData.map(item => 
          item.isGreen 
            ? 'rgba(34, 197, 94, 0.6)' 
            : 'rgba(239, 68, 68, 0.6)'
        ),
        borderColor: volumeData.map(item => 
          item.isGreen 
            ? 'rgba(34, 197, 94, 0.8)' 
            : 'rgba(239, 68, 68, 0.8)'
        ),
        borderWidth: 1,
        borderRadius: 2,
        borderSkipped: false,
      },
    ];

    // Add price overlay if requested
    if (showPriceOverlay) {
      const maxVolume = Math.max(...volumeData.map(item => item.volume));
      const maxPrice = Math.max(...volumeData.map(item => Math.max(item.open, item.close)));
      
      datasets.push({
        label: 'Close Price',
        data: volumeData.map(item => ({
          x: format(new Date(item.date), 'MMM dd'),
          y: (item.close / maxPrice) * maxVolume * 0.8, // Scale price to volume chart
          price: item.close,
          date: item.date,
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
        type: 'line' as any, // Override type for line overlay
      });
    }

    return {
      labels: volumeData.map(item => format(new Date(item.date), 'MMM dd')),
      datasets,
    };
  }, [data, showPriceOverlay]);

  // Chart configuration options
  const options: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showPriceOverlay,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
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
        displayColors: true,
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
              // Volume data
              const volume = Number(data[context.dataIndex].volume);
              const open = Number(data[context.dataIndex].open);
              const close = Number(data[context.dataIndex].close);
              const change = close - open;
              const changePercent = ((change / open) * 100);
              
              return [
                `Volume: ${volume.toLocaleString()}`,
                `Open: ₹${open.toFixed(2)}`,
                `Close: ₹${close.toFixed(2)}`,
                `Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`,
              ];
            } else if (datasetIndex === 1 && showPriceOverlay) {
              // Price overlay data
              const price = Number(data[context.dataIndex].close);
              return `Price: ₹${price.toFixed(2)}`;
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
          callback: (value) => {
            const numValue = Number(value);
            if (numValue >= 1000000) {
              return `${(numValue / 1000000).toFixed(1)}M`;
            } else if (numValue >= 1000) {
              return `${(numValue / 1000).toFixed(1)}K`;
            }
            return numValue.toLocaleString();
          },
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
  }), [title, showPriceOverlay, data]);

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
          <p className="text-gray-500 text-sm">Loading volume chart...</p>
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
          <p className="text-gray-500 text-sm">No volume data available</p>
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
