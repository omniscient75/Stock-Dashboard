import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Inter font for clean, professional typography - perfect for financial data
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Improves loading performance
});

// JetBrains Mono for code and numbers - great for stock prices and data
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Enhanced metadata for better SEO and user experience
export const metadata: Metadata = {
  title: "Stock Dashboard | Real-time Market Data",
  description: "Track your favorite stocks with real-time data, charts, and portfolio management",
  keywords: ["stocks", "dashboard", "market data", "portfolio", "trading"],
  authors: [{ name: "Your Name" }],
  // Open Graph metadata for social sharing
  openGraph: {
    title: "Stock Dashboard | Real-time Market Data",
    description: "Track your favorite stocks with real-time data, charts, and portfolio management",
    type: "website",
  },
};

// Separate viewport export to fix the warning
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-full bg-gray-50`}
      >
        {/* Main container with proper height for full-screen dashboard */}
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
