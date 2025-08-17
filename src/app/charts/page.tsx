'use client';

import React, { useState, useEffect } from 'react';
import { StockChartDashboard } from '@/components/charts';
import { HistoricalData } from '@/types/stock';
import SearchBar from '@/components/ui/SearchBar';
import TimeframeSelector from '@/components/ui/TimeframeSelector';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

// Company data for the charts
const companies = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
];

// Generate realistic chart data
const generateChartData = (symbol: string, days: number = 30): HistoricalData[] => {
  const companies = {
    'AAPL': { basePrice: 175, volatility: 0.025, avgVolume: 50000000 },
    'GOOGL': { basePrice: 142, volatility: 0.020, avgVolume: 30000000 },
    'MSFT': { basePrice: 378, volatility: 0.022, avgVolume: 35000000 },
    'TSLA': { basePrice: 248, volatility: 0.035, avgVolume: 80000000 },
    'AMZN': { basePrice: 145, volatility: 0.030, avgVolume: 40000000 },
    'NVDA': { basePrice: 485, volatility: 0.040, avgVolume: 60000000 },
    'META': { basePrice: 320, volatility: 0.028, avgVolume: 25000000 },
    'NFLX': { basePrice: 580, volatility: 0.032, avgVolume: 15000000 },
  };
  
  const company = companies[symbol as keyof typeof companies];
  if (!company) return [];
  
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
  
  return data;
};

export default function ChartsPage() {
  const [chartData, setChartData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [error, setError] = useState<string | null>(null);

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate chart data when company or timeframe changes
  useEffect(() => {
    const generateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const days = selectedTimeframe === '1D' ? 1 : 
                    selectedTimeframe === '1W' ? 7 :
                    selectedTimeframe === '1M' ? 30 :
                    selectedTimeframe === '3M' ? 90 : 365;
        
        const data = generateChartData(selectedCompany, days);
        
        if (!data || data.length === 0) {
          throw new Error(`No data available for ${selectedCompany}`);
        }
        
        setChartData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    generateData();
  }, [selectedCompany, selectedTimeframe]);

  const handleCompanySelect = (company: typeof companies[0]) => {
    setSelectedCompany(company.symbol);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              Interactive Charts
            </h1>
            <p className="mt-1 text-gray-600">
              Professional stock charts with technical analysis
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <TimeframeSelector
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
              timeframes={['1D', '1W', '1M', '3M', '1Y']}
            />
          </div>
        </div>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Company Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Company
              </h3>
              
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search companies..."
                className="mb-4"
              />
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCompanies.map((company) => (
                  <button
                    key={company.symbol}
                    onClick={() => handleCompanySelect(company)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCompany === company.symbol
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{company.symbol}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {company.name}
                    </div>
                  </button>
                ))}
                
                {filteredCompanies.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>No companies found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSkeleton type="chart" />
            ) : error ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error Loading Chart
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedCompany}
                      </h2>
                      <p className="text-gray-600">
                        {companies.find(c => c.symbol === selectedCompany)?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {selectedTimeframe} Chart
                      </p>
                      <p className="text-sm text-gray-500">
                        {chartData.length} data points
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <StockChartDashboard
                    data={chartData}
                    symbol={selectedCompany}
                    companyName={companies.find(c => c.symbol === selectedCompany)?.name}
                    loading={false}
                    error={null}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    
  );
}
