/**
 * Backtesting Engine
 * 
 * This module provides a comprehensive backtesting system to evaluate trading strategies
 * using historical data. It calculates key performance metrics and simulates trading.
 */

import {
  PriceDataPoint,
  BacktestResult,
  TradingSignal,
  PredictionConfig
} from './types';
import { generateTradingSignal } from './trading-signals';
import { getPrediction } from './predictions';

/**
 * Backtesting Strategy Configuration
 */
export interface BacktestConfig {
  initialCapital: number; // Starting capital
  positionSize: number; // Percentage of capital per trade (0-1)
  stopLoss: number; // Stop loss percentage (0-1)
  takeProfit: number; // Take profit percentage (0-1)
  maxPositions: number; // Maximum concurrent positions
  commission: number; // Commission per trade (percentage)
  slippage: number; // Slippage per trade (percentage)
  strategy: 'signal_based' | 'prediction_based' | 'hybrid';
  predictionConfig?: PredictionConfig;
}

/**
 * Position tracking for backtesting
 */
interface Position {
  symbol: string;
  entryDate: Date;
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  type: 'long' | 'short';
}

/**
 * Trade record for backtesting
 */
interface Trade {
  date: Date;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  pnl: number;
  reason: string;
}

/**
 * Run backtest on historical data
 */
export function runBacktest(
  data: PriceDataPoint[],
  config: BacktestConfig
): BacktestResult {
  if (data.length < 100) {
    throw new Error('Insufficient data for backtesting');
  }

  const startDate = data[0].date;
  const endDate = data[data.length - 1].date;
  let capital = config.initialCapital;
  let maxCapital = capital;
  let maxDrawdown = 0;
  
  const positions: Position[] = [];
  const trades: Trade[] = [];
  const dailyReturns: number[] = [];
  
  // Track daily portfolio value
  const portfolioValues: { date: Date; value: number }[] = [];
  
  for (let i = 50; i < data.length; i++) { // Start after enough data for indicators
    const currentData = data.slice(0, i + 1);
    const currentPrice = data[i].close;
    const currentDate = data[i].date;
    
    // Calculate current portfolio value
    let portfolioValue = capital;
    for (const position of positions) {
      const unrealizedPnL = (currentPrice - position.entryPrice) * position.quantity;
      portfolioValue += unrealizedPnL;
    }
    
    portfolioValues.push({ date: currentDate, value: portfolioValue });
    
    // Update max capital and drawdown
    if (portfolioValue > maxCapital) {
      maxCapital = portfolioValue;
    }
    const drawdown = (maxCapital - portfolioValue) / maxCapital;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
    
    // Check stop losses and take profits
    const closedPositions = checkStopLossTakeProfit(positions, currentPrice, currentDate, trades);
    capital += closedPositions.reduce((sum, pnl) => sum + pnl, 0);
    
    // Generate trading signals
    if (positions.length < config.maxPositions) {
      const signal = generateTradingSignal(currentData);
      
      if (signal.type === 'buy' && signal.strength !== 'weak') {
        const position = openLongPosition(
          currentPrice,
          currentDate,
          capital,
          config,
          signal
        );
        if (position) {
          positions.push(position);
          const tradeCost = position.quantity * currentPrice * (1 + config.commission + config.slippage);
          capital -= tradeCost;
          
          trades.push({
            date: currentDate,
            type: 'buy',
            price: currentPrice,
            quantity: position.quantity,
            pnl: 0,
            reason: `Signal: ${signal.type} (${signal.strength})`
          });
        }
      } else if (signal.type === 'sell' && signal.strength !== 'weak') {
        // Close long positions
        const closedPositions = closeAllPositions(positions, currentPrice, currentDate, trades, 'sell signal');
        capital += closedPositions.reduce((sum, pnl) => sum + pnl, 0);
      }
    }
    
    // Calculate daily return
    if (i > 50) {
      const prevValue = portfolioValues[portfolioValues.length - 2]?.value || capital;
      const dailyReturn = (portfolioValue - prevValue) / prevValue;
      dailyReturns.push(dailyReturn);
    }
  }
  
  // Close any remaining positions
  const finalPrice = data[data.length - 1].close;
  const finalDate = data[data.length - 1].date;
  const remainingPnL = closeAllPositions(positions, finalPrice, finalDate, trades, 'backtest end');
  capital += remainingPnL.reduce((sum, pnl) => sum + pnl, 0);
  
  // Calculate performance metrics
  const totalReturn = (capital - config.initialCapital) / config.initialCapital;
  const annualizedReturn = calculateAnnualizedReturn(startDate, endDate, totalReturn);
  const sharpeRatio = calculateSharpeRatio(dailyReturns);
  const winRate = calculateWinRate(trades);
  
  return {
    startDate,
    endDate,
    initialCapital: config.initialCapital,
    finalCapital: capital,
    totalReturn,
    annualizedReturn,
    maxDrawdown,
    sharpeRatio,
    totalTrades: trades.length,
    winningTrades: trades.filter(t => t.pnl > 0).length,
    losingTrades: trades.filter(t => t.pnl < 0).length,
    winRate,
    trades
  };
}

