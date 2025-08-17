'use client';

import { useState, useEffect } from 'react';

interface DataSourceStatus {
  name: string;
  healthy: boolean;
  canMakeRequest: boolean;
  current: boolean;
  config?: any;
  rateLimitStats?: any;
  cacheStats?: any;
  apiKeyStatus?: any;
  error?: string;
}

interface DataSourceToggleProps {
  onDataSourceChange?: (source: string) => void;
  className?: string;
}

/**
 * Data Source Toggle Component
 * 
 * WHY this component:
 * - Allows users to switch between data sources
 * - Shows real-time status of each data source
 * - Provides visual feedback for health and rate limits
 * - Enables testing different data sources
 */
export default function DataSourceToggle({ onDataSourceChange, className = '' }: DataSourceToggleProps) {
  const [dataSources, setDataSources] = useState<Record<string, DataSourceStatus>>({});
  const [currentSource, setCurrentSource] = useState<string>('mock');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data source status
  const fetchDataSourceStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/data-sources/status');
      if (!response.ok) {
        throw new Error('Failed to fetch data source status');
      }
      
      const data = await response.json();
      if (data.success) {
        setDataSources(data.data);
        
        // Find current source
        const current = Object.entries(data.data).find(([_, status]) => status.current);
        if (current) {
          setCurrentSource(current[0]);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch data source status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching data source status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch data source
  const switchDataSource = async (sourceName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/data-sources/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source: sourceName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to switch data source');
      }
      
      const data = await response.json();
      if (data.success) {
        setCurrentSource(sourceName);
        onDataSourceChange?.(sourceName);
        
        // Refresh status
        await fetchDataSourceStatus();
      } else {
        throw new Error(data.error || 'Failed to switch data source');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error switching data source:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test all data sources
  const testAllSources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/data-sources/test');
      if (!response.ok) {
        throw new Error('Failed to test data sources');
      }
      
      const data = await response.json();
      if (data.success) {
        console.log('Test results:', data.data);
        // Refresh status after testing
        await fetchDataSourceStatus();
      } else {
        throw new Error(data.error || 'Failed to test data sources');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error testing data sources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear all caches
  const clearAllCaches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/data-sources/clear-cache', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear caches');
      }
      
      const data = await response.json();
      if (data.success) {
        console.log('Caches cleared successfully');
        // Refresh status after clearing
        await fetchDataSourceStatus();
      } else {
        throw new Error(data.error || 'Failed to clear caches');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error clearing caches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchDataSourceStatus();
  }, []);

  // Auto-refresh status every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchDataSourceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Source Manager</h3>
        <div className="flex space-x-2">
          <button
            onClick={testAllSources}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test All
          </button>
          <button
            onClick={clearAllCaches}
            disabled={loading}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Clear Cache
          </button>
          <button
            onClick={fetchDataSourceStatus}
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading...
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(dataSources).map(([sourceName, status]) => (
          <div
            key={sourceName}
            className={`p-4 border rounded-lg ${
              status.current
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status.healthy ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="font-medium text-gray-900">
                    {status.name}
                  </span>
                  {status.current && (
                    <span className="px-2 py-1 text-xs bg-green-500 text-white rounded">
                      Current
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {status.rateLimitStats && (
                  <div className="text-xs text-gray-500">
                    {status.rateLimitStats.currentRequests}/{status.rateLimitStats.maxRequests}
                  </div>
                )}
                
                {!status.current && status.healthy && (
                  <button
                    onClick={() => switchDataSource(sourceName)}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Switch
                  </button>
                )}
              </div>
            </div>

            {/* Additional status information */}
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              {status.error && (
                <div className="text-red-600">Error: {status.error}</div>
              )}
              
              {status.apiKeyStatus && (
                <div>
                  API Key: {status.apiKeyStatus.hasKey ? '✓ Configured' : '✗ Missing'}
                </div>
              )}
              
              {status.cacheStats && (
                <div>
                  Cache: {status.cacheStats.size}/{status.cacheStats.maxSize} items
                </div>
              )}
              
              {status.rateLimitStats && (
                <div>
                  Daily: {status.rateLimitStats.dailyRequests}/{status.rateLimitStats.dailyLimit}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(dataSources).length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          No data sources available
        </div>
      )}
    </div>
  );
}
