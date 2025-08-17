// Database seed file
// This file populates the database with sample data for development

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Sample company data
const sampleCompanies = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: BigInt(3000000000000), // 3 trillion
    employees: 164000,
    website: 'https://www.apple.com',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    marketCap: BigInt(1800000000000), // 1.8 trillion
    employees: 156500,
    website: 'https://www.google.com',
    description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    marketCap: BigInt(2800000000000), // 2.8 trillion
    employees: 221000,
    website: 'https://www.microsoft.com',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    marketCap: BigInt(800000000000), // 800 billion
    employees: 127855,
    website: 'https://www.tesla.com',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    marketCap: BigInt(1600000000000), // 1.6 trillion
    employees: 1608000,
    website: 'https://www.amazon.com',
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    marketCap: BigInt(1200000000000), // 1.2 trillion
    employees: 26473,
    website: 'https://www.nvidia.com',
    description: 'NVIDIA Corporation operates as a visual computing company worldwide.',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    marketCap: BigInt(900000000000), // 900 billion
    employees: 86482,
    website: 'https://www.meta.com',
    description: 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.',
  },
  {
    symbol: 'BRK.A',
    name: 'Berkshire Hathaway Inc.',
    sector: 'Financial Services',
    industry: 'Insurance—Diversified',
    marketCap: BigInt(700000000000), // 700 billion
    employees: 372000,
    website: 'https://www.berkshirehathaway.com',
    description: 'Berkshire Hathaway Inc. is a holding company, which engages in the provision of property and casualty insurance and reinsurance.',
  },
];

// Generate historical price data for a company
function generateHistoricalPrices(companyId: string, days: number = 365) {
  const prices = [];
  const basePrice = Math.random() * 500 + 50; // Random base price between $50-$550
  let currentPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Generate realistic price movement
    const volatility = 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + change);

    const open = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, currentPrice) * (1 + Math.random() * 0.02);
    const low = Math.min(open, currentPrice) * (1 - Math.random() * 0.02);
    const close = currentPrice;
    const volume = Math.floor(Math.random() * 10000000) + 1000000; // 1M-11M volume

    prices.push({
      companyId,
      date,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume: BigInt(volume),
      adjustedClose: parseFloat(close.toFixed(4)),
    });
  }

  return prices;
}

// Generate sample user data
function generateUsers() {
  return [
    {
      email: 'demo@stockdashboard.com',
      name: 'Demo User',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // "password123"
      isActive: true,
    },
    {
      email: 'test@stockdashboard.com',
      name: 'Test User',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // "password123"
      isActive: true,
    },
  ];
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await prisma.transaction.deleteMany();
  await prisma.portfolioPosition.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.stockPrice.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Create companies
  console.log('🏢 Creating companies...');
  const companies = [];
  for (const companyData of sampleCompanies) {
    const company = await prisma.company.create({
      data: companyData,
    });
    companies.push(company);
    console.log(`Created company: ${company.symbol} - ${company.name}`);
  }

  // Create historical price data
  console.log('📈 Generating historical price data...');
  for (const company of companies) {
    const prices = generateHistoricalPrices(company.id, 365); // 1 year of data
    await prisma.stockPrice.createMany({
      data: prices,
    });
    console.log(`Generated ${prices.length} price records for ${company.symbol}`);
  }

  // Create users
  console.log('👥 Creating users...');
  const users = [];
  for (const userData of generateUsers()) {
    const user = await prisma.user.create({
      data: userData,
    });
    users.push(user);
    console.log(`Created user: ${user.email}`);
  }

  // Create sample watchlist items
  console.log('👀 Creating watchlist items...');
  for (const user of users) {
    // Add 3 random companies to each user's watchlist
    const randomCompanies = companies.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const company of randomCompanies) {
      await prisma.watchlistItem.create({
        data: {
          userId: user.id,
          companyId: company.id,
          targetPrice: Math.random() > 0.5 ? parseFloat((Math.random() * 100 + 50).toFixed(2)) : null,
          notes: Math.random() > 0.7 ? faker.lorem.sentence() : null,
        },
      });
    }
    console.log(`Created watchlist for user: ${user.email}`);
  }

  // Create sample portfolio positions
  console.log('💼 Creating portfolio positions...');
  for (const user of users) {
    // Add 2 random companies to each user's portfolio
    const randomCompanies = companies.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    for (const company of randomCompanies) {
      const shares = parseFloat((Math.random() * 100 + 10).toFixed(2)); // 10-110 shares
      const averagePrice = parseFloat((Math.random() * 200 + 50).toFixed(2)); // $50-$250 average price
      
      await prisma.portfolioPosition.create({
        data: {
          userId: user.id,
          companyId: company.id,
          shares,
          averagePrice,
        },
      });

      // Create some sample transactions
      const transactionCount = Math.floor(Math.random() * 3) + 1; // 1-3 transactions
      for (let i = 0; i < transactionCount; i++) {
        const transactionShares = shares / transactionCount;
        const transactionPrice = averagePrice + (Math.random() - 0.5) * 20; // ±$10 from average
        
        await prisma.transaction.create({
          data: {
            userId: user.id,
            companyId: company.id,
            type: Math.random() > 0.5 ? 'BUY' : 'SELL',
            shares: parseFloat(transactionShares.toFixed(2)),
            price: parseFloat(transactionPrice.toFixed(2)),
            total: parseFloat((transactionShares * transactionPrice).toFixed(2)),
            fees: parseFloat((Math.random() * 10).toFixed(2)),
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
            notes: Math.random() > 0.7 ? faker.lorem.sentence() : null,
          },
        });
      }
    }
    console.log(`Created portfolio for user: ${user.email}`);
  }

  console.log('✅ Database seeding completed!');
  console.log(`📊 Created ${companies.length} companies with historical data`);
  console.log(`👥 Created ${users.length} users with sample portfolios and watchlists`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
