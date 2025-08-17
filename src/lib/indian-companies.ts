// Indian companies data for mock stock generation
// This file contains real Indian companies with realistic market parameters

import { IndianCompany } from '@/types/stock';

// Real Indian companies with market data
export const INDIAN_COMPANIES: IndianCompany[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    sector: 'Oil & Gas',
    industry: 'Refineries',
    marketCap: 1500000, // 15 lakh crores
    peRatio: 25.5,
    dividendYield: 0.8,
    exchange: 'NSE',
    basePrice: 2500,
    volatility: 0.025, // 2.5% daily volatility
    avgVolume: 5000000, // 50 lakh shares
    description: 'India\'s largest private sector company with interests in energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Limited',
    sector: 'Technology',
    industry: 'IT Services',
    marketCap: 1200000, // 12 lakh crores
    peRatio: 30.2,
    dividendYield: 1.2,
    exchange: 'NSE',
    basePrice: 3800,
    volatility: 0.020, // 2% daily volatility
    avgVolume: 3000000, // 30 lakh shares
    description: 'India\'s largest IT services company, providing consulting, business solutions, and IT services.',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    sector: 'Financial Services',
    industry: 'Banking',
    marketCap: 800000, // 8 lakh crores
    peRatio: 18.5,
    dividendYield: 1.5,
    exchange: 'NSE',
    basePrice: 1600,
    volatility: 0.022, // 2.2% daily volatility
    avgVolume: 8000000, // 80 lakh shares
    description: 'India\'s largest private sector bank by market capitalization, offering a wide range of banking and financial services.',
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Technology',
    industry: 'IT Services',
    marketCap: 600000, // 6 lakh crores
    peRatio: 28.0,
    dividendYield: 2.1,
    exchange: 'NSE',
    basePrice: 1400,
    volatility: 0.023, // 2.3% daily volatility
    avgVolume: 6000000, // 60 lakh shares
    description: 'Global leader in next-generation digital services and consulting, enabling clients to navigate their digital transformation.',
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    sector: 'Financial Services',
    industry: 'Banking',
    marketCap: 550000, // 5.5 lakh crores
    peRatio: 16.8,
    dividendYield: 1.8,
    exchange: 'NSE',
    basePrice: 950,
    volatility: 0.024, // 2.4% daily volatility
    avgVolume: 12000000, // 1.2 crore shares
    description: 'India\'s second-largest private sector bank, offering a wide range of banking products and financial services.',
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Limited',
    sector: 'Consumer Goods',
    industry: 'FMCG',
    marketCap: 500000, // 5 lakh crores
    peRatio: 45.2,
    dividendYield: 1.9,
    exchange: 'NSE',
    basePrice: 2200,
    volatility: 0.018, // 1.8% daily volatility
    avgVolume: 2000000, // 20 lakh shares
    description: 'India\'s largest FMCG company, offering products in home care, personal care, and foods and refreshments.',
  },
  {
    symbol: 'ITC',
    name: 'ITC Limited',
    sector: 'Consumer Goods',
    industry: 'FMCG',
    marketCap: 450000, // 4.5 lakh crores
    peRatio: 22.5,
    dividendYield: 3.2,
    exchange: 'NSE',
    basePrice: 400,
    volatility: 0.020, // 2% daily volatility
    avgVolume: 15000000, // 1.5 crore shares
    description: 'Diversified conglomerate with businesses in cigarettes, hotels, paperboards, packaging, agri-business, and FMCG.',
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Financial Services',
    industry: 'Banking',
    marketCap: 400000, // 4 lakh crores
    peRatio: 12.5,
    dividendYield: 2.8,
    exchange: 'NSE',
    basePrice: 650,
    volatility: 0.026, // 2.6% daily volatility
    avgVolume: 20000000, // 2 crore shares
    description: 'India\'s largest public sector bank, offering a wide range of banking products and services.',
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Limited',
    sector: 'Telecommunications',
    industry: 'Telecom Services',
    marketCap: 350000, // 3.5 lakh crores
    peRatio: 35.8,
    dividendYield: 0.5,
    exchange: 'NSE',
    basePrice: 950,
    volatility: 0.028, // 2.8% daily volatility
    avgVolume: 8000000, // 80 lakh shares
    description: 'India\'s leading telecommunications service provider, offering mobile, broadband, and digital TV services.',
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Limited',
    sector: 'Financial Services',
    industry: 'Banking',
    marketCap: 300000, // 3 lakh crores
    peRatio: 15.2,
    dividendYield: 1.6,
    exchange: 'NSE',
    basePrice: 950,
    volatility: 0.025, // 2.5% daily volatility
    avgVolume: 10000000, // 1 crore shares
    description: 'Third-largest private sector bank in India, offering a comprehensive range of financial services.',
  },
  {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank Limited',
    sector: 'Financial Services',
    industry: 'Banking',
    marketCap: 280000, // 2.8 lakh crores
    peRatio: 20.5,
    dividendYield: 1.3,
    exchange: 'NSE',
    basePrice: 1800,
    volatility: 0.022, // 2.2% daily volatility
    avgVolume: 3000000, // 30 lakh shares
    description: 'Leading private sector bank in India, known for its innovative banking solutions and strong customer focus.',
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Limited',
    sector: 'Consumer Goods',
    industry: 'Paints',
    marketCap: 250000, // 2.5 lakh crores
    peRatio: 55.8,
    dividendYield: 1.1,
    exchange: 'NSE',
    basePrice: 3200,
    volatility: 0.021, // 2.1% daily volatility
    avgVolume: 1500000, // 15 lakh shares
    description: 'India\'s largest paint company and Asia\'s third-largest paint company, offering decorative and industrial paints.',
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Limited',
    sector: 'Automobile',
    industry: 'Passenger Vehicles',
    marketCap: 220000, // 2.2 lakh crores
    peRatio: 28.5,
    dividendYield: 1.8,
    exchange: 'NSE',
    basePrice: 9500,
    volatility: 0.024, // 2.4% daily volatility
    avgVolume: 800000, // 8 lakh shares
    description: 'India\'s largest passenger vehicle manufacturer, producing cars, utility vehicles, and vans.',
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries Limited',
    sector: 'Healthcare',
    industry: 'Pharmaceuticals',
    marketCap: 200000, // 2 lakh crores
    peRatio: 32.5,
    dividendYield: 0.8,
    exchange: 'NSE',
    basePrice: 850,
    volatility: 0.026, // 2.6% daily volatility
    avgVolume: 5000000, // 50 lakh shares
    description: 'India\'s largest pharmaceutical company, specializing in generic and specialty medicines.',
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    sector: 'Automobile',
    industry: 'Automotive',
    marketCap: 180000, // 1.8 lakh crores
    peRatio: 18.5,
    dividendYield: 0.5,
    exchange: 'NSE',
    basePrice: 550,
    volatility: 0.030, // 3% daily volatility
    avgVolume: 15000000, // 1.5 crore shares
    description: 'India\'s largest automobile manufacturer, producing passenger cars, trucks, vans, and buses.',
  },
];

