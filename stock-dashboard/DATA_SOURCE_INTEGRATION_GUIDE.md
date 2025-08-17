# Data Source Integration Guide

## 🎯 **Overview**

This guide explains the comprehensive data source integration system that allows switching between mock and live stock data sources with advanced features like caching, rate limiting, and fallback strategies.

## 🏗️ **Architecture**

### **Core Components**

1. **Data Source Interface** (`IDataSource`)
   - Common interface for all data sources
   - Standardized methods for data retrieval
   - Health checking and rate limiting

2. **Base Data Source Class** (`BaseDataSource`)
   - Implements common functionality
   - Retry logic with exponential backoff
   - Caching and rate limiting
   - Error handling and logging

3. **Data Source Manager** (`DataSourceManager`)
   - Manages multiple data sources
   - Implements fallback strategies
   - Handles source switching
   - Provides unified interface

4. **Cache System** (`MemoryCache`, `RedisCache`)
   - TTL-based caching
   - Memory management
   - Configurable cache strategies

5. **Rate Limiting** (`SlidingWindowRateLimiter`, `TokenBucketRateLimiter`)
   - Multiple rate limiting algorithms
   - Per-source rate limits
   - Daily and per-minute limits

## 📁 **File Structure**

```
src/lib/services/
├── data-source.types.ts          # TypeScript interfaces and types
├── base-data-source.ts           # Base class with common functionality
├── mock-data-source.ts           # Mock data implementation
├── alpha-vantage-data-source.ts  # Alpha Vantage API integration
├── cache.ts                      # Cache implementations
├── rate-limiter.ts               # Rate limiting implementations
└── data-source-manager.ts        # Main manager class

src/components/
└── DataSourceToggle.tsx          # React component for switching sources

src/app/api/data-sources/
├── status/route.ts               # Get data source status
├── switch/route.ts               # Switch data source
├── test/route.ts                 # Test all sources
└── clear-cache/route.ts          # Clear all caches

src/app/data-source-demo/
└── page.tsx                      # Demo page
```

## 🔧 **Implementation Details**

### **1. Data Source Interface**

```typescript
interface IDataSource {
  readonly name: string;
  readonly config: DataSourceConfig;
  
  getStockData(options: QueryOptions): Promise<DataSourceResponse<StockDataPoint[]>>;
  getLatestPrice(symbol: string): Promise<DataSourceResponse<LatestPriceData>>;
  getCompanyInfo(symbol: string): Promise<DataSourceResponse<CompanyData>>;
  searchCompanies(options: SearchOptions): Promise<DataSourceResponse<CompanyData[]>>;
  
  isHealthy(): Promise<boolean>;
  canMakeRequest(): boolean;
  clearCache(): Promise<void>;
}
```

### **2. Base Data Source Class**

**Key Features:**
- **Retry Logic**: Exponential backoff with configurable retries
- **Rate Limiting**: Per-source rate limits with sliding window
- **Caching**: TTL-based caching with memory management
- **Error Handling**: Standardized error responses
- **Logging**: Request/response logging with performance metrics

**Example Usage:**
```typescript
class MyDataSource extends BaseDataSource {
  async getStockData(options: QueryOptions) {
    const cacheKey = this.generateCacheKey('stock-data', options);
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const data = await this.makeRequest('/api/stock-data', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      return this.transformData(data);
    }, 5 * 60 * 1000); // 5 minutes cache
  }
}
```

### **3. Data Source Manager**

**Key Features:**
- **Fallback Strategy**: Automatic fallback between sources
- **Health Monitoring**: Real-time health checks
- **Source Switching**: Dynamic source switching
- **Unified Interface**: Single interface for all operations

**Example Usage:**
```typescript
const manager = getDataSourceManager();

// Get data with automatic fallback
const response = await manager.getStockData({ symbol: 'AAPL' });

// Switch data source
await manager.switchDataSource('alpha_vantage');

// Get status
const status = await manager.getDataSourceStatus();
```

## 🚀 **Available Data Sources**

### **1. Mock Data Source**
- **Purpose**: Development and testing
- **Features**: Realistic mock data generation
- **Rate Limits**: None (unlimited)
- **Cache**: 5 minutes TTL
- **Health**: Always healthy

### **2. Alpha Vantage Data Source**
- **Purpose**: Live stock data
- **Features**: Real-time and historical data
- **Rate Limits**: 5 requests/minute, 500/day (free tier)
- **Cache**: 1-5 minutes TTL
- **Health**: API connectivity check

