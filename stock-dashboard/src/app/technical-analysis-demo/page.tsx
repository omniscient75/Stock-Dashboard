/**
 * Technical Analysis Demo Page
 * 
 * This page demonstrates all the technical analysis features including:
 * - Technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands)
 * - Price predictions using multiple algorithms
 * - Trading signals generation
 * - Backtesting with performance metrics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { StockLineChart } from '@/components/charts';
import { 
  technicalAnalysisService,
  convertToPriceDataPoints,
  validatePriceData,
  getDefaultPredictionConfig,
  getDefaultBacktestConfig,
  formatTechnicalAnalysis
} from '../../lib/technical-indicators';
import { PriceDataPoint, TechnicalAnalysis, BacktestResult } from '../../lib/technical-indicators/types';

export default function TechnicalAnalysisDemoPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>('RELIANCE');
  const [analysis, setAnalysis] = useState<TechnicalAnalysis | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'indicators' | 'predictions' | 'signals' | 'backtest'>('indicators');

  // Generate sample data for demonstration
  const generateSampleData = (symbol: string, days: number = 100): PriceDataPoint[] => {
    const data: PriceDataPoint[] = [];
    const basePrice = 2500; // Base price for Reliance
    let currentPrice = basePrice;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Generate realistic price movement
      const volatility = 0.02; // 2% daily volatility
      const trend = 0.0005; // Slight upward trend
      const randomChange = (Math.random() - 0.5) * volatility;
      const trendChange = trend;
      
      currentPrice *= (1 + randomChange + trendChange);
      
      // Generate OHLCV data
      const open = currentPrice;
      const high = open * (1 + Math.random() * 0.01);
      const low = open * (1 - Math.random() * 0.01);
      const close = open * (1 + (Math.random() - 0.5) * 0.005);
      const volume = Math.floor(Math.random() * 1000000) + 500000;
      
      data.push({
        date,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume
      });
    }
    
    return data;
  };

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const companySymbol = selectedCompany.trim().toUpperCase();
        const priceData = generateSampleData(companySymbol, 100);
        
        if (!validatePriceData(priceData)) {
          throw new Error('Invalid price data generated');
        }
        
        // Perform technical analysis
        const predictionConfig = getDefaultPredictionConfig();
        const analysisResult = await technicalAnalysisService.analyzeStock(
          companySymbol,
          priceData,
          predictionConfig
        );
        
        setAnalysis(analysisResult);
        
        // Run backtest
        const backtestConfig = getDefaultBacktestConfig();
        const backtestResult = await technicalAnalysisService.runBacktest(priceData, backtestConfig);
        setBacktestResult(backtestResult);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to perform technical analysis');
      } finally {
        setLoading(false);
      }
    };
    
    performAnalysis();
  }, [selectedCompany]);

  const companies = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
    { symbol: 'INFY', name: 'Infosys Ltd' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Performing technical analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800">Analysis Error</h3>
            <p className="mt-2 text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Technical Analysis Dashboard
          </h1>
          <p className="text-gray-600">
            Advanced stock analysis with technical indicators, predictions, and backtesting
          </p>
        </div>

        {/* Company Selector */}
        <div className="mb-6">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Select Company
          </label>
          <select
            id="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {companies.map((company) => (
              <option key={company.symbol} value={company.symbol}>
                {company.symbol} - {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'indicators', label: 'Technical Indicators' },
              { id: 'predictions', label: 'Price Predictions' },
              { id: 'signals', label: 'Trading Signals' },
              { id: 'backtest', label: 'Backtesting' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'indicators' && analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Price Chart with Indicators</h3>
                                 <StockLineChart
                   data={analysis.indicators.sma?.map(ma => ({
                     date: ma.date,
                     open: ma.value,
                     high: ma.value,
                     low: ma.value,
                     close: ma.value,
                     volume: 0
                   })) || []}
                   height={400}
                 />
              </div>

              {/* Indicator Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Indicator Summary</h3>
                <div className="space-y-4">
                  {analysis.indicators.rsi && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">RSI</span>
                      <span className={`font-bold ${
                        analysis.indicators.rsi.value > 70 ? 'text-red-600' :
                        analysis.indicators.rsi.value < 30 ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {analysis.indicators.rsi.value.toFixed(1)}
                      </span>
                    </div>
                  )}
                  
                  {analysis.indicators.macd && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">MACD Trend</span>
                      <span className={`font-bold ${
                        analysis.indicators.macd.trend === 'bullish' ? 'text-green-600' :
                        analysis.indicators.macd.trend === 'bearish' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {analysis.indicators.macd.trend}
                      </span>
                    </div>
                  )}
                  
                  {analysis.indicators.bollingerBands && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Upper Band</span>
                        <span className="font-bold text-gray-600">
                          ₹{analysis.indicators.bollingerBands.upper.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Middle Band</span>
                        <span className="font-bold text-gray-600">
                          ₹{analysis.indicators.bollingerBands.middle.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Lower Band</span>
                        <span className="font-bold text-gray-600">
                          ₹{analysis.indicators.bollingerBands.lower.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && analysis?.prediction && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Price Prediction</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{analysis.prediction.predictedPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Predicted Price</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{analysis.prediction.upperBound.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Upper Bound</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    ₹{analysis.prediction.lowerBound.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Lower Bound</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Confidence Level</span>
                  <span className="font-bold text-blue-600">
                    {(analysis.prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analysis.prediction.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <strong>Algorithm:</strong> {analysis.prediction.algorithm}
              </div>
            </div>
          )}

          {activeTab === 'signals' && analysis?.signal && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Trading Signal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    analysis.signal.type === 'buy' ? 'bg-green-50 border border-green-200' :
                    analysis.signal.type === 'sell' ? 'bg-red-50 border border-red-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        analysis.signal.type === 'buy' ? 'text-green-600' :
                        analysis.signal.type === 'sell' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {analysis.signal.type.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {analysis.signal.strength} signal
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Confidence</span>
                      <span className="font-bold text-blue-600">
                        {(analysis.signal.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.signal.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Signal Reasoning</h4>
                  <ul className="space-y-2">
                    {analysis.signal.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-sm text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backtest' && backtestResult && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Backtesting Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(backtestResult.totalReturn * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">Total Return</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(backtestResult.annualizedReturn * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">Annualized Return</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {(backtestResult.maxDrawdown * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">Max Drawdown</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {backtestResult.sharpeRatio.toFixed(3)}
                  </div>
                  <div className="text-sm text-gray-600">Sharpe Ratio</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Trading Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Trades</span>
                      <span className="font-medium">{backtestResult.totalTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Winning Trades</span>
                      <span className="font-medium text-green-600">{backtestResult.winningTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Losing Trades</span>
                      <span className="font-medium text-red-600">{backtestResult.losingTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate</span>
                      <span className="font-medium">{(backtestResult.winRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Capital Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Initial Capital</span>
                      <span className="font-medium">₹{backtestResult.initialCapital.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Final Capital</span>
                      <span className="font-medium">₹{backtestResult.finalCapital.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Profit</span>
                      <span className="font-medium text-green-600">
                        ₹{(backtestResult.finalCapital - backtestResult.initialCapital).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