// Market sectors for categorization
export const MARKET_SECTORS = {
  'Technology': ['TCS', 'INFY'],
  'Financial Services': ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK'],
  'Consumer Goods': ['HINDUNILVR', 'ITC', 'ASIANPAINT'],
  'Oil & Gas': ['RELIANCE'],
  'Telecommunications': ['BHARTIARTL'],
  'Automobile': ['MARUTI', 'TATAMOTORS'],
  'Healthcare': ['SUNPHARMA'],
};

// Get company by symbol with proper edge case handling
export function getCompanyBySymbol(symbol: unknown): IndianCompany | undefined {
  // Handle null, undefined, or non-string values
  if (!symbol || typeof symbol !== 'string') {
    console.warn('⚠️ getCompanyBySymbol: Invalid symbol provided:', {
      symbol,
      type: typeof symbol,
      isNull: symbol === null,
      isUndefined: symbol === undefined
    });
    return undefined;
  }
  
  // Handle empty string
  if (symbol.trim().length === 0) {
    console.warn('⚠️ getCompanyBySymbol: Empty symbol provided');
    return undefined;
  }
  
  try {
    const upperSymbol = symbol.trim().toUpperCase();
    return INDIAN_COMPANIES.find(company => company.symbol === upperSymbol);
  } catch (error) {
    console.error('❌ getCompanyBySymbol: Error processing symbol:', {
      symbol,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return undefined;
  }
}

// Get companies by sector with edge case handling
export function getCompaniesBySector(sector: unknown): IndianCompany[] {
  // Handle null, undefined, or non-string values
  if (!sector || typeof sector !== 'string') {
    console.warn('⚠️ getCompaniesBySector: Invalid sector provided:', {
      sector,
      type: typeof sector
    });
    return [];
  }
  
  // Handle empty string
  if (sector.trim().length === 0) {
    console.warn('⚠️ getCompaniesBySector: Empty sector provided');
    return [];
  }
  
  try {
    const cleanSector = sector.trim();
    return INDIAN_COMPANIES.filter(company => company.sector === cleanSector);
  } catch (error) {
    console.error('❌ getCompaniesBySector: Error processing sector:', {
      sector,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return [];
  }
}

// Get all company symbols
export function getAllSymbols(): string[] {
  return INDIAN_COMPANIES.map(company => company.symbol);
}

// Get companies with market cap above threshold with edge case handling
export function getLargeCapCompanies(threshold: unknown = 100000): IndianCompany[] {
  // Handle null, undefined, or non-number values
  if (threshold === null || threshold === undefined || typeof threshold !== 'number') {
    console.warn('⚠️ getLargeCapCompanies: Invalid threshold provided:', {
      threshold,
      type: typeof threshold
    });
    return [];
  }
  
  // Handle negative threshold
  if (threshold < 0) {
    console.warn('⚠️ getLargeCapCompanies: Negative threshold provided:', threshold);
    return [];
  }
  
  try {
    return INDIAN_COMPANIES.filter(company => company.marketCap >= threshold);
  } catch (error) {
    console.error('❌ getLargeCapCompanies: Error processing threshold:', {
      threshold,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return [];
  }
}

// Get companies by exchange with edge case handling
export function getCompaniesByExchange(exchange: unknown): IndianCompany[] {
  // Handle null, undefined, or non-string values
  if (!exchange || typeof exchange !== 'string') {
    console.warn('⚠️ getCompaniesByExchange: Invalid exchange provided:', {
      exchange,
      type: typeof exchange
    });
    return [];
  }
  
  // Handle empty string
  if (exchange.trim().length === 0) {
    console.warn('⚠️ getCompaniesByExchange: Empty exchange provided');
    return [];
  }
  
  try {
    const cleanExchange = exchange.trim().toUpperCase();
    // Validate exchange value
    if (!['NSE', 'BSE', 'BOTH'].includes(cleanExchange)) {
      console.warn('⚠️ getCompaniesByExchange: Invalid exchange value:', cleanExchange);
      return [];
    }
    return INDIAN_COMPANIES.filter(company => company.exchange === cleanExchange);
  } catch (error) {
    console.error('❌ getCompaniesByExchange: Error processing exchange:', {
      exchange,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return [];
  }
}
