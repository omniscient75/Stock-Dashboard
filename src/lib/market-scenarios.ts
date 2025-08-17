// Market scenarios for realistic mock data generation
// These scenarios simulate different market conditions and trends

import { MarketScenario } from '@/types/stock';

// Predefined market scenarios
export const MARKET_SCENARIOS: Record<string, MarketScenario> = {
  // Normal market conditions
  'normal': {
    name: 'Normal Market',
    description: 'Typical market conditions with moderate volatility and slight upward trend',
    volatility: 0.020, // 2% daily volatility
    trend: 0.001, // 0.1% daily growth
    volumeMultiplier: 1.0,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // Bull market - strong upward trend
  'bull_market': {
    name: 'Bull Market',
    description: 'Strong upward trend with moderate volatility',
    volatility: 0.025, // 2.5% daily volatility
    trend: 0.003, // 0.3% daily growth
    volumeMultiplier: 1.2, // Higher volume in bull markets
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // Bear market - downward trend
  'bear_market': {
    name: 'Bear Market',
    description: 'Downward trend with increased volatility',
    volatility: 0.035, // 3.5% daily volatility
    trend: -0.002, // -0.2% daily decline
    volumeMultiplier: 1.1, // Slightly higher volume in bear markets
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // Market crash - severe decline
  'market_crash': {
    name: 'Market Crash',
    description: 'Severe market decline with high volatility',
    volatility: 0.050, // 5% daily volatility
    trend: -0.008, // -0.8% daily decline
    volumeMultiplier: 2.0, // Much higher volume during crashes
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // High volatility period
  'high_volatility': {
    name: 'High Volatility',
    description: 'High volatility with no clear trend',
    volatility: 0.040, // 4% daily volatility
    trend: 0.000, // No trend
    volumeMultiplier: 1.5, // Higher volume due to uncertainty
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // Sideways market
  'sideways': {
    name: 'Sideways Market',
    description: 'Low volatility with no clear trend',
    volatility: 0.015, // 1.5% daily volatility
    trend: 0.000, // No trend
    volumeMultiplier: 0.8, // Lower volume in sideways markets
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // Recovery market
  'recovery': {
    name: 'Market Recovery',
    description: 'Recovery from a crash with decreasing volatility',
    volatility: 0.030, // 3% daily volatility (decreasing)
    trend: 0.004, // 0.4% daily growth
    volumeMultiplier: 1.3, // Good volume during recovery
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // Earnings season
  'earnings_season': {
    name: 'Earnings Season',
    description: 'Higher volatility during earnings announcements',
    volatility: 0.030, // 3% daily volatility
    trend: 0.002, // 0.2% daily growth
    volumeMultiplier: 1.4, // Higher volume during earnings
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // COVID-19 like crisis
  'covid_crisis': {
    name: 'COVID-19 Crisis',
    description: 'Simulates market conditions similar to COVID-19 crash',
    volatility: 0.060, // 6% daily volatility
    trend: -0.015, // -1.5% daily decline
    volumeMultiplier: 2.5, // Very high volume during crisis
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },

  // Tech bubble burst
  'tech_bubble': {
    name: 'Tech Bubble Burst',
    description: 'Simulates the dot-com bubble burst scenario',
    volatility: 0.045, // 4.5% daily volatility
    trend: -0.005, // -0.5% daily decline
    volumeMultiplier: 1.8, // High volume during bubble burst
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  },
};

// Get scenario by name
export function getScenario(name: string): MarketScenario | undefined {
  return MARKET_SCENARIOS[name.toLowerCase()];
}

// Get all scenario names
export function getScenarioNames(): string[] {
  return Object.keys(MARKET_SCENARIOS);
}

// Create custom scenario
export function createCustomScenario(
  name: string,
  volatility: number,
  trend: number,
  volumeMultiplier: number = 1.0,
  startDate: Date = new Date('2024-01-01'),
  endDate: Date = new Date('2024-12-31')
): MarketScenario {
  return {
    name,
    description: `Custom scenario: ${volatility * 100}% volatility, ${trend * 100}% daily trend`,
    volatility,
    trend,
    volumeMultiplier,
    startDate,
    endDate,
  };
}

// Validate scenario parameters
export function validateScenario(scenario: MarketScenario): string[] {
  const errors: string[] = [];

  if (scenario.volatility < 0 || scenario.volatility > 0.1) {
    errors.push('Volatility must be between 0% and 10%');
  }

  if (scenario.trend < -0.05 || scenario.trend > 0.05) {
    errors.push('Daily trend must be between -5% and +5%');
  }

  if (scenario.volumeMultiplier < 0.1 || scenario.volumeMultiplier > 5) {
    errors.push('Volume multiplier must be between 0.1x and 5x');
  }

  if (scenario.startDate >= scenario.endDate) {
    errors.push('Start date must be before end date');
  }

  return errors;
}

// Get scenario description
export function getScenarioDescription(scenario: MarketScenario): string {
  const volatilityPercent = (scenario.volatility * 100).toFixed(1);
  const trendPercent = (scenario.trend * 100).toFixed(2);
  const volumeText = scenario.volumeMultiplier === 1 
    ? 'normal' 
    : scenario.volumeMultiplier > 1 
      ? `${scenario.volumeMultiplier}x higher` 
      : `${scenario.volumeMultiplier}x lower`;

  return `${scenario.name}: ${volatilityPercent}% daily volatility, ${trendPercent}% daily trend, ${volumeText} volume`;
}

// Scenario comparison
export function compareScenarios(scenario1: MarketScenario, scenario2: MarketScenario): {
  volatilityDiff: number;
  trendDiff: number;
  volumeDiff: number;
} {
  return {
    volatilityDiff: scenario1.volatility - scenario2.volatility,
    trendDiff: scenario1.trend - scenario2.trend,
    volumeDiff: scenario1.volumeMultiplier - scenario2.volumeMultiplier,
  };
}
