'use client';

import React, { useState, useEffect } from 'react';
import { debugSymbolHandling, testErrorScenarios } from '@/lib/debug-symbols';
import { getCompanyBySymbol } from '@/lib/indian-companies';
import { generateSampleData } from '@/lib/mock-data-generator';

/**
 * Debug Page
 * 
 * WHY this debug page:
 * - Test symbol handling functions in browser environment
 * - Identify exact source of TypeError
 * - Validate all type guards and error handling
 * - Provide real-time debugging information
 */
export default function DebugPage() {
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Capture console output
  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      setDebugOutput(prev => [...prev, `LOG: ${args.join(' ')}`]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setDebugOutput(prev => [...prev, `WARN: ${args.join(' ')}`]);
    };

    console.error = (...args) => {
      originalError(...args);
      setDebugOutput(prev => [...prev, `ERROR: ${args.join(' ')}`]);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const runDebugTests = () => {
    setIsRunning(true);
    setDebugOutput([]);
    
    setTimeout(() => {
      try {
        debugSymbolHandling();
        testErrorScenarios();
      } catch (error) {
        console.error('Debug test failed:', error);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  const testSpecificSymbol = (symbol: unknown) => {
    console.log(`🔍 Testing specific symbol: ${symbol} (type: ${typeof symbol})`);
    try {
      const company = getCompanyBySymbol(symbol);
      console.log(`✅ Result: ${company ? company.symbol : 'Not found'}`);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  };

  const testGenerateSampleData = (companies: unknown) => {
    console.log(`🔍 Testing generateSampleData with: ${JSON.stringify(companies)}`);
    try {
      const data = generateSampleData({ companies: companies as any });
      console.log(`✅ Result: ${Object.keys(data).length} companies`);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Symbol Debug Page
        </h1>

        {/* Control Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Debug Controls
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={runDebugTests}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? 'Running Tests...' : 'Run All Debug Tests'}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Test Specific Symbol</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => testSpecificSymbol('RELIANCE')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Test 'RELIANCE'
                  </button>
                  <button
                    onClick={() => testSpecificSymbol(null)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Test null
                  </button>
                  <button
                    onClick={() => testSpecificSymbol(123)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Test number
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Test generateSampleData</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => testGenerateSampleData(['RELIANCE'])}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Test valid array
                  </button>
                  <button
                    onClick={() => testGenerateSampleData(null)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Test null
                  </button>
                  <button
                    onClick={() => testGenerateSampleData(['RELIANCE', null, 'TCS'])}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Test mixed array
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Output */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Debug Output
            </h2>
            <button
              onClick={() => setDebugOutput([])}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {debugOutput.length === 0 ? (
              <p className="text-gray-500">No debug output yet. Run tests to see results.</p>
            ) : (
              debugOutput.map((line, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-600">{index + 1}:</span> {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
