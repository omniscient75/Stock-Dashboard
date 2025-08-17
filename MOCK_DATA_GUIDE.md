# 📊 Mock Data Generator Guide

## 🎯 Overview

This guide explains how to use the comprehensive mock data generator for Indian stock market data. The system creates realistic OHLCV (Open, High, Low, Close, Volume) data with proper validation and market patterns.

## 🏗️ Architecture

### **Core Components**

1. **Indian Companies Data** (`src/lib/indian-companies.ts`)
   - 15+ real Indian companies with market data
   - Realistic base prices, volatility, and volume data
   - Sector categorization

2. **Market Scenarios** (`src/lib/market-scenarios.ts`)
   - Predefined market conditions (bull, bear, crash, etc.)
   - Custom scenario creation
   - Scenario validation

3. **Mock Data Generator** (`src/lib/mock-data-generator.ts`)
   - OHLCV data generation with realistic patterns
   - Financial data validation
   - Statistical analysis

4. **Type Definitions** (`src/types/stock.ts`)
   - Comprehensive TypeScript interfaces
   - Indian market specific types
   - Validation rules

## 📋 Indian Companies Included

### **Large Cap Companies**
- **RELIANCE** - Oil & Gas (₹2,500 base price)
- **TCS** - Technology (₹3,800 base price)
- **HDFCBANK** - Banking (₹1,600 base price)
- **INFY** - Technology (₹1,400 base price)
- **ICICIBANK** - Banking (₹950 base price)

### **Consumer Goods**
- **HINDUNILVR** - FMCG (₹2,200 base price)
- **ITC** - FMCG (₹400 base price)
- **ASIANPAINT** - Paints (₹3,200 base price)

### **Financial Services**
- **SBIN** - Banking (₹650 base price)
- **AXISBANK** - Banking (₹950 base price)
- **KOTAKBANK** - Banking (₹1,800 base price)

### **Other Sectors**
- **BHARTIARTL** - Telecom (₹950 base price)
- **MARUTI** - Automobile (₹9,500 base price)
- **SUNPHARMA** - Healthcare (₹850 base price)
- **TATAMOTORS** - Automobile (₹550 base price)

## 🎭 Market Scenarios

### **Predefined Scenarios**

| Scenario | Volatility | Trend | Volume | Description |
|----------|------------|-------|--------|-------------|
| `normal` | 2.0% | +0.1% | 1.0x | Typical market conditions |
| `bull_market` | 2.5% | +0.3% | 1.2x | Strong upward trend |
| `bear_market` | 3.5% | -0.2% | 1.1x | Downward trend |
| `market_crash` | 5.0% | -0.8% | 2.0x | Severe decline |
| `high_volatility` | 4.0% | 0.0% | 1.5x | High uncertainty |
| `sideways` | 1.5% | 0.0% | 0.8x | Low volatility, no trend |
| `recovery` | 3.0% | +0.4% | 1.3x | Recovery from crash |
| `earnings_season` | 3.0% | +0.2% | 1.4x | Higher volatility |
| `covid_crisis` | 6.0% | -1.5% | 2.5x | COVID-19 like crisis |
| `tech_bubble` | 4.5% | -0.5% | 1.8x | Tech bubble burst |

## 🔧 Usage Examples

### **Basic Usage**

```typescript
import { MockDataGenerator } from '@/lib/mock-data-generator';
import { getCompanyBySymbol } from '@/lib/indian-companies';
import { getScenario } from '@/lib/market-scenarios';

// Create generator
const generator = new MockDataGenerator(12345); // Fixed seed for reproducibility

// Get company data
const tcs = getCompanyBySymbol('TCS');

// Generate 30 days of data
const options = {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  scenario: getScenario('normal'),
  includeWeekends: false,
};

const data = generator.generateHistoricalData(tcs, options);
console.log(`Generated ${data.length} days of data`);
```

### **Market Scenario Examples**

```typescript
// Bull market data
const bullData = generator.generateHistoricalData(company, {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  scenario: getScenario('bull_market'),
});

// Market crash data
const crashData = generator.generateHistoricalData(company, {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  scenario: getScenario('market_crash'),
});

// Custom scenario
const customScenario = createCustomScenario(
  'Tech Boom',
  0.035, // 3.5% volatility
  0.005, // 0.5% daily growth
  1.5,   // 1.5x volume
);
```

### **Multi-Company Data**

```typescript
// Generate data for multiple companies
const symbols = ['TCS', 'INFY', 'HDFCBANK'];
const multiData = generator.generateMultiCompanyData(symbols, options);

// Generate data for all companies
const allData = generator.generateAllCompaniesData(options);
```

### **Data Analysis**

```typescript
// Analyze generated data
const analysis = generator.analyzeData(data);
console.log('Data Analysis:', {
  totalDays: analysis.totalDays,
  avgVolume: analysis.avgVolume,
  avgChangePercent: analysis.avgChangePercent,
  maxGain: analysis.maxGain,
  maxLoss: analysis.maxLoss,
  volatility: analysis.volatility,
});
```

## ✅ Data Validation

### **OHLCV Validation Rules**

The system validates that:
- **High ≥ Open, Close** (High is the highest price of the day)
- **Low ≤ Open, Close** (Low is the lowest price of the day)
- **All prices > 0** (No negative prices)
- **Volume > 0** (Positive trading volume)

### **Market Validation Rules**

- **Price Range**: ₹10 - ₹50,000
- **Volume Range**: 1,000 - 100,000,000 shares
- **Max Daily Change**: 20%
- **Max Gap**: 10% between trading days

