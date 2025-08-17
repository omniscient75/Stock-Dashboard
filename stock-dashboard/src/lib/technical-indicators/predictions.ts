/**
 * Price Prediction Models
 * 
 * This module implements various prediction algorithms for stock price forecasting.
 * Includes linear regression, polynomial regression, and basic time series analysis.
 */

import { PriceDataPoint, PredictionConfig, PricePrediction } from './types';

/**
 * Linear Regression Prediction
 * 
 * Uses simple linear regression to predict future prices based on historical trend.
 * Formula: y = mx + b
 * 
 * Why Linear Regression? It's simple, fast, and works well for trending markets.
 * However, it doesn't capture complex patterns or reversals.
 */
export function linearRegressionPrediction(
  data: PriceDataPoint[],
  config: PredictionConfig
): PricePrediction {
  if (data.length < 10) {
    throw new Error('Insufficient data for prediction');
  }

  const n = data.length;
  const prices = data.map((point, index) => ({ x: index, y: point.close }));
  
  // Calculate means
  const meanX = prices.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = prices.reduce((sum, p) => sum + p.y, 0) / n;
  
  // Calculate slope (m) and intercept (b)
  let numerator = 0;
  let denominator = 0;
  
  for (const point of prices) {
    numerator += (point.x - meanX) * (point.y - meanY);
    denominator += Math.pow(point.x - meanX, 2);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;
  
  // Calculate R-squared for confidence
  let ssRes = 0;
  let ssTot = 0;
  
  for (const point of prices) {
    const predicted = slope * point.x + intercept;
    ssRes += Math.pow(point.y - predicted, 2);
    ssTot += Math.pow(point.y - meanY, 2);
  }
  
  const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
  const confidence = Math.max(0, Math.min(1, rSquared));
  
  // Predict future price
  const futureX = n + config.horizon;
  const predictedPrice = slope * futureX + intercept;
  
  // Calculate confidence interval
  const standardError = Math.sqrt(ssRes / (n - 2));
  const marginOfError = standardError * 1.96; // 95% confidence interval
  
  return {
    date: new Date(Date.now() + config.horizon * 24 * 60 * 60 * 1000),
    predictedPrice: Number(predictedPrice.toFixed(2)),
    confidence: Number(confidence.toFixed(3)),
    upperBound: Number((predictedPrice + marginOfError).toFixed(2)),
    lowerBound: Number((predictedPrice - marginOfError).toFixed(2)),
    algorithm: 'linear_regression'
  };
}

/**
 * Polynomial Regression Prediction
 * 
 * Uses polynomial regression to capture non-linear trends in price data.
 * Formula: y = ax³ + bx² + cx + d
 * 
 * Why Polynomial Regression? It can capture more complex patterns than linear regression,
 * including curves and reversals. However, it can overfit with high degrees.
 */
export function polynomialRegressionPrediction(
  data: PriceDataPoint[],
  config: PredictionConfig,
  degree: number = 3
): PricePrediction {
  if (data.length < degree + 5) {
    throw new Error('Insufficient data for polynomial regression');
  }

  const n = data.length;
  const prices = data.map((point, index) => ({ x: index, y: point.close }));
  
  // Create polynomial features
  const features: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let d = 0; d <= degree; d++) {
      row.push(Math.pow(i, d));
    }
    features.push(row);
  }
  
  // Solve using least squares (simplified)
  const coefficients = solvePolynomial(features, prices.map(p => p.y));
  
  // Calculate predicted values and R-squared
  let ssRes = 0;
  let ssTot = 0;
  const meanY = prices.reduce((sum, p) => sum + p.y, 0) / n;
  
  for (let i = 0; i < n; i++) {
    let predicted = 0;
    for (let d = 0; d <= degree; d++) {
      predicted += coefficients[d] * Math.pow(i, d);
    }
    
    ssRes += Math.pow(prices[i].y - predicted, 2);
    ssTot += Math.pow(prices[i].y - meanY, 2);
  }
  
  const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
  const confidence = Math.max(0, Math.min(1, rSquared));
  
  // Predict future price
  const futureX = n + config.horizon;
  let predictedPrice = 0;
  for (let d = 0; d <= degree; d++) {
    predictedPrice += coefficients[d] * Math.pow(futureX, d);
  }
  
  // Calculate confidence interval
  const standardError = Math.sqrt(ssRes / (n - degree - 1));
  const marginOfError = standardError * 1.96;
  
  return {
    date: new Date(Date.now() + config.horizon * 24 * 60 * 60 * 1000),
    predictedPrice: Number(predictedPrice.toFixed(2)),
    confidence: Number(confidence.toFixed(3)),
    upperBound: Number((predictedPrice + marginOfError).toFixed(2)),
    lowerBound: Number((predictedPrice - marginOfError).toFixed(2)),
    algorithm: `polynomial_degree_${degree}`
  };
}

