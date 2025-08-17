# 🚀 Database Setup Guide

## 📋 Prerequisites

Before setting up the database, make sure you have:

1. **Node.js 18+** installed
2. **PostgreSQL** installed and running (or use SQLite for development)
3. **Environment variables** configured

## 🔧 Step-by-Step Setup

### **Step 1: Environment Configuration**

Create a `.env` file in your project root:

```bash
# For PostgreSQL (recommended)
DATABASE_URL="postgresql://username:password@localhost:5432/stock_dashboard"

# For SQLite (development - easier setup)
# DATABASE_URL="file:./dev.db"

# Other environment variables
NODE_ENV="development"
```

### **Step 2: Database Setup**

#### **Option A: PostgreSQL (Production Ready)**

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql

   # Windows with Chocolatey
   choco install postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE stock_dashboard;
   
   # Exit
   \q
   ```

#### **Option B: SQLite (Development)**

1. **Update schema.prisma**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Set environment variable**
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

### **Step 3: Initialize Database**

1. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

2. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

3. **Seed Database with Sample Data**
   ```bash
   npm run db:seed
   ```

### **Step 4: Verify Setup**

1. **Open Prisma Studio** (Database GUI)
   ```bash
   npm run db:studio
   ```

2. **Check the data** in your browser at `http://localhost:5555`

## 🧪 Testing the Setup

### **Test Database Connection**

Create a test file to verify everything works:

```typescript
// test-db.ts
import { prisma } from './src/lib/database';

async function testConnection() {
  try {
    // Test basic query
    const companies = await prisma.company.findMany({
      take: 5,
    });
    
    console.log('✅ Database connection successful!');
    console.log(`Found ${companies.length} companies`);
    
    // Test relationship query
    const stockWithCompany = await prisma.stockPrice.findFirst({
      include: {
        company: true,
      },
    });
    
    if (stockWithCompany) {
      console.log(`✅ Sample stock: ${stockWithCompany.company.symbol} - $${stockWithCompany.close}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

Run the test:
```bash
npx tsx test-db.ts
```

## 📊 Database Commands Reference

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Populate database with sample data |
| `npm run db:reset` | Reset database and re-seed |

## 🔍 Troubleshooting

### **Common Issues**

#### **1. Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Windows
net start postgresql

# Linux
sudo systemctl start postgresql
```

#### **2. Authentication Failed**
```
Error: password authentication failed for user "postgres"
```
**Solution**: Check your DATABASE_URL format
```bash
# Correct format
DATABASE_URL="postgresql://username:password@localhost:5432/stock_dashboard"
```

#### **3. Database Doesn't Exist**
```
Error: database "stock_dashboard" does not exist
```
**Solution**: Create the database
```bash
createdb stock_dashboard
# or
psql -U postgres -c "CREATE DATABASE stock_dashboard;"
```

#### **4. Permission Denied**
```
Error: permission denied for table "companies"
```
**Solution**: Grant permissions
```sql
GRANT ALL PRIVILEGES ON DATABASE stock_dashboard TO your_username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
```

### **Reset Everything**

If you need to start fresh:

```bash
# Reset database
npm run db:reset

# Or manually
npm run db:migrate -- --force-reset
npm run db:seed
```

## 🎯 Next Steps

After successful setup:

1. **Explore the data** in Prisma Studio
2. **Run the application** with `npm run dev`
3. **Check the API routes** in `src/app/api/`
4. **Review the database design** in `DATABASE_DESIGN.md`

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Database Design Guide](./DATABASE_DESIGN.md)

---

**Need help?** Check the troubleshooting section or create an issue in the repository! 🆘
