// Database configuration and utilities
// This file sets up the Prisma client and provides database helper functions

import { PrismaClient } from '@prisma/client';

// Global variable to prevent multiple Prisma Client instances in development
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma Client instance
export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// In development, save the instance to global scope to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Database utility functions
export class DatabaseService {
  /**
   * Get the latest stock price for a company
   * @param symbol - Stock symbol
   * @returns Latest stock price or null
   */
  static async getLatestPrice(symbol: string) {
    return await prisma.stockPrice.findFirst({
      where: {
        company: {
          symbol: symbol.toUpperCase(),
        },
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        company: true,
      },
    });
  }

  /**
   * Get historical prices for a company within a date range
   * @param symbol - Stock symbol
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of stock prices
   */
  static async getHistoricalPrices(
    symbol: string,
    startDate: Date,
    endDate: Date
  ) {
    return await prisma.stockPrice.findMany({
      where: {
        company: {
          symbol: symbol.toUpperCase(),
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        company: true,
      },
    });
  }

  /**
   * Get all active companies
   * @returns Array of active companies
   */
  static async getActiveCompanies() {
    return await prisma.company.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        symbol: 'asc',
      },
    });
  }

  /**
   * Get companies by sector
   * @param sector - Sector name
   * @returns Array of companies in the sector
   */
  static async getCompaniesBySector(sector: string) {
    return await prisma.company.findMany({
      where: {
        sector: sector,
        isActive: true,
      },
      orderBy: {
        symbol: 'asc',
      },
    });
  }

  /**
   * Get user's watchlist
   * @param userId - User ID
   * @returns Array of watchlist items with company data
   */
  static async getUserWatchlist(userId: string) {
    return await prisma.watchlistItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        company: {
          include: {
            stockPrices: {
              orderBy: {
                date: 'desc',
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        addedAt: 'desc',
      },
    });
  }

  /**
   * Get user's portfolio
   * @param userId - User ID
   * @returns Array of portfolio positions with company data
   */
  static async getUserPortfolio(userId: string) {
    return await prisma.portfolioPosition.findMany({
      where: {
        userId: userId,
      },
      include: {
        company: {
          include: {
            stockPrices: {
              orderBy: {
                date: 'desc',
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Get market summary statistics
   * @returns Market summary data
   */
  static async getMarketSummary() {
    const [totalCompanies, totalVolume, averagePrice] = await Promise.all([
      prisma.company.count({
        where: { isActive: true },
      }),
      prisma.stockPrice.aggregate({
        where: {
          date: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        _sum: {
          volume: true,
        },
      }),
      prisma.stockPrice.aggregate({
        where: {
          date: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        _avg: {
          close: true,
        },
      }),
    ]);

    return {
      totalCompanies,
      totalVolume: totalVolume._sum.volume || BigInt(0),
      averagePrice: averagePrice._avg.close || 0,
      date: new Date(),
    };
  }
}

// Export the Prisma client for direct use
export { prisma as db };