/**
 * Check stop losses and take profits for all positions
 */
function checkStopLossTakeProfit(
  positions: Position[],
  currentPrice: number,
  currentDate: Date,
  trades: Trade[]
): number[] {
  const closedPnLs: number[] = [];
  const positionsToRemove: number[] = [];
  
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    let shouldClose = false;
    let closeReason = '';
    
    if (position.type === 'long') {
      if (currentPrice <= position.stopLoss) {
        shouldClose = true;
        closeReason = 'stop loss';
      } else if (currentPrice >= position.takeProfit) {
        shouldClose = true;
        closeReason = 'take profit';
      }
    }
    
    if (shouldClose) {
      const pnl = (currentPrice - position.entryPrice) * position.quantity;
      const tradeCost = position.quantity * currentPrice * (1 + 0.001); // Commission
      const netPnL = pnl - tradeCost;
      
      closedPnLs.push(netPnL);
      positionsToRemove.push(i);
      
      trades.push({
        date: currentDate,
        type: 'sell',
        price: currentPrice,
        quantity: position.quantity,
        pnl: netPnL,
        reason: closeReason
      });
    }
  }
  
  // Remove closed positions (in reverse order to maintain indices)
  for (let i = positionsToRemove.length - 1; i >= 0; i--) {
    positions.splice(positionsToRemove[i], 1);
  }
  
  return closedPnLs;
}

/**
 * Open a long position
 */
function openLongPosition(
  price: number,
  date: Date,
  capital: number,
  config: BacktestConfig,
  signal: TradingSignal
): Position | null {
  const positionValue = capital * config.positionSize;
  const quantity = Math.floor(positionValue / price);
  
  if (quantity <= 0) return null;
  
  const stopLoss = price * (1 - config.stopLoss);
  const takeProfit = price * (1 + config.takeProfit);
  
  return {
    symbol: 'STOCK',
    entryDate: date,
    entryPrice: price,
    quantity,
    stopLoss,
    takeProfit,
    type: 'long'
  };
}

/**
 * Close all positions
 */
function closeAllPositions(
  positions: Position[],
  price: number,
  date: Date,
  trades: Trade[],
  reason: string
): number[] {
  const closedPnLs: number[] = [];
  
  for (const position of positions) {
    const pnl = (price - position.entryPrice) * position.quantity;
    const tradeCost = position.quantity * price * (1 + 0.001); // Commission
    const netPnL = pnl - tradeCost;
    
    closedPnLs.push(netPnL);
    
    trades.push({
      date,
      type: 'sell',
      price,
      quantity: position.quantity,
      pnl: netPnL,
      reason
    });
  }
  
  positions.length = 0; // Clear all positions
  return closedPnLs;
}

/**
 * Calculate annualized return
 */
function calculateAnnualizedReturn(startDate: Date, endDate: Date, totalReturn: number): number {
  const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const years = days / 365.25;
  
  if (years <= 0) return 0;
  
  return Math.pow(1 + totalReturn, 1 / years) - 1;
}

/**
 * Calculate Sharpe ratio
 */