/**
 * Moving Average Crossover Prediction
 * 
 * Uses the relationship between short and long moving averages to predict trend changes.
 * 
 * Why MA Crossover? It's a popular technical analysis method that identifies
 * trend reversals and momentum shifts.
 */
export function movingAverageCrossoverPrediction(
  data: PriceDataPoint[],
  config: PredictionConfig,
  shortPeriod: number = 10,
  longPeriod: number = 30
): PricePrediction {
  if (data.length < longPeriod + 5) {
    throw new Error('Insufficient data for moving average crossover');
  }

  // Calculate moving averages
  const shortMA = calculateSMA(data, { period: shortPeriod, source: 'close' });
  const longMA = calculateSMA(data, { period: longPeriod, source: 'close' });
  
  if (shortMA.length === 0 || longMA.length === 0) {
    throw new Error('Failed to calculate moving averages');
  }
  
  // Get latest values
  const latestShort = shortMA[shortMA.length - 1];
  const latestLong = longMA[longMA.length - 1];
  const currentPrice = data[data.length - 1].close;
  
  // Calculate trend strength
  const trendStrength = Math.abs(latestShort.value - latestLong.value) / currentPrice;
  const isBullish = latestShort.value > latestLong.value;
  
  // Predict based on trend continuation
  const trendMultiplier = isBullish ? 1 + trendStrength : 1 - trendStrength;
  const predictedPrice = currentPrice * trendMultiplier;
  
  // Calculate confidence based on trend consistency
  let consistentTrend = 0;
  const minLength = Math.min(shortMA.length, longMA.length);
  
  for (let i = Math.max(0, minLength - 5); i < minLength; i++) {
    const shortIndex = shortMA.length - minLength + i;
    const longIndex = longMA.length - minLength + i;
    
    if (shortIndex >= 0 && longIndex >= 0) {
      const shortVal = shortMA[shortIndex].value;
      const longVal = longMA[longIndex].value;
      
      if ((isBullish && shortVal > longVal) || (!isBullish && shortVal < longVal)) {
        consistentTrend++;
      }
    }
  }
  
  const confidence = Math.min(1, consistentTrend / 5);
  const marginOfError = currentPrice * trendStrength * 0.5;
  
  return {
    date: new Date(Date.now() + config.horizon * 24 * 60 * 60 * 1000),
    predictedPrice: Number(predictedPrice.toFixed(2)),
    confidence: Number(confidence.toFixed(3)),
    upperBound: Number((predictedPrice + marginOfError).toFixed(2)),
    lowerBound: Number((predictedPrice - marginOfError).toFixed(2)),
    algorithm: 'moving_average_crossover'
  };
}

/**
 * RSI-Based Prediction
 * 
 * Uses RSI momentum to predict potential price reversals and continuations.
 * 
 * Why RSI Prediction? RSI helps identify overbought/oversold conditions that
 * often precede price reversals or continuations.
 */
export function rsiBasedPrediction(
  data: PriceDataPoint[],
  config: PredictionConfig
): PricePrediction {
  if (data.length < 20) {
    throw new Error('Insufficient data for RSI prediction');
  }

  // Calculate RSI
  const rsiData = calculateRSI(data);
  
  if (rsiData.length === 0) {
    throw new Error('Failed to calculate RSI');
  }
  
  const latestRSI = rsiData[rsiData.length - 1];
  const currentPrice = data[data.length - 1].close;
  
  // Predict based on RSI position
  let predictedPrice = currentPrice;
  let confidence = 0.5;
  
  if (latestRSI.signal === 'overbought') {
    // Expect price to decrease or consolidate
    predictedPrice = currentPrice * 0.98; // 2% decrease
    confidence = 0.6;
  } else if (latestRSI.signal === 'oversold') {
    // Expect price to increase or consolidate
    predictedPrice = currentPrice * 1.02; // 2% increase
    confidence = 0.6;
  } else {
    // Neutral RSI - expect continuation with slight trend
    const rsiTrend = latestRSI.value > 50 ? 1.01 : 0.99;
    predictedPrice = currentPrice * rsiTrend;
    confidence = 0.4;
  }
  
  // Adjust confidence based on RSI strength
  if (latestRSI.strength === 'strong') {
    confidence *= 1.2;
  } else if (latestRSI.strength === 'weak') {
    confidence *= 0.8;
  }
  
  confidence = Math.min(1, confidence);
  
  // Calculate margin of error based on RSI volatility
  const rsiVolatility = Math.abs(latestRSI.value - 50) / 50;
  const marginOfError = currentPrice * rsiVolatility * 0.1;
  
  return {
    date: new Date(Date.now() + config.horizon * 24 * 60 * 60 * 1000),
    predictedPrice: Number(predictedPrice.toFixed(2)),
    confidence: Number(confidence.toFixed(3)),
    upperBound: Number((predictedPrice + marginOfError).toFixed(2)),
    lowerBound: Number((predictedPrice - marginOfError).toFixed(2)),
    algorithm: 'rsi_momentum'
  };
}

