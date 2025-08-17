module.exports = {

"[project]/.next-internal/server/app/api/stocks/[symbol]/historical/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/stocks/[symbol]/historical/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Company data for mock generation
const companies = {
    'RELIANCE': {
        basePrice: 2500,
        volatility: 0.025,
        avgVolume: 5000000,
        name: 'Reliance Industries Ltd'
    },
    'TCS': {
        basePrice: 3500,
        volatility: 0.020,
        avgVolume: 3000000,
        name: 'Tata Consultancy Services Ltd'
    },
    'HDFCBANK': {
        basePrice: 1500,
        volatility: 0.030,
        avgVolume: 4000000,
        name: 'HDFC Bank Ltd'
    },
    'INFY': {
        basePrice: 1400,
        volatility: 0.022,
        avgVolume: 3500000,
        name: 'Infosys Ltd'
    },
    'ICICIBANK': {
        basePrice: 900,
        volatility: 0.035,
        avgVolume: 4500000,
        name: 'ICICI Bank Ltd'
    },
    'HINDUNILVR': {
        basePrice: 2200,
        volatility: 0.018,
        avgVolume: 2000000,
        name: 'Hindustan Unilever Ltd'
    },
    'ITC': {
        basePrice: 400,
        volatility: 0.020,
        avgVolume: 15000000,
        name: 'ITC Ltd'
    },
    'SBIN': {
        basePrice: 650,
        volatility: 0.026,
        avgVolume: 20000000,
        name: 'State Bank of India'
    }
};
/**
 * Generate realistic historical stock data
 * WHY this approach:
 * - Creates consistent data patterns for testing
 * - Simulates real market volatility and trends
 * - Provides enough data for 52-week calculations
 * - Maintains OHLCV relationships
 */ function generateHistoricalData(symbol, days = 365) {
    const company = companies[symbol];
    if (!company) {
        throw new Error(`Company not found: ${symbol}`);
    }
    const data = [];
    let currentPrice = company.basePrice;
    // Add some trend to make data more realistic
    let trend = 0;
    const trendChange = 0.001; // Small trend change per day
    const start = new Date();
    start.setDate(start.getDate() - days);
    for(let i = 0; i < days; i++){
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            continue;
        }
        // Update trend (random walk)
        trend += (Math.random() - 0.5) * trendChange;
        trend = Math.max(-0.01, Math.min(0.01, trend)); // Limit trend
        // Generate price movement with trend
        const change = (Math.random() - 0.5) * company.volatility * 2 + trend;
        const open = currentPrice * (1 + (Math.random() - 0.5) * company.volatility);
        const close = currentPrice * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * company.volatility);
        const low = Math.min(open, close) * (1 - Math.random() * company.volatility);
        const volume = company.avgVolume * (0.5 + Math.random());
        const dateString = currentDate.toISOString().split('T')[0];
        data.push({
            date: dateString,
            open: Math.max(0.01, open),
            high: Math.max(open, close, high),
            low: Math.min(open, close, low),
            close: Math.max(0.01, close),
            volume: Math.max(1000, Math.round(volume))
        });
        currentPrice = close;
    }
    return data;
}
/**
 * Calculate 52-week high/low from historical data
 * WHY these calculations:
 * - 52-week high/low are key technical indicators
 * - Help investors understand stock performance over a year
 * - Used for support/resistance analysis
 * - Important for risk assessment
 */ function calculate52WeekStats(historicalData) {
    if (historicalData.length === 0) {
        throw new Error('No historical data provided');
    }
    let week52High = historicalData[0].high;
    let week52Low = historicalData[0].low;
    let week52HighDate = historicalData[0].date;
    let week52LowDate = historicalData[0].date;
    for (const dataPoint of historicalData){
        if (dataPoint.high > week52High) {
            week52High = dataPoint.high;
            week52HighDate = dataPoint.date;
        }
        if (dataPoint.low < week52Low) {
            week52Low = dataPoint.low;
            week52LowDate = dataPoint.date;
        }
    }
    return {
        week52High,
        week52Low,
        week52HighDate,
        week52LowDate
    };
}
async function GET(request, { params }) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = params.symbol?.toUpperCase();
        const period = searchParams.get('period') || '1y'; // 1y, 6m, 3m, 1m
        // Validate symbol
        if (!symbol || !companies[symbol]) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid or unsupported stock symbol'
            }, {
                status: 400
            });
        }
        // Determine number of days based on period
        const daysMap = {
            '1m': 30,
            '3m': 90,
            '6m': 180,
            '1y': 365
        };
        const days = daysMap[period] || 365;
        const company = companies[symbol];
        // Generate historical data
        const historicalData = generateHistoricalData(symbol, days);
        // Calculate 52-week stats (always use 365 days for 52-week calculations)
        const fullYearData = generateHistoricalData(symbol, 365);
        const week52Stats = calculate52WeekStats(fullYearData);
        // Get current price (latest close)
        const currentPrice = historicalData[historicalData.length - 1].close;
        const previousPrice = historicalData[historicalData.length - 2]?.close || currentPrice;
        const currentChange = currentPrice - previousPrice;
        const currentChangePercent = currentChange / previousPrice * 100;
        const response = {
            symbol,
            companyName: company.name,
            currentPrice,
            currentChange,
            currentChangePercent,
            week52High: week52Stats.week52High,
            week52Low: week52Stats.week52Low,
            week52HighDate: week52Stats.week52HighDate,
            week52LowDate: week52Stats.week52LowDate,
            historicalData,
            dataPoints: historicalData.length,
            period
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (error) {
        console.error('Historical data API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch historical data'
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__623095bc._.js.map