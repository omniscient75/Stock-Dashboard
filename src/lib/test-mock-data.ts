// Test script for mock data generator
// This file demonstrates how to use the mock data generator with different scenarios

import { MockDataGenerator, FinancialDataValidator } from './mock-data-generator';
import { getCompanyBySymbol } from './indian-companies';
import { getScenario, getScenarioNames, createCustomScenario } from './market-scenarios';
import { OHLCVData, MockDataOptions } from '@/types/stock';

// Test function to demonstrate the mock data generator
export async function testMockDataGenerator() {
  console.log('🧪 Testing Mock Data Generator...\n');

  // Create generator with fixed seed for reproducible results
  const generator = new MockDataGenerator(12345);

  // Test 1: Generate data for a single company
  console.log('📊 Test 1: Single Company Data Generation');
  const tcs = getCompanyBySymbol('TCS');
  if (tcs) {
    const options: MockDataOptions = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      scenario: getScenario('normal'),
      includeWeekends: false,
    };

    const tcsData = generator.generateHistoricalData(tcs, options);
    console.log(`✅ Generated ${tcsData.length} days of data for ${tcs.symbol}`);
    console.log(`📈 Starting price: ₹${tcsData[0].open}`);
    console.log(`📉 Ending price: ₹${tcsData[tcsData.length - 1].close}`);
    
    // Analyze the data
    const analysis = generator.analyzeData(tcsData);
    console.log('📊 Data Analysis:');
    console.log(`   - Average Volume: ${analysis.avgVolume.toLocaleString()}`);
    console.log(`   - Average Change: ${analysis.avgChangePercent}%`);
    console.log(`   - Max Gain: ${analysis.maxGain}%`);
    console.log(`   - Max Loss: ${analysis.maxLoss}%`);
    console.log(`   - Volatility: ${analysis.volatility}%\n`);
  }

  // Test 2: Different market scenarios
  console.log('🎭 Test 2: Market Scenarios Comparison');
  const scenarios = ['normal', 'bull_market', 'bear_market', 'market_crash'];
  const testSymbol = 'RELIANCE';
  const company = getCompanyBySymbol(testSymbol);

  if (company) {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    for (const scenarioName of scenarios) {
      const scenario = getScenario(scenarioName);
      if (scenario) {
        const options: MockDataOptions = {
          startDate,
          endDate,
          scenario,
          includeWeekends: false,
        };

        const data = generator.generateHistoricalData(company, options);
        const analysis = generator.analyzeData(data);
        const startPrice = data[0].open;
        const endPrice = data[data.length - 1].close;
        const totalReturn = ((endPrice - startPrice) / startPrice) * 100;

        console.log(`📈 ${scenario.name}:`);
        console.log(`   - Total Return: ${totalReturn.toFixed(2)}%`);
        console.log(`   - Volatility: ${analysis.volatility}%`);
        console.log(`   - Avg Volume: ${(analysis.avgVolume / 1000000).toFixed(1)}M shares`);
      }
    }
    console.log('');
  }

  // Test 3: Data validation
  console.log('✅ Test 3: Data Validation');
  const testData: OHLCVData = {
    date: new Date(),
    open: 100,
    high: 105,
    low: 98,
    close: 102,
    volume: 1000000,
  };

  const validationErrors = FinancialDataValidator.validateOHLCV(testData);
  if (validationErrors.length === 0) {
    console.log('✅ Sample data passes validation');
  } else {
    console.log('❌ Validation errors:', validationErrors);
  }

  // Test invalid data
  const invalidData: OHLCVData = {
    date: new Date(),
    open: 100,
    high: 95, // High is less than open - invalid!
    low: 98,
    close: 102,
    volume: 1000000,
  };

  const invalidErrors = FinancialDataValidator.validateOHLCV(invalidData);
  console.log('❌ Invalid data errors:', invalidErrors);
  console.log('');

  // Test 4: Multi-company data generation
  console.log('🏢 Test 4: Multi-Company Data Generation');
  const symbols = ['TCS', 'INFY', 'HDFCBANK'];
  const options: MockDataOptions = {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-15'),
    scenario: getScenario('earnings_season'),
    includeWeekends: false,
  };

  const multiData = generator.generateMultiCompanyData(symbols, options);
  console.log(`✅ Generated data for ${Object.keys(multiData).length} companies`);
  
  for (const [symbol, data] of Object.entries(multiData)) {
    const analysis = generator.analyzeData(data);
    console.log(`   ${symbol}: ${data.length} days, ${analysis.avgChangePercent}% avg change`);
  }
  console.log('');

  // Test 5: Custom scenario
  console.log('🎨 Test 5: Custom Scenario');
  const customScenario = createCustomScenario(
    'Tech Boom',
    0.035, // 3.5% volatility
    0.005, // 0.5% daily growth
    1.5,   // 1.5x volume
    new Date('2024-01-01'),
    new Date('2024-01-31')
  );

  const techCompany = getCompanyBySymbol('TCS');
  if (techCompany) {
    const customOptions: MockDataOptions = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      scenario: customScenario,
      includeWeekends: false,
    };

    const customData = generator.generateHistoricalData(techCompany, customOptions);
    const customAnalysis = generator.analyzeData(customData);
    const startPrice = customData[0].open;
    const endPrice = customData[customData.length - 1].close;
    const totalReturn = ((endPrice - startPrice) / startPrice) * 100;

    console.log(`📈 Custom Tech Boom Scenario:`);
    console.log(`   - Total Return: ${totalReturn.toFixed(2)}%`);
    console.log(`   - Volatility: ${customAnalysis.volatility}%`);
    console.log(`   - Avg Volume: ${(customAnalysis.avgVolume / 1000000).toFixed(1)}M shares`);
  }
  console.log('');

  // Test 6: Available scenarios
  console.log('📋 Test 6: Available Scenarios');
  const availableScenarios = getScenarioNames();
  console.log('Available scenarios:', availableScenarios.join(', '));
  console.log('');

  console.log('🎉 Mock Data Generator Tests Completed!');
}

