'use client';

import React, { useState, useEffect } from 'react';
import { getCompanyBySymbol } from '@/lib/indian-companies';
import { generateSampleData } from '@/lib/mock-data-generator';

/**
 * Simple Test Page for Symbol Handling
 * 
 * WHY this test page:
 * - Isolate the symbol handling issue
 * - Test each function individually
 * - Provide immediate feedback
 * - Identify exact error location
 */
export default function TestSymbolPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🔍 Starting symbol handling tests...');
    
    try {
      // Test 1: Direct getCompanyBySymbol call
      addResult('📊 Test 1: Testing getCompanyBySymbol with "RELIANCE"');
      try {
        const company = getCompanyBySymbol('RELIANCE');
        addResult(`✅ getCompanyBySymbol result: ${company ? company.symbol : 'Not found'}`);
      } catch (error) {
        addResult(`❌ getCompanyBySymbol error: ${error}`);
      }

      // Test 2: Test with null
      addResult('📊 Test 2: Testing getCompanyBySymbol with null');
      try {
        const company = getCompanyBySymbol(null);
        addResult(`✅ getCompanyBySymbol with null result: ${company ? company.symbol : 'Not found'}`);
      } catch (error) {
        addResult(`❌ getCompanyBySymbol with null error: ${error}`);
      }

      // Test 3: Test with number
      addResult('📊 Test 3: Testing getCompanyBySymbol with number');
      try {
        const company = getCompanyBySymbol(123);
        addResult(`✅ getCompanyBySymbol with number result: ${company ? company.symbol : 'Not found'}`);
      } catch (error) {
        addResult(`❌ getCompanyBySymbol with number error: ${error}`);
      }

      // Test 4: Test generateSampleData
      addResult('📊 Test 4: Testing generateSampleData');
      try {
        const data = generateSampleData({
          companies: ['RELIANCE'],
          days: 5,
          scenario: 'normal'
        });
        addResult(`✅ generateSampleData result: ${Object.keys(data).length} companies`);
      } catch (error) {
        addResult(`❌ generateSampleData error: ${error}`);
      }

      // Test 5: Test the exact scenario from charts demo
      addResult('📊 Test 5: Testing exact charts demo scenario');
      try {
        const selectedCompany = 'RELIANCE';
        addResult(`selectedCompany: "${selectedCompany}" (type: ${typeof selectedCompany})`);
        
        const data = generateSampleData({
          companies: [selectedCompany],
          days: 30,
          scenario: 'normal'
        });
        
        const chartData = data[selectedCompany];
        addResult(`✅ Charts demo scenario result: ${chartData ? chartData.length : 0} data points`);
      } catch (error) {
        addResult(`❌ Charts demo scenario error: ${error}`);
      }

    } catch (error) {
      addResult(`❌ Test suite error: ${error}`);
    } finally {
      setIsRunning(false);
      addResult('🔍 Test suite completed');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Symbol Handling Test Page
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Test Controls
            </h2>
            <div className="space-x-2">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Click "Run Tests" to start.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Instructions
          </h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>1. Click "Run Tests" to execute all symbol handling tests</p>
            <p>2. Watch the results to identify where the TypeError occurs</p>
            <p>3. Check browser console (F12) for additional debugging information</p>
            <p>4. If tests pass here but fail in charts demo, there's a state management issue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
