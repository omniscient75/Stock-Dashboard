'use client';

import { useState } from 'react';
import { StockSummary } from '@/types/stock';
import StockCard from '@/components/ui/StockCard';
import MarketIndexCard from '@/components/ui/MarketIndexCard';
import SearchBar from '@/components/ui/SearchBar';
import TimeframeSelector from '@/components/ui/TimeframeSelector';
import Sidebar from '@/components/ui/Sidebar';

// Mock data for demonstration
const mockStocks: StockSummary[] = [
  {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 175.43,
    change: 2.15,
    changePercent: 0.0124,
    isPositive: true,
  },
  {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    currentPrice: 142.56,
    change: -1.23,
    changePercent: -0.0085,
    isPositive: false,
  },
  {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    currentPrice: 378.85,
    change: 5.67,
    changePercent: 0.0152,
    isPositive: true,
  },
  {
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    currentPrice: 248.42,
    change: -3.21,
    changePercent: -0.0128,
    isPositive: false,
  },
  {
    symbol: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    currentPrice: 145.24,
    change: 3.45,
    changePercent: 0.0243,
    isPositive: true,
  },
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    currentPrice: 485.09,
    change: -12.34,
    changePercent: -0.0248,
    isPositive: false,
  },
];

const marketIndices = [
  { name: 'S&P 500', value: '4,567.89', change: 12.34, changePercent: 0.27, isPositive: true },
  { name: 'NASDAQ', value: '14,234.56', change: -23.45, changePercent: -0.16, isPositive: false },
  { name: 'DOW JONES', value: '34,567.12', change: 45.67, changePercent: 0.13, isPositive: true },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredStocks = mockStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockClick = (stock: StockSummary) => {
    console.log('Stock clicked:', stock.symbol);
    // TODO: Navigate to stock detail page or open modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📈</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Stock Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-64">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search stocks..."
          />
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {marketIndices.map((index) => (
            <MarketIndexCard key={index.name} index={index} />
          ))}
        </div>

        {/* Stock List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Popular Stocks
          </h2>
          <div className="flex items-center space-x-4">
            <TimeframeSelector
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
            <a
              href="/charts"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Charts
            </a>
          </div>
        </div>

        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onClick={() => handleStockClick(stock)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No stocks found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <span className="text-xs">Dashboard</span>
          </button>
          <a href="/charts" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Charts</span>
          </a>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-xs">Portfolio</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
