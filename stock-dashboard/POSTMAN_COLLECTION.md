# Stock Dashboard API - Postman Collection Guide

## 🏠 **Base URL**
```
http://localhost:3001
```

## 📁 **Collection Structure**

### **1. Companies API**
- GET /api/companies
- POST /api/companies

### **2. Stocks API**
- GET /api/stocks/[symbol]
- POST /api/stocks/[symbol]
- PUT /api/stocks/[symbol]
- DELETE /api/stocks/[symbol]

### **3. Latest Price API**
- GET /api/stocks/[symbol]/latest
- POST /api/stocks/[symbol]/latest

---

## 🏢 **1. Companies API**

### **GET /api/companies**
**Description**: List all companies with pagination, search, and filtering

**URL**: `{{baseUrl}}/api/companies`

**Method**: GET

**Query Parameters**:
```
page=1
limit=10
search=RELIANCE
sector=Technology
exchange=NSE
sortBy=symbol
sortOrder=asc
```

**Example Requests**:

#### **1.1 Get All Companies (Default)**
```
GET {{baseUrl}}/api/companies
```

#### **1.2 Get Companies with Pagination**
```
GET {{baseUrl}}/api/companies?page=1&limit=5
```

#### **1.3 Search Companies**
```
GET {{baseUrl}}/api/companies?search=RELIANCE
```

#### **1.4 Filter by Sector**
```
GET {{baseUrl}}/api/companies?sector=Technology
```

#### **1.5 Filter by Exchange**
```
GET {{baseUrl}}/api/companies?exchange=NSE
```

#### **1.6 Sort by Market Cap**
```
GET {{baseUrl}}/api/companies?sortBy=marketCap&sortOrder=desc
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries Limited",
      "sector": "Oil & Gas",
      "industry": "Refineries",
      "exchange": "NSE",
      "marketCap": 1500000,
      "peRatio": 25.5,
      "dividendYield": 0.8,
      "basePrice": 2500,
      "volatility": 0.025,
      "avgVolume": 5000000,
      "description": "India's largest private sector company...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### **POST /api/companies**
**Description**: Create a new company

**URL**: `{{baseUrl}}/api/companies`

**Method**: POST

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "symbol": "TEST",
  "name": "Test Company Ltd",
  "sector": "Technology",
  "industry": "Software",
  "exchange": "NSE",
  "marketCap": 100000,
  "peRatio": 20.5,
  "dividendYield": 1.2,
  "basePrice": 100,
  "volatility": 0.02,
  "avgVolume": 1000000,
  "description": "A test company for API testing"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "TEST",
    "name": "Test Company Ltd",
    "sector": "Technology",
    "industry": "Software",
    "exchange": "NSE",
    "marketCap": 100000,
    "peRatio": 20.5,
    "dividendYield": 1.2,
    "basePrice": 100,
    "volatility": 0.02,
    "avgVolume": 1000000,
    "description": "A test company for API testing",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Company 'TEST' created successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 📈 **2. Stocks API**

### **GET /api/stocks/[symbol]**
**Description**: Get historical stock data for a specific symbol

**URL**: `{{baseUrl}}/api/stocks/{{symbol}}`

**Method**: GET

**Path Variables**:
```
symbol: RELIANCE (or any valid symbol)
```

**Query Parameters**:
```
page=1
limit=30
startDate=2024-01-01T00:00:00.000Z
endDate=2024-01-31T23:59:59.999Z
interval=daily
sortBy=date
sortOrder=desc
```

**Example Requests**:

#### **2.1 Get Stock Data (Default)**
```
GET {{baseUrl}}/api/stocks/RELIANCE
```

#### **2.2 Get Stock Data with Date Range**
```
GET {{baseUrl}}/api/stocks/RELIANCE?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-15T23:59:59.999Z
```

#### **2.3 Get Stock Data with Pagination**
```
GET {{baseUrl}}/api/stocks/RELIANCE?page=1&limit=10
```

#### **2.4 Sort by Volume**
```
GET {{baseUrl}}/api/stocks/RELIANCE?sortBy=volume&sortOrder=desc
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "symbol": "RELIANCE",
      "date": "2024-01-15",
      "open": 2500.50,
      "high": 2520.75,
      "low": 2485.25,
      "close": 2510.00,
      "volume": 5000000,
      "change": 9.50,
      "changePercent": 0.38
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 100,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### **POST /api/stocks/[symbol]**
**Description**: Add new stock data for a specific symbol

**URL**: `{{baseUrl}}/api/stocks/{{symbol}}`

**Method**: POST

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "symbol": "RELIANCE",
  "date": "2024-01-16T00:00:00.000Z",
  "open": 2510.00,
  "high": 2530.50,
  "low": 2500.25,
  "close": 2525.75,
  "volume": 5200000,
  "change": 15.75,
  "changePercent": 0.63
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "date": "2024-01-16T00:00:00.000Z",
    "open": 2510.00,
    "high": 2530.50,
    "low": 2500.25,
    "close": 2525.75,
    "volume": 5200000,
    "change": 15.75,
    "changePercent": 0.63,
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Stock data added successfully for RELIANCE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### **PUT /api/stocks/[symbol]**
**Description**: Update existing stock data

