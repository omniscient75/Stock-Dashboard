import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'StockDash - Professional Stock Market Dashboard',
  description: 'Real-time stock market analytics, interactive charts, and comprehensive portfolio tracking for informed investment decisions.',
  keywords: 'stock market, trading, charts, portfolio, analytics, dashboard, financial, investment',
  authors: [{ name: 'StockDash Team' }],
  openGraph: {
    title: 'StockDash - Professional Stock Market Dashboard',
    description: 'Real-time stock market analytics and interactive charts',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StockDash Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StockDash - Professional Stock Market Dashboard',
    description: 'Real-time stock market analytics and interactive charts',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
