// Simple test runner for mock data generator
import { testMockDataGenerator, demonstrateMarketCrash, compareVolatilityLevels } from './src/lib/test-mock-data.js';

async function runTests() {
  try {
    // Run main test suite
    await testMockDataGenerator();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Demonstrate market crash
    demonstrateMarketCrash();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Compare volatility levels
    compareVolatilityLevels();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTests();