**URL**: `{{baseUrl}}/api/stocks/{{symbol}}`

**Method**: PUT

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "close": 2530.00,
  "volume": 5500000,
  "change": 20.00,
  "changePercent": 0.80
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "close": 2530.00,
    "volume": 5500000,
    "change": 20.00,
    "changePercent": 0.80,
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Stock data updated successfully for RELIANCE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### **DELETE /api/stocks/[symbol]**
**Description**: Delete stock data for a specific symbol

**URL**: `{{baseUrl}}/api/stocks/{{symbol}}`

**Method**: DELETE

**Expected Response**:
```json
{
  "success": true,
  "data": null,
  "message": "Stock data deleted successfully for RELIANCE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## ⚡ **3. Latest Price API**

### **GET /api/stocks/[symbol]/latest**
**Description**: Get the latest price data for a specific symbol

**URL**: `{{baseUrl}}/api/stocks/{{symbol}}/latest`

**Method**: GET

**Path Variables**:
```
symbol: RELIANCE (or any valid symbol)
```

**Example Request**:
```
GET {{baseUrl}}/api/stocks/RELIANCE/latest
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "price": 2525.75,
    "change": 15.75,
    "changePercent": 0.63,
    "volume": 5200000,
    "high": 2530.50,
    "low": 2500.25,
    "open": 2510.00,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Latest price data retrieved successfully for RELIANCE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### **POST /api/stocks/[symbol]/latest**
**Description**: Update latest price data

**URL**: `{{baseUrl}}/api/stocks/{{symbol}}/latest`

**Method**: POST

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "price": 2530.00,
  "volume": 5500000,
  "high": 2540.00,
  "low": 2510.00,
  "open": 2520.00
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "price": 2530.00,
    "volume": 5500000,
    "high": 2540.00,
    "low": 2510.00,
    "open": 2520.00,
    "change": 0,
    "changePercent": 0,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Latest price updated successfully for RELIANCE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🧪 **Testing Scenarios**

### **1. Happy Path Testing**
- ✅ Valid requests with proper data
- ✅ Expected successful responses
- ✅ Proper HTTP status codes (200, 201)

### **2. Error Handling Testing**
- ❌ Invalid symbols (404 Not Found)
- ❌ Invalid request data (422 Unprocessable Entity)
- ❌ Missing required fields (400 Bad Request)
- ❌ Invalid HTTP methods (405 Method Not Allowed)

### **3. Edge Cases Testing**
- 🔍 Empty search results
- 🔍 Pagination boundaries
- 🔍 Large datasets
- 🔍 Special characters in search

### **4. Performance Testing**
- ⚡ Response times
- ⚡ Rate limiting (429 Too Many Requests)
- ⚡ Concurrent requests

---

## 🔧 **Postman Environment Variables**

Create an environment with these variables:

**Environment Name**: Stock Dashboard API

**Variables**:
```
baseUrl: http://localhost:3001
symbol: RELIANCE
```

**Usage in URLs**:
```
{{baseUrl}}/api/companies
{{baseUrl}}/api/stocks/{{symbol}}
```

---

## 📊 **Test Data**

### **Valid Symbols for Testing**:
- RELIANCE
- TCS
- HDFCBANK
- INFY
- ICICIBANK
- HINDUNILVR
- ITC
- SBIN

### **Valid Sectors**:
- Technology
- Financial Services
- Consumer Goods
- Oil & Gas
- Telecommunications
- Automobile
- Healthcare

### **Valid Exchanges**:
- NSE
- BSE
- BOTH

---

## 🚨 **Common Error Responses**

### **404 Not Found**
```json
{
  "success": false,
  "error": "Company with symbol 'INVALID' not found",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/stocks/INVALID"
}
```

### **422 Validation Error**
```json
{
  "success": false,
  "error": "Validation failed: symbol: Symbol must be uppercase letters only",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/companies"
}
```

### **405 Method Not Allowed**
```json
{
  "success": false,
  "error": "Method PUT not allowed",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/companies"
}
```

### **429 Too Many Requests**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/companies"
}
```

---

## 🎯 **Quick Start Testing**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Import this collection** into Postman

3. **Set up environment variables**:
   - baseUrl: `http://localhost:3001`
   - symbol: `RELIANCE`

4. **Run tests in this order**:
   1. GET /api/companies (basic test)
   2. GET /api/stocks/RELIANCE (basic test)
   3. GET /api/stocks/RELIANCE/latest (basic test)
   4. Test with different query parameters
   5. Test error scenarios

5. **Monitor the console** for API logs and performance metrics

---

## 📈 **Performance Monitoring**

Watch for these logs in your terminal:
```
[2024-01-01T12:00:00.000Z] INFO GET /api/companies 200 45ms Mozilla/5.0...
[2024-01-01T12:00:01.000Z] ERROR GET /api/stocks/INVALID 404 12ms Mozilla/5.0...
```

This will help you monitor:
- Request/response times
- Error rates
- API usage patterns
- Performance bottlenecks
