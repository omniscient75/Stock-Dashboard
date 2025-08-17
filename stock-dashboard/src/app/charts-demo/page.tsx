'use client';

import React, { useState, useEffect } from 'react';
import { StockLineChart } from '@/components/charts';
import { HistoricalData } from '@/types/stock';

/**
 * Charts Demo Page - Completely Safe Version
 * 
 * WHY this demo page:
 * - Shows all chart components in action with realistic data
 * - Demonstrates different chart types and configurations
 * - Provides interactive examples for learning and testing
 * - Completely self-contained with no external dependencies
 */
export default function ChartsDemoPage() {
  const [chartData, setChartData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>('RELIANCE');
  const [error, setError] = useState<string | null>(null);

  // Completely self-contained data generation
  const generateChartData = (symbol: string, days: number = 30): HistoricalData[] => {
    console.log('🔍 generateChartData called with:', { symbol, days });
    
    // Safe type checking
    if (!symbol || typeof symbol !== 'string') {
      console.error('❌ Invalid symbol:', symbol);
      return [];
    }
    
    const upperSymbol = symbol.trim().toUpperCase();
    console.log('✅ Processing symbol:', upperSymbol);
    
    // Company data - completely self-contained
    const companies = {
      'RELIANCE': { basePrice: 2500, volatility: 0.025, avgVolume: 5000000 },
      'TCS': { basePrice: 3500, volatility: 0.020, avgVolume: 3000000 },
      'HDFCBANK': { basePrice: 1500, volatility: 0.030, avgVolume: 4000000 },
      'INFY': { basePrice: 1400, volatility: 0.022, avgVolume: 3500000 },
      'ICICIBANK': { basePrice: 900, volatility: 0.035, avgVolume: 4500000 },
    };
    
    const company = companies[upperSymbol as keyof typeof companies];
    if (!company) {
      console.warn('⚠️ Company not found:', upperSymbol);
      return [];
    }
    
    console.log('✅ Generating data for:', upperSymbol, company);
    
    // Generate data
    const data: HistoricalData[] = [];
    let currentPrice = company.basePrice;
    
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }
      
      // Generate price movement
      const change = (Math.random() - 0.5) * company.volatility * 2;
      const open = currentPrice * (1 + (Math.random() - 0.5) * company.volatility);
      const close = currentPrice * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * company.volatility);
      const low = Math.min(open, close) * (1 - Math.random() * company.volatility);
      const volume = company.avgVolume * (0.5 + Math.random());
      
      const dateString = currentDate.toISOString().split('T')[0];
      data.push({
        date: dateString,
        open: Math.max(0.01, open),
        high: Math.max(open, close, high),
        low: Math.min(open, close, low),
        close: Math.max(0.01, close),
        volume: Math.max(1000, Math.round(volume)),
      });
      
      currentPrice = close;
    }
    
    console.log('✅ Generated', data.length, 'data points');
    return data;
  };

  // Generate mock data for demonstration
  useEffect(() => {
    const generateData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 ChartsDemoPage: Starting data generation');
        console.log('📊 Current selectedCompany:', {
          selectedCompany,
          type: typeof selectedCompany,
          isString: typeof selectedCompany === 'string'
        });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Type guard 1: Ensure selectedCompany is a string
        if (typeof selectedCompany !== 'string') {
          console.error('❌ ChartsDemoPage: selectedCompany is not a string:', {
            selectedCompany,
            type: typeof selectedCompany
          });
          throw new Error('Invalid company symbol: not a string');
        }

        // Type guard 2: Ensure selectedCompany is not empty
        if (selectedCompany.trim().length === 0) {
          console.error('❌ ChartsDemoPage: selectedCompany is empty');
          throw new Error('Invalid company symbol: empty string');
        }
        
        const companySymbol = selectedCompany.trim().toUpperCase();
        console.log('✅ ChartsDemoPage: Using company symbol:', companySymbol);

        // Generate data using self-contained function
        console.log('🔍 ChartsDemoPage: Calling generateChartData');
        const chartData = generateChartData(companySymbol, 30);

        if (!chartData || chartData.length === 0) {
          console.error('❌ ChartsDemoPage: No data generated for company:', companySymbol);
          throw new Error(`No data generated for ${companySymbol}`);
        }

        console.log('✅ ChartsDemoPage: Successfully generated data:', {
          company: companySymbol,
          dataPoints: chartData.length,
          firstDate: chartData[0]?.date || 'N/A',
          lastDate: chartData[chartData.length - 1]?.date || 'N/A'
        });

        setChartData(chartData);
      } catch (err) {
        console.error('❌ ChartsDemoPage: Error generating data:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate chart data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    generateData();
  }, [selectedCompany]);

  // Company options for demo
  const companies = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
    { symbol: 'INFY', name: 'Infosys Ltd' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Stock Charts Demo
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Interactive stock charts built with Chart.js and React
              </p>
            </div>
            
            {/* Company Selector */}
            <div className="mt-4 sm:mt-0">
              <label htmlFor="company-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Company:
              </label>
              <select
                id="company-select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {companies.map((company) => (
                  <option key={company.symbol} value={company.symbol}>
                    {company.symbol} - {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chart Dashboard */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedCompany} - {companies.find(c => c.symbol === selectedCompany)?.name}
            </h2>
            
            <StockLineChart
              data={chartData}
              title={`${selectedCompany} Price Chart`}
              height={400}
              loading={loading}
              error={error}
            />
          </div>
        </div>

       
      </div>
    </div>
  );
}