### **3. Future Data Sources**
- **Yahoo Finance**: Alternative live data
- **NSE India**: Indian market data
- **BSE India**: Bombay Stock Exchange data

## 🎛️ **Configuration**

### **Environment Variables**

Create a `.env.local` file:

```env
# Alpha Vantage API Key (get free key from https://www.alphavantage.co/support/#api-key)
ALPHA_VANTAGE_API_KEY=your_api_key_here

# Data Source Configuration
DEFAULT_DATA_SOURCE=mock
ENABLE_ALPHA_VANTAGE=true
ENABLE_MOCK_DATA=true

# Cache Configuration
CACHE_TTL=300000
CACHE_MAX_SIZE=1000

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_REQUESTS_PER_DAY=1000
```

### **Data Source Configuration**

```typescript
const DATA_SOURCE_CONFIGS = {
  mock: {
    name: 'Mock Data',
    enabled: true,
    priority: 1,
    rateLimit: { requestsPerMinute: 1000, requestsPerDay: 100000 },
    retryConfig: { maxRetries: 0, retryDelay: 0, backoffMultiplier: 1 },
  },
  alpha_vantage: {
    name: 'Alpha Vantage',
    enabled: true,
    priority: 2,
    rateLimit: { requestsPerMinute: 5, requestsPerDay: 500 },
    retryConfig: { maxRetries: 3, retryDelay: 1000, backoffMultiplier: 2 },
  },
};
```

## 🎮 **Usage Examples**

### **1. Basic Usage**

```typescript
import { getDataSourceManager } from '@/lib/services/data-source-manager';

// Get stock data (automatic fallback)
const stockData = await getDataSourceManager().getStockData({
  symbol: 'RELIANCE',
  limit: 30
});

// Get latest price
const latestPrice = await getDataSourceManager().getLatestPrice('RELIANCE');

// Search companies
const companies = await getDataSourceManager().searchCompanies({
  query: 'RELIANCE',
  type: 'all',
  limit: 10
});
```

### **2. Switching Data Sources**

```typescript
const manager = getDataSourceManager();

// Switch to Alpha Vantage
await manager.switchDataSource('alpha_vantage');

// Get current source
const currentSource = manager.getCurrentSource();

// Get available sources
const availableSources = manager.getAvailableSources();
```

### **3. Monitoring and Debugging**

```typescript
// Get data source status
const status = await manager.getDataSourceStatus();

// Test all sources
const testResults = await manager.testAllSources();

// Clear all caches
await manager.clearAllCaches();
```

## 🎨 **Frontend Integration**

### **Data Source Toggle Component**

```tsx
import DataSourceToggle from '@/components/DataSourceToggle';

function MyPage() {
  const handleDataSourceChange = (source: string) => {
    console.log(`Switched to ${source} data source`);
    // Refresh your data here
  };

  return (
    <div>
      <DataSourceToggle onDataSourceChange={handleDataSourceChange} />
      {/* Your other components */}
    </div>
  );
}
```

### **API Endpoints**

- `GET /api/data-sources/status` - Get status of all data sources
- `POST /api/data-sources/switch` - Switch data source
- `GET /api/data-sources/test` - Test all data sources
- `POST /api/data-sources/clear-cache` - Clear all caches

## 🔍 **Monitoring and Debugging**

### **Console Logs**

The system provides detailed logging:

```
[DataSourceManager] Initialized with sources: alpha_vantage, mock
[DataSourceManager] Current source: alpha_vantage
[DataSourceManager] Trying alpha_vantage for stock data
[Alpha Vantage] Request successful: https://www.alphavantage.co/query (245ms)
[DataSourceManager] Success from alpha_vantage
```

### **Health Monitoring**

```typescript
// Check individual source health
const isHealthy = await source.isHealthy();

// Get rate limit stats
const rateLimitStats = source.getRateLimitStats();

// Get cache stats
const cacheStats = source.getCacheStats();
```

### **Error Handling**

The system handles various error scenarios:

- **Rate Limit Exceeded**: Automatic retry with backoff
- **API Key Invalid**: Clear error message
- **Network Errors**: Automatic fallback to next source
- **Service Unavailable**: Retry with exponential backoff

## 🧪 **Testing**

### **1. Test Data Sources**

Visit `/data-source-demo` to:
- Switch between data sources
- View real-time data
- Test different symbols
- Monitor performance

