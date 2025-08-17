# 📊 Database Design Documentation

## 🎯 Overview

This document explains the database schema design for the Stock Dashboard application, including relationships, data types, indexing strategies, and best practices for financial data.

## 🏗️ Database Architecture

### **Why PostgreSQL for Financial Data?**

1. **ACID Compliance**: Ensures data integrity for financial transactions
2. **JSON Support**: Flexible data storage for complex financial metrics
3. **Advanced Indexing**: Efficient time-series data queries
4. **Scalability**: Handles large volumes of historical price data
5. **Decimal Precision**: Accurate financial calculations

### **Database Normalization**

Our schema follows **3rd Normal Form (3NF)**:

- **1NF**: All attributes contain atomic values
- **2NF**: No partial dependencies on composite keys
- **3NF**: No transitive dependencies

## 📋 Schema Breakdown

### **Core Tables**

#### 1. **Company Table** (`companies`)
```sql
- id: String (Primary Key)
- symbol: String (Unique)
- name: String
- sector: String (Optional)
- industry: String (Optional)
- marketCap: BigInt (Optional)
- employees: Int (Optional)
- website: String (Optional)
- description: String (Optional)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

**Why BigInt for marketCap?**
- Market cap can exceed JavaScript's Number.MAX_SAFE_INTEGER (2^53 - 1)
- Apple's market cap: ~3 trillion = 3,000,000,000,000
- BigInt provides unlimited precision for large numbers

#### 2. **StockPrice Table** (`stock_prices`)
```sql
- id: String (Primary Key)
- companyId: String (Foreign Key)
- date: DateTime
- open: Decimal(10,4)
- high: Decimal(10,4)
- low: Decimal(10,4)
- close: Decimal(10,4)
- volume: BigInt
- adjustedClose: Decimal(10,4) (Optional)
- createdAt: DateTime
```

**Why Decimal for prices?**
- **Precision**: Stock prices need exact decimal representation
- **Accuracy**: Float can cause rounding errors in financial calculations
- **Consistency**: Decimal(10,4) supports prices up to $999,999.9999

**Why BigInt for volume?**
- Daily trading volume can exceed 1 billion shares
- Example: Tesla volume: 150,000,000 shares/day
- BigInt prevents overflow issues

### **User Data Tables**

#### 3. **User Table** (`users`)
```sql
- id: String (Primary Key)
- email: String (Unique)
- name: String (Optional)
- password: String (Hashed)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

#### 4. **WatchlistItem Table** (`watchlist_items`)
```sql
- id: String (Primary Key)
- userId: String (Foreign Key)
- companyId: String (Foreign Key)
- targetPrice: Decimal(10,4) (Optional)
- notes: String (Optional)
- addedAt: DateTime
```

#### 5. **PortfolioPosition Table** (`portfolio_positions`)
```sql
- id: String (Primary Key)
- userId: String (Foreign Key)
- companyId: String (Foreign Key)
- shares: Decimal(15,6)
- averagePrice: Decimal(10,4)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 6. **Transaction Table** (`transactions`)
```sql
- id: String (Primary Key)
- userId: String (Foreign Key)
- companyId: String (Foreign Key)
- type: TransactionType (BUY/SELL)
- shares: Decimal(15,6)
- price: Decimal(10,4)
- total: Decimal(15,4)
- fees: Decimal(10,4)
- date: DateTime
- notes: String (Optional)
- createdAt: DateTime
```

## 🔗 Relationships

### **One-to-Many Relationships**
```
Company → StockPrice (1:N)
User → WatchlistItem (1:N)
User → PortfolioPosition (1:N)
User → Transaction (1:N)
Company → WatchlistItem (1:N)
Company → PortfolioPosition (1:N)
Company → Transaction (1:N)
```

### **Many-to-Many Relationships**
```
User ↔ Company (through WatchlistItem)
User ↔ Company (through PortfolioPosition)
User ↔ Company (through Transaction)
```

## 📈 Indexing Strategy

### **Critical Indexes for Performance**

#### 1. **Stock Price Queries** (Most Important)
```sql
-- Composite index for time-series queries
CREATE INDEX idx_stock_prices_company_date ON stock_prices(company_id, date);

-- Descending index for recent data
CREATE INDEX idx_stock_prices_company_date_desc ON stock_prices(company_id, date DESC);

-- Date-only index for market-wide queries
CREATE INDEX idx_stock_prices_date ON stock_prices(date);
```

**Why this indexing strategy?**
- **Time-series data**: Most queries filter by company AND date range
- **Recent data**: Users often want the latest prices
- **Market analysis**: Sometimes need all stocks for a specific date

#### 2. **User Data Queries**
```sql
-- User watchlist queries
CREATE INDEX idx_watchlist_user ON watchlist_items(user_id);

-- User portfolio queries
CREATE INDEX idx_portfolio_user ON portfolio_positions(user_id);

-- Transaction history queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
```

#### 3. **Company Lookups**
```sql
-- Symbol lookups (most common)
CREATE INDEX idx_companies_symbol ON companies(symbol);

-- Sector-based queries
CREATE INDEX idx_companies_sector ON companies(sector);

-- Active company filter
CREATE INDEX idx_companies_active ON companies(is_active);
```

## 🚀 Performance Optimizations

### **1. Composite Indexes**
```sql
-- Instead of separate indexes
CREATE INDEX idx_company_id ON stock_prices(company_id);
CREATE INDEX idx_date ON stock_prices(date);

