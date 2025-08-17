'use client';

import { useState, useEffect } from 'react';
import DataSourceToggle from '@/components/DataSourceToggle';

interface StockData {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change?: number;
  changePercent?: number;
}

interface LatestPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
}

interface CompanyData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: string;
  marketCap: number;
  peRatio?: number;
  dividendYield?: number;
  basePrice: number;
  volatility: number;
  avgVolume: number;
  description?: string;
}

/**
 * Data Source Demo Page
 * 
 * WHY this page:
 * - Demonstrates data source switching functionality
 * - Shows real-time data from different sources
 * - Provides interactive testing capabilities
 * - Educates users about data source architecture
 */
export default function DataSourceDemoPage() {
  const [currentDataSource, setCurrentDataSource] = useState<string>('mock');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [latestPrice, setLatestPrice] = useState<LatestPrice | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');

  // Fetch stock data
  const fetchStockData = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/stocks/${symbol}?limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      if (data.success) {
        setStockData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch stock data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest price
  const fetchLatestPrice = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/stocks/${symbol}/latest`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest price');
      }
      
      const data = await response.json();
      if (data.success) {
        setLatestPrice(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch latest price');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching latest price:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch company info
  const fetchCompanyInfo = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/companies?search=${symbol}&limit=1`);
      if (!response.ok) {
        throw new Error('Failed to fetch company info');
      }
      
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setCompanyInfo(data.data[0]);
      } else {
        throw new Error('Company not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching company info:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data for a symbol
  const fetchAllData = async (symbol: string) => {
    await Promise.all([
      fetchStockData(symbol),
      fetchLatestPrice(symbol),
      fetchCompanyInfo(symbol),
    ]);
  };

  // Handle data source change
  const handleDataSourceChange = (source: string) => {
    setCurrentDataSource(source);
    // Refresh data with new source
    fetchAllData(selectedSymbol);
  };

  // Handle symbol change
  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    fetchAllData(symbol);
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData(selectedSymbol);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Source Integration Demo
          </h1>
          <p className="text-gray-600">
            Switch between mock and live data sources to see the difference in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Source Manager */}
          <div className="lg:col-span-1">
            <DataSourceToggle onDataSourceChange={handleDataSourceChange} />
          </div>

          {/* Data Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symbol Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Symbol Selector</h3>
              <div className="flex flex-wrap gap-2">
                {['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => handleSymbolChange(symbol)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSymbol === symbol
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Data Source Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Data Source</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{currentDataSource.toUpperCase()}</span>
                <span className="text-sm text-gray-500">• Active</span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                Loading data...
              </div>
            )}

            {/* Latest Price */}
            {latestPrice && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Price</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-xl font-bold text-gray-900">₹{latestPrice.price}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Change</div>
                    <div className={`text-lg font-semibold ${
                      latestPrice.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestPrice.change >= 0 ? '+' : ''}{latestPrice.change} ({latestPrice.changePercent}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Volume</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {(latestPrice.volume / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">High/Low</div>
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{latestPrice.high} / ₹{latestPrice.low}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Information */}
            {companyInfo && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-semibold text-gray-900">{companyInfo.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Sector</div>
                    <div className="font-semibold text-gray-900">{companyInfo.sector}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Market Cap</div>
                    <div className="font-semibold text-gray-900">
                      ₹{(companyInfo.marketCap / 1000).toFixed(0)}K Cr
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">P/E Ratio</div>
                    <div className="font-semibold text-gray-900">
                      {companyInfo.peRatio ? companyInfo.peRatio.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </div>
                {companyInfo.description && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-500">Description</div>
                    <div className="text-sm text-gray-700">{companyInfo.description}</div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Data Table */}
            {stockData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Stock Data</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Open
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          High
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Low
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Close
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Volume
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stockData.slice(0, 5).map((data, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(data.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{data.open}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{data.high}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{data.low}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{data.close}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(data.volume / 1000000).toFixed(1)}M
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Information */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Architecture Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Source Abstraction</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Common interface for all data sources</li>
                <li>• Automatic fallback between sources</li>
                <li>• Consistent error handling</li>
                <li>• Unified data transformation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Rate limiting and caching</li>
                <li>• Retry logic with exponential backoff</li>
                <li>• Real-time health monitoring</li>
                <li>• Easy source switching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