### **Validation Example**

```typescript
import { FinancialDataValidator } from '@/lib/mock-data-generator';

const data = {
  date: new Date(),
  open: 100,
  high: 105,
  low: 98,
  close: 102,
  volume: 1000000,
};

const errors = FinancialDataValidator.validateOHLCV(data);
if (errors.length === 0) {
  console.log('✅ Data is valid');
} else {
  console.log('❌ Validation errors:', errors);
}
```

## 📊 Data Patterns

### **How Stock Prices Move**

1. **Random Walk with Drift**: Prices follow a random walk with a trend component
2. **Volatility Clustering**: High volatility periods tend to cluster together
3. **Mean Reversion**: Prices tend to revert to their mean over time
4. **Volume-Price Relationship**: Higher volume often accompanies larger price moves

### **Realistic Price Generation**

```typescript
// The generator uses:
// 1. Normal distribution for price changes
// 2. Box-Muller transform for random numbers
// 3. Volatility scaling for intraday ranges
// 4. Volume variation based on market conditions
```

## 🧪 Testing

### **Run Tests**

```bash
npm run test:mock
```

### **Test Scenarios**

1. **Single Company Generation**: Test basic data generation
2. **Market Scenarios**: Compare different market conditions
3. **Data Validation**: Test validation rules
4. **Multi-Company**: Test bulk data generation
5. **Custom Scenarios**: Test custom market conditions
6. **Statistical Analysis**: Test data analysis functions

### **Example Test Output**

```
🧪 Testing Mock Data Generator...

📊 Test 1: Single Company Data Generation
✅ Generated 22 days of data for TCS
📈 Starting price: ₹3800.00
📉 Ending price: ₹3850.25
📊 Data Analysis:
   - Average Volume: 3,500,000
   - Average Change: 0.15%
   - Max Gain: 3.2%
   - Max Loss: -2.1%
   - Volatility: 1.8%

🎭 Test 2: Market Scenarios Comparison
📈 Normal Market:
   - Total Return: 2.15%
   - Volatility: 1.8%
   - Avg Volume: 3.5M shares
📈 Bull Market:
   - Total Return: 8.45%
   - Volatility: 2.2%
   - Avg Volume: 4.2M shares
```

## 🎮 Interactive Learning

### **Try Different Scenarios**

1. **Change Volatility**: See how higher volatility affects price swings
2. **Modify Trends**: Observe how trend affects overall returns
3. **Adjust Volume**: Notice volume patterns in different markets
4. **Test Validation**: Try creating invalid data to see validation errors

### **Experiment with Parameters**

```typescript
// High volatility scenario
const highVolScenario = createCustomScenario(
  'High Volatility Test',
  0.05,  // 5% daily volatility
  0.001, // Small positive trend
  1.0    // Normal volume
);

// Low volatility scenario
const lowVolScenario = createCustomScenario(
  'Low Volatility Test',
  0.01,  // 1% daily volatility
  0.002, // Small positive trend
  0.8    // Lower volume
);
```

## 🚨 Common Mistakes

### **1. Invalid OHLCV Relationships**
```typescript
// ❌ Wrong - High less than Open
const invalidData = {
  open: 100,
  high: 95,  // Should be >= 100
  low: 98,
  close: 102,
  volume: 1000000,
};
```

### **2. Unrealistic Volatility**
```typescript
// ❌ Wrong - Too high volatility
const unrealisticScenario = createCustomScenario(
  'Unrealistic',
  0.20, // 20% daily volatility (too high!)
  0.001,
  1.0
);
```

### **3. Missing Validation**
```typescript
// ❌ Wrong - No validation
const data = generateData();
// Use data without checking...

// ✅ Correct - With validation
const data = generateData();
const errors = FinancialDataValidator.validateOHLCV(data);
if (errors.length > 0) {
  console.error('Data validation failed:', errors);
}
```

## 🔮 Advanced Features

### **1. Seeded Random Generation**
```typescript
// Same seed = same results (reproducible)
const generator1 = new MockDataGenerator(12345);
const generator2 = new MockDataGenerator(12345);
// generator1 and generator2 will produce identical data
```

### **2. Custom Validation Rules**
```typescript
const customRules = {
  minPrice: 50,           // Minimum ₹50
  maxPrice: 10000,        // Maximum ₹10,000
  minVolume: 5000,        // Minimum 5,000 shares
  maxVolume: 50000000,    // Maximum 5 crore shares
  maxDailyChange: 0.15,   // Maximum 15% daily change
  maxGap: 0.08,           // Maximum 8% gap
};
```

### **3. Weekend Handling**
```typescript
const options = {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  includeWeekends: true,  // Include Saturday/Sunday
  scenario: getScenario('normal'),
};
```

## 📚 Learning Resources

### **Financial Concepts**
- **OHLCV Data**: Understanding Open, High, Low, Close, Volume
- **Volatility**: Price fluctuation patterns
- **Market Trends**: Bull vs Bear markets
- **Volume Analysis**: Trading volume patterns

### **Technical Concepts**
- **Random Number Generation**: Seeded random numbers
- **Normal Distribution**: Box-Muller transform
- **Data Validation**: Financial data integrity
- **TypeScript Interfaces**: Type safety

### **Real Market Patterns**
- **Intraday Patterns**: High/Low vs Open/Close relationships
- **Volume Patterns**: Higher volume during volatile periods
- **Gap Patterns**: Price gaps between trading days
- **Trend Patterns**: Sustained price movements

---

**Ready to create realistic Indian stock market data? Start with the basic examples and experiment with different scenarios!** 🚀
