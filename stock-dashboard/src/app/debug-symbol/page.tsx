'use client';

import React, { useState, useEffect } from 'react';
import { getCompanyBySymbol } from '@/lib/indian-companies';
import { generateSampleData } from '@/lib/mock-data-generator';

/**
 * Comprehensive Symbol Debugging Page
 * 
 * WHY this page:
 * - Test every possible scenario that could cause the TypeError
 * - Identify if the issue is in the functions or the React state
 * - Provide detailed logging for debugging
 * - Test the exact same code path as the charts demo
 */
export default function DebugSymbolPage() {
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addOutput = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugOutput(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setDebugOutput([]);
    
    addOutput('🚀 === COMPREHENSIVE SYMBOL DEBUGGING STARTED ===');
    
    try {
      // Test 1: Direct function calls with various inputs
      addOutput('\n📊 TEST 1: Direct getCompanyBySymbol calls');
      
      const testInputs = [
        'RELIANCE',
        null,
        undefined,
        123,
        '',
        '   ',
        {},
        [],
        true,
        false,
        () => {},
        Symbol('test')
      ];

      for (const input of testInputs) {
        addOutput(`\n🔍 Testing: ${JSON.stringify(input)} (type: ${typeof input})`);
        try {
          const result = getCompanyBySymbol(input);
          addOutput(`✅ Result: ${result ? result.symbol : 'Not found'}`);
        } catch (error) {
          addOutput(`❌ Error: ${error}`);
        }
      }

      // Test 2: generateSampleData with various inputs
      addOutput('\n📊 TEST 2: generateSampleData calls');
      
      const testOptions = [
        { companies: ['RELIANCE'] },
        { companies: [null] },
        { companies: [undefined] },
        { companies: [123] },
        { companies: [''] },
        { companies: ['RELIANCE', null, 'TCS'] },
        { companies: null },
        { companies: undefined },
        { companies: 'RELIANCE' }, // string instead of array
        { companies: [] }, // empty array
      ];

      for (let i = 0; i < testOptions.length; i++) {
        const options = testOptions[i];
        addOutput(`\n🔍 Test ${i + 1}: ${JSON.stringify(options)}`);
        try {
          const result = generateSampleData(options as any);
          addOutput(`✅ Result: ${Object.keys(result).length} companies`);
        } catch (error) {
          addOutput(`❌ Error: ${error}`);
        }
      }

      // Test 3: Simulate exact charts demo scenario
      addOutput('\n📊 TEST 3: Exact Charts Demo Simulation');
      
      try {
        // Simulate the exact state from charts demo
        const selectedCompany = 'RELIANCE';
        addOutput(`selectedCompany: "${selectedCompany}" (type: ${typeof selectedCompany})`);
        
        // Simulate the exact code path from charts demo
        if (typeof selectedCompany !== 'string') {
          throw new Error('Invalid company symbol: not a string');
        }
        
        if (selectedCompany.trim().length === 0) {
          throw new Error('Invalid company symbol: empty string');
        }
        
        const companySymbol = selectedCompany.trim().toUpperCase();
        addOutput(`companySymbol: "${companySymbol}"`);
        
        const data = generateSampleData({
          companies: [companySymbol],
          days: 30,
          scenario: 'normal',
        });
        
        const chartData = data[companySymbol];
        addOutput(`✅ Charts demo simulation successful: ${chartData?.length || 0} data points`);
        
      } catch (error) {
        addOutput(`❌ Charts demo simulation failed: ${error}`);
      }

      // Test 4: Test with React state simulation
      addOutput('\n📊 TEST 4: React State Simulation');
      
      try {
        // Simulate potential React state issues
        const stateValues = [
          'RELIANCE',
          null,
          undefined,
          '',
          '   ',
          123,
          {},
          []
        ];

        for (const stateValue of stateValues) {
          addOutput(`\n🔍 Testing state value: ${JSON.stringify(stateValue)} (type: ${typeof stateValue})`);
          
          // Simulate the exact validation from charts demo
          if (typeof stateValue !== 'string') {
            addOutput(`❌ State validation failed: not a string`);
            continue;
          }
          
          if (stateValue.trim().length === 0) {
            addOutput(`❌ State validation failed: empty string`);
            continue;
          }
          
          const symbol = stateValue.trim().toUpperCase();
          addOutput(`✅ State validation passed: "${symbol}"`);
          
          try {
            const data = generateSampleData({
              companies: [symbol],
              days: 5,
              scenario: 'normal'
            });
            addOutput(`✅ Data generation successful: ${Object.keys(data).length} companies`);
          } catch (error) {
            addOutput(`❌ Data generation failed: ${error}`);
          }
        }
        
      } catch (error) {
        addOutput(`❌ React state simulation failed: ${error}`);
      }

    } catch (error) {
      addOutput(`❌ Comprehensive test failed: ${error}`);
    } finally {
      setIsRunning(false);
      addOutput('\n🏁 === COMPREHENSIVE SYMBOL DEBUGGING COMPLETED ===');
    }
  };

  const clearOutput = () => {
    setDebugOutput([]);
  };

  const testSpecificScenario = (scenario: string) => {
    addOutput(`\n🎯 Testing specific scenario: ${scenario}`);
    
    switch (scenario) {
      case 'charts-demo-exact':
        // Test the exact code from charts demo
        try {
          const selectedCompany = 'RELIANCE';
          const companySymbol = selectedCompany.trim().toUpperCase();
          const data = generateSampleData({
            companies: [companySymbol],
            days: 30,
            scenario: 'normal',
          });
          addOutput(`✅ Charts demo exact test passed`);
        } catch (error) {
          addOutput(`❌ Charts demo exact test failed: ${error}`);
        }
        break;
        
      case 'undefined-symbol':
        // Test with undefined symbol
        try {
          const data = generateSampleData({
            companies: [undefined as any],
            days: 5,
            scenario: 'normal'
          });
          addOutput(`✅ Undefined symbol test passed`);
        } catch (error) {
          addOutput(`❌ Undefined symbol test failed: ${error}`);
        }
        break;
        
      default:
        addOutput(`❌ Unknown scenario: ${scenario}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Comprehensive Symbol Debugging
        </h1>

        {/* Control Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Debug Controls
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={runComprehensiveTest}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? 'Running Tests...' : 'Run Comprehensive Test'}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => testSpecificScenario('charts-demo-exact')}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Test Charts Demo Exact
              </button>
              <button
                onClick={() => testSpecificScenario('undefined-symbol')}
                className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Test Undefined Symbol
              </button>
              <button
                onClick={clearOutput}
                className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear Output
              </button>
            </div>
          </div>
        </div>

        {/* Debug Output */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Debug Output
            </h2>
            <span className="text-sm text-gray-500">
              {debugOutput.length} messages
            </span>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {debugOutput.length === 0 ? (
              <p className="text-gray-500">No debug output yet. Run tests to see results.</p>
            ) : (
              debugOutput.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Instructions
          </h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>1. Click "Run Comprehensive Test" to test all scenarios</p>
            <p>2. Watch for any ❌ errors in the output</p>
            <p>3. Check browser console (F12) for additional logging</p>
            <p>4. If tests pass here but fail in charts demo, there's a caching issue</p>
            <p>5. Look for the exact error message and stack trace</p>
          </div>
        </div>
      </div>
    </div>
  );
}
