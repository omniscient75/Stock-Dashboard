// Indian Companies Data
// This file contains data for major Indian companies listed on NSE/BSE

import { IndianCompany } from '@/types/stock';

export const INDIAN_COMPANIES: IndianCompany[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Oil & Gas',
    industry: 'Refineries',
    marketCap: 1500000, // 15 lakh crores
    peRatio: 25.5,
    dividendYield: 0.8,
    exchange: 'NSE',
    basePrice: 2500,
    volatility: 0.025,
    avgVolume: 5000000,
    description: 'India\'s largest private sector company with interests in energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    sector: 'Information Technology',
    industry: 'Software',
    marketCap: 1200000, // 12 lakh crores
    peRatio: 30.2,
    dividendYield: 1.2,
    exchange: 'NSE',
    basePrice: 3800,
    volatility: 0.020,
    avgVolume: 3000000,
    description: 'Leading global IT services, consulting and business solutions organization.',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking',
    industry: 'Private Banks',
    marketCap: 800000, // 8 lakh crores
    peRatio: 18.5,
    dividendYield: 1.5,
    exchange: 'NSE',
    basePrice: 1600,
    volatility: 0.030,
    avgVolume: 8000000,
    description: 'One of India\'s leading private sector banks, providing a wide range of banking and financial services.',
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    sector: 'Information Technology',
    industry: 'Software',
    marketCap: 600000, // 6 lakh crores
    peRatio: 28.0,
    dividendYield: 2.1,
    exchange: 'NSE',
    basePrice: 1400,
    volatility: 0.022,
    avgVolume: 4000000,
    description: 'Global leader in next-generation digital services and consulting.',
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    sector: 'Banking',
    industry: 'Private Banks',
    marketCap: 500000, // 5 lakh crores
    peRatio: 16.8,
    dividendYield: 1.8,
    exchange: 'NSE',
    basePrice: 900,
    volatility: 0.035,
    avgVolume: 10000000,
    description: 'Leading private sector bank in India with a comprehensive range of banking products and financial services.',
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd',
    sector: 'FMCG',
    industry: 'Personal Care',
    marketCap: 450000, // 4.5 lakh crores
    peRatio: 45.2,
    dividendYield: 2.5,
    exchange: 'NSE',
    basePrice: 2000,
    volatility: 0.018,
    avgVolume: 2000000,
    description: 'India\'s largest FMCG company with a strong portfolio of brands across categories.',
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd',
    sector: 'FMCG',
    industry: 'Tobacco',
    marketCap: 400000, // 4 lakh crores
    peRatio: 22.5,
    dividendYield: 3.2,
    exchange: 'NSE',
    basePrice: 320,
    volatility: 0.020,
    avgVolume: 15000000,
    description: 'Diversified conglomerate with businesses spanning cigarettes, hotels, paperboards, packaging, agri-business, and FMCG.',
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking',
    industry: 'Public Banks',
    marketCap: 350000, // 3.5 lakh crores
    peRatio: 12.5,
    dividendYield: 2.8,
    exchange: 'NSE',
    basePrice: 400,
    volatility: 0.040,
    avgVolume: 20000000,
    description: 'India\'s largest public sector bank with extensive branch network and diverse financial services.',
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    sector: 'Telecommunications',
    industry: 'Telecom Services',
    marketCap: 300000, // 3 lakh crores
    peRatio: 35.8,
    dividendYield: 1.1,
    exchange: 'NSE',
    basePrice: 800,
    volatility: 0.045,
    avgVolume: 8000000,
    description: 'Leading global telecommunications company with operations in 18 countries across Asia and Africa.',
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd',
    sector: 'Banking',
    industry: 'Private Banks',
    marketCap: 250000, // 2.5 lakh crores
    peRatio: 15.2,
    dividendYield: 2.0,
    exchange: 'NSE',
    basePrice: 850,
    volatility: 0.038,
    avgVolume: 6000000,
    description: 'Third largest private sector bank in India with a strong focus on retail banking.',
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd',
    sector: 'Chemicals',
    industry: 'Paints',
    marketCap: 200000, // 2 lakh crores
    peRatio: 55.0,
    dividendYield: 1.8,
    exchange: 'NSE',
    basePrice: 3200,
    volatility: 0.025,
    avgVolume: 1500000,
    description: 'India\'s largest and Asia\'s third largest paint company with operations in 15 countries.',
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd',
    sector: 'Automobile',
    industry: 'Passenger Cars',
    marketCap: 180000, // 1.8 lakh crores
    peRatio: 28.5,
    dividendYield: 1.5,
    exchange: 'NSE',
    basePrice: 6000,
    volatility: 0.030,
    avgVolume: 2000000,
    description: 'India\'s largest passenger vehicle manufacturer with over 50% market share.',
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries Ltd',
    sector: 'Healthcare',
    industry: 'Pharmaceuticals',
    marketCap: 160000, // 1.6 lakh crores
    peRatio: 32.5,
    dividendYield: 1.2,
    exchange: 'NSE',
    basePrice: 650,
    volatility: 0.035,
    avgVolume: 5000000,
    description: 'India\'s largest pharmaceutical company and the world\'s fourth largest specialty generic pharmaceutical company.',
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    sector: 'Automobile',
    industry: 'Commercial Vehicles',
    marketCap: 140000, // 1.4 lakh crores
    peRatio: 18.5,
    dividendYield: 0.8,
    exchange: 'NSE',
    basePrice: 450,
    volatility: 0.050,
    avgVolume: 8000000,
    description: 'India\'s largest automobile manufacturer with presence in commercial vehicles, passenger vehicles, and electric vehicles.',
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    sector: 'Information Technology',
    industry: 'Software',
    marketCap: 120000, // 1.2 lakh crores
    peRatio: 25.8,
    dividendYield: 2.5,
    exchange: 'NSE',
    basePrice: 400,
    volatility: 0.028,
    avgVolume: 6000000,
    description: 'Leading global information technology, consulting and business process services company.',
  },
];

// Market sectors for categorization
export const MARKET_SECTORS = [
  'Banking',
  'Information Technology',
  'FMCG',
  'Oil & Gas',
  'Automobile',
  'Healthcare',
  'Telecommunications',
  'Chemicals',
  'Metals',
  'Real Estate',
  'Power',
  'Media',
  'Consumer Durables',
  'Capital Goods',
  'Others',
];

// Helper functions - REMOVED to prevent errors
// export const getCompanyBySymbol = (symbol: unknown): IndianCompany | undefined => {
//   console.warn('⚠️ getCompanyBySymbol is disabled - use self-contained data generation instead');
//   return undefined;
// };

export const getCompaniesBySector = (sector: string): IndianCompany[] => {
  return INDIAN_COMPANIES.filter(company => company.sector === sector);
};

export const getAllSymbols = (): string[] => {
  return INDIAN_COMPANIES.map(company => company.symbol);
};

export const getLargeCapCompanies = (): IndianCompany[] => {
  return INDIAN_COMPANIES.filter(company => company.marketCap >= 100000); // 1 lakh crore and above
};

export const getCompaniesByExchange = (exchange: string): IndianCompany[] => {
  return INDIAN_COMPANIES.filter(company => company.exchange === exchange);
};
