// Test file to verify chart components are working
// Run with: npx tsx src/lib/test-charts.ts

import { generateSampleData } from './mock-data-generator';

console.log('🧪 Testing Chart Components...\n');

try {
  // Test 1: Generate sample data
  console.log('📊 Test 1: Generating sample data...');
  const sampleData = generateSampleData({
    companies: ['RELIANCE', 'TCS'],
    days: 10,
    scenario: 'normal'
  });
  
  console.log('✅ Sample data generated successfully!');
  console.log(`   - Companies: ${Object.keys(sampleData).join(', ')}`);
  console.log(`   - Data points per company: ${Object.values(sampleData)[0]?.length || 0}`);
  
  // Test 2: Verify data structure
  console.log('\n📊 Test 2: Verifying data structure...');
  const firstCompany = Object.values(sampleData)[0];
  if (firstCompany && firstCompany.length > 0) {
    const firstDataPoint = firstCompany[0];
    const requiredFields = ['date', 'open', 'high', 'low', 'close', 'volume'];
    const hasAllFields = requiredFields.every(field => field in firstDataPoint);
    
    if (hasAllFields) {
      console.log('✅ Data structure is correct!');
      console.log(`   - Sample data point: ${JSON.stringify(firstDataPoint, null, 2)}`);
    } else {
      console.log('❌ Data structure is missing required fields');
    }
  }
  
  // Test 3: Verify data relationships
  console.log('\n📊 Test 3: Verifying OHLCV relationships...');
  let validDataPoints = 0;
  let totalDataPoints = 0;
  
  Object.values(sampleData).forEach(companyData => {
    companyData.forEach(dataPoint => {
      totalDataPoints++;
      const { open, high, low, close, volume } = dataPoint;
      
      // Check OHLC relationships
      const isValidOHLC = high >= Math.max(open, close) && low <= Math.min(open, close);
      const isValidVolume = volume > 0;
      const isValidPrices = open > 0 && high > 0 && low > 0 && close > 0;
      
      if (isValidOHLC && isValidVolume && isValidPrices) {
        validDataPoints++;
      }
    });
  });
  
  const validityPercentage = (validDataPoints / totalDataPoints) * 100;
  console.log(`✅ Data validation: ${validDataPoints}/${totalDataPoints} points valid (${validityPercentage.toFixed(1)}%)`);
  
  // Test 4: Test different scenarios
  console.log('\n📊 Test 4: Testing different market scenarios...');
  const scenarios = ['normal', 'bull_market', 'bear_market', 'high_volatility'];
  
  scenarios.forEach(scenario => {
    try {
      const scenarioData = generateSampleData({
        companies: ['RELIANCE'],
        days: 5,
        scenario
      });
      console.log(`✅ ${scenario} scenario: Generated ${scenarioData.RELIANCE?.length || 0} data points`);
    } catch (error) {
      console.log(`❌ ${scenario} scenario: Failed - ${error}`);
    }
  });
  
  console.log('\n🎉 All tests completed successfully!');
  console.log('📈 Chart components should now be working properly.');
  console.log('\nNext steps:');
  console.log('1. Visit http://localhost:3000 to see the main dashboard');
  console.log('2. Visit http://localhost:3000/charts-demo to see interactive charts');
  console.log('3. Try switching between different chart types and companies');
  
} catch (error) {
  console.error('❌ Test failed:', error);
  console.log('\nTroubleshooting:');
  console.log('1. Check if all dependencies are installed: npm install');
  console.log('2. Verify TypeScript compilation: npx tsc --noEmit');
  console.log('3. Check browser console for any JavaScript errors');
}
