'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Simple mock data
const mockStocks = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    price: 2456.78,
    change: 45.23,
    changePercent: 0.0187,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3890.45,
    change: -23.67,
    changePercent: -0.0061,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    price: 1678.90,
    change: 12.45,
    changePercent: 0.0075,
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  // Simulate loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                StockDash
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Professional Stock Market Dashboard
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/charts-demo"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Charts Demo
              </Link>
              <Link
                href="/technical-analysis-demo"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Analysis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Stock Market
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Dashboard
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Real-time market analytics, interactive charts, and comprehensive portfolio tracking 
            for informed investment decisions.
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/charts-demo"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              View Charts Demo
            </Link>
            <Link
              href="/technical-analysis-demo"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-medium"
            >
              Technical Analysis
            </Link>
          </div>
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Market Cap
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹5.89T
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Volume
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  10.8M
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Gainers
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  4
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Losers
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  2
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">📉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Cards Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Top Stocks
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                View All
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Refresh
              </button>
            </div>
          </div>

          {/* Stock Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : (
              // Actual stock cards
              mockStocks.map((stock) => (
                <div key={stock.symbol} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stock.symbol}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {stock.name}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${
                      stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stock.change >= 0 ? '↗' : '↘'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{stock.price.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-medium ${
                        stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                      </div>
                      <div className={`text-sm font-medium ${
                        stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(stock.changePercent * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 dark:text-blue-400 text-2xl">📊</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Interactive Charts
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Real-time stock charts with multiple visualization options including line charts, 
              candlestick charts, and volume analysis.
            </p>
            <Link
              href="/charts-demo"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Explore Charts →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 dark:text-green-400 text-2xl">📈</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Technical Analysis
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Advanced technical indicators, price predictions, and trading signals for 
              informed investment decisions.
            </p>
            <Link
              href="/technical-analysis-demo"
              className="text-green-600 dark:text-green-400 hover:underline font-medium"
            >
              View Analysis →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 dark:text-purple-400 text-2xl">⚡</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Updates
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Live data updates with responsive design and smooth animations for the best user experience.
            </p>
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              Learn More →
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Start Trading?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Explore our comprehensive suite of tools and analytics to make informed investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/charts-demo"
              className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Start with Charts
            </Link>
            <Link
              href="/technical-analysis-demo"
              className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Try Analysis
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