-- Use composite index (more efficient)
CREATE INDEX idx_company_date ON stock_prices(company_id, date);
```

### **2. Partial Indexes** (PostgreSQL)
```sql
-- Only index active companies
CREATE INDEX idx_active_companies ON companies(symbol) WHERE is_active = true;

-- Only index recent transactions
CREATE INDEX idx_recent_transactions ON transactions(user_id, date) 
WHERE date > NOW() - INTERVAL '1 year';
```

### **3. Covering Indexes**
```sql
-- Include frequently accessed columns
CREATE INDEX idx_stock_prices_covering ON stock_prices(company_id, date) 
INCLUDE (open, high, low, close, volume);
```

## 🔒 Data Integrity

### **Constraints**
```sql
-- Unique constraints
UNIQUE(company_id, date) -- One price per company per day
UNIQUE(user_id, company_id) -- One watchlist item per user per company
UNIQUE(user_id, company_id) -- One portfolio position per user per company

-- Foreign key constraints
FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

### **Data Validation**
```sql
-- Check constraints
CHECK (shares > 0)
CHECK (price > 0)
CHECK (volume >= 0)
CHECK (date <= NOW())
```

## 📊 Query Patterns

### **Common Queries and Their Optimization**

#### 1. **Get Latest Stock Price**
```sql
-- Optimized query
SELECT sp.*, c.symbol, c.name
FROM stock_prices sp
JOIN companies c ON sp.company_id = c.id
WHERE c.symbol = 'AAPL'
ORDER BY sp.date DESC
LIMIT 1;
```

#### 2. **Get Historical Prices**
```sql
-- Optimized query with date range
SELECT sp.*
FROM stock_prices sp
JOIN companies c ON sp.company_id = c.id
WHERE c.symbol = 'AAPL'
  AND sp.date BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY sp.date ASC;
```

#### 3. **Get User Portfolio with Current Prices**
```sql
-- Complex query with joins
SELECT 
  pp.shares,
  pp.average_price,
  sp.close as current_price,
  (sp.close - pp.average_price) * pp.shares as gain_loss,
  c.symbol,
  c.name
FROM portfolio_positions pp
JOIN companies c ON pp.company_id = c.id
LEFT JOIN stock_prices sp ON c.id = sp.company_id
  AND sp.date = (
    SELECT MAX(date) 
    FROM stock_prices 
    WHERE company_id = c.id
  )
WHERE pp.user_id = 'user_id';
```

## 🛠️ Migration Strategy

### **Development Workflow**
1. **Schema Changes**: Modify `schema.prisma`
2. **Generate Client**: `npm run db:generate`
3. **Create Migration**: `npm run db:migrate`
4. **Apply Migration**: Automatically applied
5. **Update Code**: Use new Prisma Client

### **Production Deployment**
1. **Review Migration**: Check generated SQL
2. **Backup Database**: Always backup before migration
3. **Apply Migration**: `prisma migrate deploy`
4. **Verify Data**: Check data integrity
5. **Rollback Plan**: Have rollback strategy ready

## 🚨 Common Mistakes to Avoid

### **1. Using Float for Financial Data**
```typescript
// ❌ Wrong - Float can cause rounding errors
price: Float

// ✅ Correct - Decimal for exact precision
price: Decimal @db.Decimal(10, 4)
```

### **2. Missing Indexes on Foreign Keys**
```typescript
// ❌ Missing index
model StockPrice {
  companyId String
  company   Company @relation(fields: [companyId], references: [id])
}

// ✅ With proper indexing
model StockPrice {
  companyId String
  company   Company @relation(fields: [companyId], references: [id])
  
  @@index([companyId, date])
}
```

### **3. Not Using Composite Indexes**
```typescript
// ❌ Separate indexes (less efficient)
@@index([companyId])
@@index([date])

// ✅ Composite index (more efficient)
@@index([companyId, date])
```

### **4. Storing Calculated Values**
```typescript
// ❌ Storing calculated values
model StockPrice {
  change: Decimal // Don't store this
  changePercent: Decimal // Don't store this
}

// ✅ Calculate on-demand
const change = currentPrice - previousPrice;
const changePercent = (change / previousPrice) * 100;
```

## 🔮 Future Considerations

### **1. Partitioning**
For large datasets, consider table partitioning:
```sql
-- Partition by date for historical data
CREATE TABLE stock_prices_2024 PARTITION OF stock_prices
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### **2. Materialized Views**
For complex aggregations:
```sql
-- Daily market summary
CREATE MATERIALIZED VIEW daily_market_summary AS
SELECT 
  date,
  COUNT(*) as total_companies,
  SUM(volume) as total_volume,
  AVG(close) as average_price
FROM stock_prices
GROUP BY date;
```

### **3. Read Replicas**
For high-traffic applications:
- Primary database for writes
- Read replicas for queries
- Load balancing for read operations

## 📚 Learning Resources

1. **Prisma Documentation**: https://www.prisma.io/docs
2. **PostgreSQL Documentation**: https://www.postgresql.org/docs
3. **Database Design Patterns**: https://martinfowler.com/articles/evodb.html
4. **Time-Series Database Design**: https://www.timescale.com/blog

---

**Remember**: Database design is iterative. Start simple, measure performance, and optimize based on actual usage patterns! 🚀
