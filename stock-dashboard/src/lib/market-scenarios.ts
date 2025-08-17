// Market Scenarios Data
// This file contains predefined market scenarios for generating realistic stock data

import { MarketScenario } from '@/types/stock';

export const MARKET_SCENARIOS: Record<string, MarketScenario> = {
  normal: {
    name: 'Normal Market',
    description: 'Typical market conditions with moderate volatility and balanced trends',
    volatility: 0.02,
    trend: 0.0,
    volumeMultiplier: 1.0,
  },
  bull_market: {
    name: 'Bull Market',
    description: 'Strong upward trend with moderate volatility',
    volatility: 0.025,
    trend: 0.3,
    volumeMultiplier: 1.2,
  },
  bear_market: {
    name: 'Bear Market',
    description: 'Downward trend with increased volatility',
    volatility: 0.035,
    trend: -0.25,
    volumeMultiplier: 1.3,
  },
  market_crash: {
    name: 'Market Crash',
    description: 'Severe downward movement with high volatility',
    volatility: 0.06,
    trend: -0.5,
    volumeMultiplier: 2.0,
  },
  high_volatility: {
    name: 'High Volatility',
    description: 'Extreme price swings with uncertain direction',
    volatility: 0.05,
    trend: 0.0,
    volumeMultiplier: 1.5,
  },
  sideways: {
    name: 'Sideways Market',
    description: 'Range-bound trading with low volatility',
    volatility: 0.015,
    trend: 0.0,
    volumeMultiplier: 0.8,
  },
  recovery: {
    name: 'Market Recovery',
    description: 'Gradual upward movement after a decline',
    volatility: 0.03,
    trend: 0.2,
    volumeMultiplier: 1.1,
  },
  earnings_season: {
    name: 'Earnings Season',
    description: 'Increased volatility during earnings announcements',
    volatility: 0.04,
    trend: 0.1,
    volumeMultiplier: 1.4,
  },
  covid_crisis: {
    name: 'COVID Crisis',
    description: 'High uncertainty and extreme market movements',
    volatility: 0.08,
    trend: -0.3,
    volumeMultiplier: 2.5,
  },
  tech_bubble: {
    name: 'Tech Bubble',
    description: 'Rapid growth in technology stocks',
    volatility: 0.045,
    trend: 0.4,
    volumeMultiplier: 1.8,
  },
};

// Helper functions
export const getScenario = (name: string): MarketScenario | undefined => {
  return MARKET_SCENARIOS[name];
};

export const getScenarioNames = (): string[] => {
  return Object.keys(MARKET_SCENARIOS);
};

export const createCustomScenario = (
  name: string,
  volatility: number,
  trend: number,
  volumeMultiplier: number,
  description?: string
): MarketScenario => {
  return {
    name,
    description: description || `Custom scenario: ${name}`,
    volatility: Math.max(0.01, Math.min(0.1, volatility)), // Clamp between 0.01 and 0.1
    trend: Math.max(-1.0, Math.min(1.0, trend)), // Clamp between -1.0 and 1.0
    volumeMultiplier: Math.max(0.5, Math.min(3.0, volumeMultiplier)), // Clamp between 0.5 and 3.0
  };
};

export const validateScenario = (scenario: MarketScenario): boolean => {
  return (
    scenario.volatility >= 0.01 &&
    scenario.volatility <= 0.1 &&
    scenario.trend >= -1.0 &&
    scenario.trend <= 1.0 &&
    scenario.volumeMultiplier >= 0.5 &&
    scenario.volumeMultiplier <= 3.0
  );
};

export const getScenarioDescription = (name: string): string => {
  const scenario = MARKET_SCENARIOS[name];
  return scenario ? scenario.description : 'Unknown scenario';
};

export const compareScenarios = (scenario1: string, scenario2: string): {
  volatilityDiff: number;
  trendDiff: number;
  volumeDiff: number;
} => {
  const s1 = MARKET_SCENARIOS[scenario1];
  const s2 = MARKET_SCENARIOS[scenario2];
  
  if (!s1 || !s2) {
    throw new Error('Invalid scenario name');
  }
  
  return {
    volatilityDiff: s1.volatility - s2.volatility,
    trendDiff: s1.trend - s2.trend,
    volumeDiff: s1.volumeMultiplier - s2.volumeMultiplier,
  };
};