function calculateSharpeRatio(returns: number[]): number {
  if (returns.length === 0) return 0;
  
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  // Assuming risk-free rate of 0 for simplicity
  return meanReturn / stdDev * Math.sqrt(252); // Annualized
}

/**
 * Calculate win rate
 */
function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  
  const winningTrades = trades.filter(t => t.pnl > 0).length;
  return winningTrades / trades.length;
}

/**
 * Run multiple backtests with different configurations
 */
export function runBacktestComparison(
  data: PriceDataPoint[],
  configs: BacktestConfig[]
): { config: BacktestConfig; result: BacktestResult }[] {
  return configs.map(config => ({
    config,
    result: runBacktest(data, config)
  }));
}

/**
 * Optimize strategy parameters using grid search
 */
export function optimizeStrategy(
  data: PriceDataPoint[],
  baseConfig: BacktestConfig,
  paramRanges: {
    positionSize?: number[];
    stopLoss?: number[];
    takeProfit?: number[];
  }
): { config: BacktestConfig; result: BacktestResult } {
  const configs: BacktestConfig[] = [];
  
  const positionSizes = paramRanges.positionSize || [0.1, 0.2, 0.3];
  const stopLosses = paramRanges.stopLoss || [0.05, 0.1, 0.15];
  const takeProfits = paramRanges.takeProfit || [0.1, 0.2, 0.3];
  
  for (const positionSize of positionSizes) {
    for (const stopLoss of stopLosses) {
      for (const takeProfit of takeProfits) {
        configs.push({
          ...baseConfig,
          positionSize,
          stopLoss,
          takeProfit
        });
      }
    }
  }
  
  const results = runBacktestComparison(data, configs);
  
  // Find best configuration based on Sharpe ratio
  const bestResult = results.reduce((best, current) => {
    return current.result.sharpeRatio > best.result.sharpeRatio ? current : best;
  });
  
  return bestResult;
}

/**
 * Generate backtest report
 */
export function generateBacktestReport(result: BacktestResult): string {
  const report = `
Backtest Report
===============

Period: ${result.startDate.toLocaleDateString()} - ${result.endDate.toLocaleDateString()}
Initial Capital: $${result.initialCapital.toLocaleString()}
Final Capital: $${result.finalCapital.toLocaleString()}

Performance Metrics:
- Total Return: ${(result.totalReturn * 100).toFixed(2)}%
- Annualized Return: ${(result.annualizedReturn * 100).toFixed(2)}%
- Maximum Drawdown: ${(result.maxDrawdown * 100).toFixed(2)}%
- Sharpe Ratio: ${result.sharpeRatio.toFixed(3)}

Trading Statistics:
- Total Trades: ${result.totalTrades}
- Winning Trades: ${result.winningTrades}
- Losing Trades: ${result.losingTrades}
- Win Rate: ${(result.winRate * 100).toFixed(1)}%

Risk Analysis:
- Average Win: $${calculateAverageWin(result.trades).toFixed(2)}
- Average Loss: $${calculateAverageLoss(result.trades).toFixed(2)}
- Profit Factor: ${calculateProfitFactor(result.trades).toFixed(2)}
- Maximum Consecutive Losses: ${calculateMaxConsecutiveLosses(result.trades)}
  `;
  
  return report;
}

/**
 * Calculate average win
 */
function calculateAverageWin(trades: Trade[]): number {
  const winningTrades = trades.filter(t => t.pnl > 0);
  if (winningTrades.length === 0) return 0;
  
  return winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length;
}

/**
 * Calculate average loss
 */
function calculateAverageLoss(trades: Trade[]): number {
  const losingTrades = trades.filter(t => t.pnl < 0);
  if (losingTrades.length === 0) return 0;
  
  return losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length;
}

/**
 * Calculate profit factor
 */
function calculateProfitFactor(trades: Trade[]): number {
  const totalProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const totalLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  
  return totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
}

/**
 * Calculate maximum consecutive losses
 */
function calculateMaxConsecutiveLosses(trades: Trade[]): number {
  let maxConsecutive = 0;
  let currentConsecutive = 0;
  
  for (const trade of trades) {
    if (trade.pnl < 0) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 0;
    }
  }
  
  return maxConsecutive;
}