### **2. API Testing**

```bash
# Get data source status
curl http://localhost:3000/api/data-sources/status

# Switch data source
curl -X POST http://localhost:3000/api/data-sources/switch \
  -H "Content-Type: application/json" \
  -d '{"source": "alpha_vantage"}'

# Test all sources
curl http://localhost:3000/api/data-sources/test

# Clear caches
curl -X POST http://localhost:3000/api/data-sources/clear-cache
```

### **3. Postman Collection**

Import the provided Postman collection to test all endpoints.

## 🔧 **Advanced Configuration**

### **Custom Data Source**

To add a new data source:

1. **Create the data source class:**
```typescript
export class MyCustomDataSource extends BaseDataSource {
  constructor(config?: Partial<DataSourceConfig>) {
    super('my_custom', {
      name: 'My Custom Data',
      enabled: true,
      priority: 3,
      rateLimit: { requestsPerMinute: 10, requestsPerDay: 1000 },
      retryConfig: { maxRetries: 2, retryDelay: 500, backoffMultiplier: 1.5 },
      ...config,
    });
  }

  async getStockData(options: QueryOptions) {
    // Implement your logic here
  }
}
```

2. **Add to the manager:**
```typescript
// In data-source-manager.ts
const myCustomDataSource = new MyCustomDataSource();
this.dataSources.set('my_custom', myCustomDataSource);
```

### **Custom Cache Strategy**

```typescript
export class MyCustomCache implements ICache {
  async get<T>(key: string): Promise<T | null> {
    // Implement your cache logic
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Implement your cache logic
  }
}
```

### **Custom Rate Limiter**

```typescript
export class MyCustomRateLimiter implements IRateLimiter {
  canMakeRequest(identifier: string): boolean {
    // Implement your rate limiting logic
  }
  
  recordRequest(identifier: string): void {
    // Implement your rate limiting logic
  }
}
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"All data sources failed"**
   - Check API keys are configured
   - Verify network connectivity
   - Check rate limits

2. **"Rate limit exceeded"**
   - Wait for rate limit reset
   - Switch to mock data source
   - Check API quota usage

3. **"Cache not working"**
   - Clear all caches
   - Check cache configuration
   - Verify TTL settings

### **Debug Mode**

Enable debug logging:

```typescript
// Add to your environment
DEBUG_DATA_SOURCES=true
```

### **Performance Monitoring**

Monitor these metrics:
- Response times per data source
- Cache hit rates
- Rate limit usage
- Error rates

## 📚 **Learning Resources**

### **Key Concepts**

1. **Abstraction**: Common interface for different data sources
2. **Fallback Strategy**: Automatic switching when primary source fails
3. **Rate Limiting**: Preventing API abuse
4. **Caching**: Reducing API calls and improving performance
5. **Error Handling**: Graceful degradation and recovery

### **Design Patterns Used**

- **Strategy Pattern**: Different data source implementations
- **Factory Pattern**: Creating data sources
- **Observer Pattern**: Real-time updates
- **Repository Pattern**: Data access abstraction

### **Best Practices**

1. **Always implement fallback**: Never rely on a single data source
2. **Use appropriate caching**: Balance freshness with performance
3. **Monitor rate limits**: Prevent API quota exhaustion
4. **Handle errors gracefully**: Provide meaningful error messages
5. **Test thoroughly**: Test all data sources and error scenarios

## 🎯 **Next Steps**

### **Phase 2 Enhancements**

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Caching**: Redis integration for distributed caching
3. **Data Aggregation**: Combine data from multiple sources
4. **Analytics**: Track usage patterns and performance metrics
5. **Machine Learning**: Predict data source reliability

### **Additional Data Sources**

1. **Yahoo Finance**: Alternative live data source
2. **NSE India**: Indian market data
3. **BSE India**: Bombay Stock Exchange data
4. **Custom APIs**: Your own data sources

### **Advanced Features**

1. **Data Validation**: Validate data quality and consistency
2. **Data Transformation**: Advanced data processing
3. **Backup Strategies**: Multiple fallback sources
4. **Load Balancing**: Distribute requests across sources
5. **Geographic Distribution**: Region-specific data sources

---

This comprehensive data source integration system provides a robust foundation for handling multiple stock data sources with advanced features like caching, rate limiting, and fallback strategies. The modular architecture makes it easy to add new data sources and customize behavior as needed.
