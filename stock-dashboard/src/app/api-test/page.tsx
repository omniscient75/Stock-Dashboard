'use client';

import React, { useState } from 'react';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  timestamp: string;
  path: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface TestResult {
  name: string;
  method: string;
  url: string;
  requestBody?: any;
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * API Testing Page
 * 
 * WHY this page:
 * - Test all API endpoints
 * - Demonstrate request/response formats
 * - Show error handling
 * - Validate API functionality
 */
export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const makeApiCall = async (
    name: string,
    method: string,
    url: string,
    body?: any
  ): Promise<void> => {
    const result: TestResult = {
      name,
      method,
      url,
      requestBody: body,
      response: null,
      loading: true,
      error: null,
    };

    addResult(result);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data: ApiResponse = await response.json();

      const updatedResult: TestResult = {
        ...result,
        response: data,
        loading: false,
        error: null,
      };

      addResult(updatedResult);
    } catch (error) {
      const updatedResult: TestResult = {
        ...result,
        response: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      addResult(updatedResult);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    
    // Test 1: Get all companies
    await makeApiCall(
      'Get All Companies',
      'GET',
      '/api/companies'
    );

    // Test 2: Get companies with pagination
    await makeApiCall(
      'Get Companies (Paginated)',
      'GET',
      '/api/companies?page=1&limit=5'
    );

    // Test 3: Search companies
    await makeApiCall(
      'Search Companies',
      'GET',
      '/api/companies?search=RELIANCE'
    );

    // Test 4: Filter by sector
    await makeApiCall(
      'Filter by Sector',
      'GET',
      '/api/companies?sector=Technology'
    );

    // Test 5: Get stock data
    await makeApiCall(
      'Get Stock Data',
      'GET',
      '/api/stocks/RELIANCE'
    );

    // Test 6: Get stock data with parameters
    await makeApiCall(
      'Get Stock Data (With Params)',
      'GET',
      '/api/stocks/RELIANCE?limit=10&sortBy=date&sortOrder=desc'
    );

    // Test 7: Get latest price
    await makeApiCall(
      'Get Latest Price',
      'GET',
      '/api/stocks/RELIANCE/latest'
    );

    // Test 8: Create company (should fail in demo)
    await makeApiCall(
      'Create Company',
      'POST',
      '/api/companies',
      {
        symbol: 'TEST',
        name: 'Test Company Ltd',
        sector: 'Technology',
        industry: 'Software',
        exchange: 'NSE',
        marketCap: 100000,
        basePrice: 100,
        volatility: 0.02,
        avgVolume: 1000000,
      }
    );

    // Test 9: Invalid symbol
    await makeApiCall(
      'Invalid Symbol',
      'GET',
      '/api/stocks/INVALID'
    );

    // Test 10: Invalid method
    await makeApiCall(
      'Invalid Method',
      'PUT',
      '/api/companies'
    );

    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                API Testing Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Test and validate all API endpoints
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={runAllTests}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running Tests...' : 'Run All Tests'}
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Clear Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Available Endpoints */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Available Endpoints
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Companies</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /api/companies</code> - List all companies</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">POST /api/companies</code> - Create new company</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Stocks</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /api/stocks/[symbol]</code> - Get stock data</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /api/stocks/[symbol]/latest</code> - Get latest price</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Query Parameters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Query Parameters
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Pagination</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li><code>page</code> - Page number (default: 1)</li>
                  <li><code>limit</code> - Items per page (default: 10, max: 100)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Filtering</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li><code>search</code> - Search in symbol, name, sector</li>
                  <li><code>sector</code> - Filter by sector</li>
                  <li><code>exchange</code> - Filter by exchange (NSE, BSE, BOTH)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Sorting</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li><code>sortBy</code> - Field to sort by</li>
                  <li><code>sortOrder</code> - asc or desc</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Test Results ({results.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No test results yet. Click "Run All Tests" to start testing the APIs.
              </div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {result.name}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.method === 'GET' ? 'bg-green-100 text-green-800' :
                          result.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          result.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.method}
                        </span>
                        <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {result.url}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                      {result.response && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.response.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.response.success ? 'Success' : 'Error'}
                        </span>
                      )}
                    </div>
                  </div>

                  {result.requestBody && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Request Body:</h4>
                      <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                        {JSON.stringify(result.requestBody, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.error && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-red-600 mb-2">Error:</h4>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded text-sm text-red-800 dark:text-red-200">
                        {result.error}
                      </div>
                    </div>
                  )}

                  {result.response && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Response:</h4>
                      <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
