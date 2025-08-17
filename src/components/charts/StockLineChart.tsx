'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { HistoricalData } from '@/types/stock';

// Register Chart.js components we need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockLineChartProps {
  data: HistoricalData[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  loading?: boolean;
  error?: string | null;
}

/**
 * StockLineChart Component
 * 
 * WHY this component structure:
 * - 'use client' directive is required for Chart.js in Next.js 13+ app router
 * - useMemo prevents unnecessary chart re-renders when props haven't changed
 * - useRef helps with chart instance management and cleanup
 * - Chart.js registration happens once at module level for performance
 */
export const StockLineChart: React.FC<StockLineChartProps> = ({
  data,
  title = 'Stock Price',
  height = 400,
  showLegend = true,
  loading = false,
  error = null,
}) => {
  const chartRef = useRef<ChartJS>(null);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData: ChartData<'line'> = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Sort data by date to ensure proper time sequence
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedData.map(item => format(new Date(item.date), 'MMM dd')),
      datasets: [
        {
          label: 'Close Price',
          data: sortedData.map(item => Number(item.close)),
          borderColor: 'rgb(59, 130, 246)', // Blue color
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1, // Slight curve for smoother appearance
          pointRadius: 0, // Hide points by default for cleaner look
          pointHoverRadius: 6, // Show points on hover
          pointHoverBackgroundColor: 'rgb(59, 130, 246)',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [data]);

  // Chart configuration options
  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
            const value = context.parsed.y;
            return `${context.dataset.label}: ₹${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: false, // Hide vertical grid lines
        },
        ticks: {
          maxTicksLimit: 8, // Limit number of x-axis labels for readability
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
          callback: (value) => `₹${Number(value).toFixed(0)}`,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 6,
      },
    },
  }), [title, showLegend, data]);

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
          <p className="text-gray-500 text-sm">Loading chart...</p>
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
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4"
      style={{ height }}
    >
      <Line 
        ref={chartRef}
        data={chartData} 
        options={options}
      />
    </div>
  );
};