// Function to demonstrate market crash scenario
export function demonstrateMarketCrash() {
  console.log('💥 Demonstrating Market Crash Scenario...\n');

  const generator = new MockDataGenerator(99999); // Different seed for variety
  const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
  
  const crashOptions: MockDataOptions = {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    scenario: getScenario('market_crash'),
    includeWeekends: false,
  };

  const crashData = generator.generateMultiCompanyData(symbols, crashOptions);

  console.log('📉 Market Crash Results:');
  for (const [symbol, data] of Object.entries(crashData)) {
    const startPrice = data[0].open;
    const endPrice = data[data.length - 1].close;
    const totalReturn = ((endPrice - startPrice) / startPrice) * 100;
    const analysis = generator.analyzeData(data);

    console.log(`   ${symbol}:`);
    console.log(`     - Total Return: ${totalReturn.toFixed(2)}%`);
    console.log(`     - Volatility: ${analysis.volatility}%`);
    console.log(`     - Max Loss: ${analysis.maxLoss}%`);
    console.log(`     - Avg Volume: ${(analysis.avgVolume / 1000000).toFixed(1)}M shares`);
  }
}

// Function to compare different volatility levels
export function compareVolatilityLevels() {
  console.log('📊 Comparing Different Volatility Levels...\n');

  const generator = new MockDataGenerator(11111);
  const company = getCompanyBySymbol('RELIANCE');
  
  if (!company) return;

  const volatilityLevels = [0.01, 0.02, 0.03, 0.05, 0.08]; // 1%, 2%, 3%, 5%, 8%
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');

  console.log('Volatility Level | Avg Change | Max Gain | Max Loss | Volatility');
  console.log('----------------|------------|----------|----------|-----------');

  for (const vol of volatilityLevels) {
    const customScenario = createCustomScenario(
      `${(vol * 100).toFixed(0)}% Volatility`,
      vol,
      0.001, // Small positive trend
      1.0
    );

    const options: MockDataOptions = {
      startDate,
      endDate,
      scenario: customScenario,
      includeWeekends: false,
    };

    const data = generator.generateHistoricalData(company, options);
    const analysis = generator.analyzeData(data);

    console.log(
      `${(vol * 100).toFixed(0).padStart(14)}% | ` +
      `${analysis.avgChangePercent.toString().padStart(10)}% | ` +
      `${analysis.maxGain.toString().padStart(8)}% | ` +
      `${analysis.maxLoss.toString().padStart(8)}% | ` +
      `${analysis.volatility.toString().padStart(9)}%`
    );
  }
}

// Export test functions
export const MockDataTests = {
  testMockDataGenerator,
  demonstrateMarketCrash,
  compareVolatilityLevels,
};
