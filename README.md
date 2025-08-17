# 📈 Stock Dashboard

A modern, real-time stock market dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Stock Data**: Track your favorite stocks with live price updates
- **Beautiful Charts**: Interactive charts powered by Chart.js
- **Type Safety**: Full TypeScript support with strict mode
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Automatic dark/light theme switching
- **Professional UI**: Clean, financial-themed design
- **Database Ready**: PostgreSQL with Prisma ORM integration

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js + react-chartjs-2
- **Database**: PostgreSQL + Prisma ORM
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Third-party library configurations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for database features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) - Trust and professionalism
- **Success**: Green (#10b981) - Positive price changes
- **Danger**: Red (#ef4444) - Negative price changes
- **Neutral**: Gray (#6b7280) - No change

### Typography
- **Sans**: Inter - Clean, readable text
- **Mono**: JetBrains Mono - Numbers and code

### Components
- Responsive grid layouts
- Card-based design
- Hover effects and transitions
- Dark mode support

## 📊 Data Types

The application uses strongly-typed interfaces for all stock data:

```typescript
interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  // ... more fields
}
```

## 🔧 Configuration Files

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- Path mapping for clean imports
- Modern ES2020 target
- Additional safety checks

### Tailwind CSS (`globals.css`)
- Custom CSS variables for theming
- Financial-specific color palette
- Dark mode support
- Custom utility classes

### Next.js (`next.config.ts`)
- Optimized for performance
- Image optimization
- TypeScript support

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Strict mode catches type errors
- **ESLint**: Code style and best practices
- **Prettier**: Consistent code formatting

## 📈 Next Steps

1. **Database Setup**: Configure PostgreSQL and Prisma
2. **API Integration**: Connect to real stock data APIs
3. **Authentication**: Add user accounts and portfolios
4. **Charts**: Implement interactive stock charts
5. **Real-time Updates**: Add WebSocket connections
6. **Deployment**: Deploy to Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review the [TypeScript handbook](https://www.typescriptlang.org/docs)
3. Consult the [Tailwind CSS docs](https://tailwindcss.com/docs)

---

**Happy coding! 📈💻**