/**
 * Ensemble Prediction
 * 
 * Combines multiple prediction models to create a more robust forecast.
 * Uses weighted average based on historical accuracy.
 * 
 * Why Ensemble? It reduces overfitting and improves prediction accuracy
 * by combining the strengths of different algorithms.
 */
export function ensemblePrediction(
  data: PriceDataPoint[],
  config: PredictionConfig
): PricePrediction {
  const predictions: PricePrediction[] = [];
  
  try {
    predictions.push(linearRegressionPrediction(data, config));
  } catch (error) {
    console.warn('Linear regression prediction failed:', error);
  }
  
  try {
    predictions.push(polynomialRegressionPrediction(data, config, 2));
  } catch (error) {
    console.warn('Polynomial regression prediction failed:', error);
  }
  
  try {
    predictions.push(movingAverageCrossoverPrediction(data, config));
  } catch (error) {
    console.warn('MA crossover prediction failed:', error);
  }
  
  try {
    predictions.push(rsiBasedPrediction(data, config));
  } catch (error) {
    console.warn('RSI prediction failed:', error);
  }
  
  if (predictions.length === 0) {
    throw new Error('All prediction models failed');
  }
  
  // Calculate weighted average based on confidence
  let totalWeight = 0;
  let weightedSum = 0;
  let weightedConfidence = 0;
  
  for (const pred of predictions) {
    const weight = pred.confidence;
    totalWeight += weight;
    weightedSum += pred.predictedPrice * weight;
    weightedConfidence += pred.confidence * weight;
  }
  
  const ensemblePrice = weightedSum / totalWeight;
  const ensembleConfidence = weightedConfidence / totalWeight;
  
  // Calculate ensemble bounds
  const upperBounds = predictions.map(p => p.upperBound);
  const lowerBounds = predictions.map(p => p.lowerBound);
  
  const ensembleUpper = Math.max(...upperBounds);
  const ensembleLower = Math.min(...lowerBounds);
  
  return {
    date: new Date(Date.now() + config.horizon * 24 * 60 * 60 * 1000),
    predictedPrice: Number(ensemblePrice.toFixed(2)),
    confidence: Number(ensembleConfidence.toFixed(3)),
    upperBound: Number(ensembleUpper.toFixed(2)),
    lowerBound: Number(ensembleLower.toFixed(2)),
    algorithm: 'ensemble'
  };
}

/**
 * Helper function to solve polynomial regression using least squares
 */
function solvePolynomial(features: number[][], targets: number[]): number[] {
  // Simplified polynomial solver using normal equations
  const n = features.length;
  const degree = features[0].length - 1;
  
  // Create normal equations matrix
  const matrix: number[][] = [];
  const vector: number[] = [];
  
  for (let i = 0; i <= degree; i++) {
    matrix[i] = [];
    vector[i] = 0;
    
    for (let j = 0; j <= degree; j++) {
      matrix[i][j] = 0;
      for (let k = 0; k < n; k++) {
        matrix[i][j] += features[k][i] * features[k][j];
      }
    }
    
    for (let k = 0; k < n; k++) {
      vector[i] += features[k][i] * targets[k];
    }
  }
  
  // Solve using Gaussian elimination (simplified)
  return solveLinearSystem(matrix, vector);
}

/**
 * Helper function to solve linear system using Gaussian elimination
 */
function solveLinearSystem(matrix: number[][], vector: number[]): number[] {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [...row, vector[i]]);
  
  // Forward elimination
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }
  
  // Back substitution
  const solution = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += augmented[i][j] * solution[j];
    }
    solution[i] = (augmented[i][n] - sum) / augmented[i][i];
  }
  
  return solution;
}

// Import the calculateSMA and calculateRSI functions
import { calculateSMA, calculateRSI } from './calculators';

/**
 * Get prediction based on algorithm type
 */
export function getPrediction(
  data: PriceDataPoint[],
  config: PredictionConfig
): PricePrediction {
  switch (config.algorithm) {
    case 'linear':
      return linearRegressionPrediction(data, config);
    case 'polynomial':
      return polynomialRegressionPrediction(data, config);
    case 'lstm':
      // For now, use ensemble as LSTM placeholder
      return ensemblePrediction(data, config);
    case 'ensemble':
    default:
      return ensemblePrediction(data, config);
  }
}
