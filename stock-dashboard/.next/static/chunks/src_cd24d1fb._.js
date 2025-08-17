(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/charts/StockLineChart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "StockLineChart": ()=>StockLineChart
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chartjs-2/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Register Chart.js components we need
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Title"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"]);
const StockLineChart = (param)=>{
    let { data, title = 'Stock Price', height = 400, showLegend = true, loading = false, error = null } = param;
    _s();
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Memoize chart data to prevent unnecessary re-renders
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StockLineChart.useMemo[chartData]": ()=>{
            if (!data || data.length === 0) {
                return {
                    labels: [],
                    datasets: []
                };
            }
            // Sort data by date to ensure proper time sequence
            const sortedData = [
                ...data
            ].sort({
                "StockLineChart.useMemo[chartData].sortedData": (a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime()
            }["StockLineChart.useMemo[chartData].sortedData"]);
            return {
                labels: sortedData.map({
                    "StockLineChart.useMemo[chartData]": (item)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(item.date), 'MMM dd')
                }["StockLineChart.useMemo[chartData]"]),
                datasets: [
                    {
                        label: 'Close Price',
                        data: sortedData.map({
                            "StockLineChart.useMemo[chartData]": (item)=>Number(item.close)
                        }["StockLineChart.useMemo[chartData]"]),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    }
                ]
            };
        }
    }["StockLineChart.useMemo[chartData]"], [
        data
    ]);
    // Chart configuration options
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StockLineChart.useMemo[options]": ()=>({
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: showLegend,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            }
                        }
                    },
                    title: {
                        display: !!title,
                        text: title,
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: 'Inter, sans-serif'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: ({
                                "StockLineChart.useMemo[options]": (context)=>{
                                    var _data_dataIndex;
                                    const dataIndex = context[0].dataIndex;
                                    const date = (_data_dataIndex = data[dataIndex]) === null || _data_dataIndex === void 0 ? void 0 : _data_dataIndex.date;
                                    return date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(date), 'MMM dd, yyyy') : '';
                                }
                            })["StockLineChart.useMemo[options]"],
                            label: ({
                                "StockLineChart.useMemo[options]": (context)=>{
                                    const value = context.parsed.y;
                                    return "".concat(context.dataset.label, ": ₹").concat(value.toFixed(2));
                                }
                            })["StockLineChart.useMemo[options]"]
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: false
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 8,
                            font: {
                                size: 11,
                                family: 'Inter, sans-serif'
                            },
                            color: '#6b7280'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                family: 'Inter, sans-serif'
                            },
                            color: '#6b7280',
                            callback: ({
                                "StockLineChart.useMemo[options]": (value)=>"₹".concat(Number(value).toFixed(0))
                            })["StockLineChart.useMemo[options]"]
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    point: {
                        hoverRadius: 6
                    }
                }
            })
    }["StockLineChart.useMemo[options]"], [
        title,
        showLegend,
        data
    ]);
    // Cleanup chart instance on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StockLineChart.useEffect": ()=>{
            return ({
                "StockLineChart.useEffect": ()=>{
                    if (chartRef.current) {
                        chartRef.current.destroy();
                    }
                }
            })["StockLineChart.useEffect"];
        }
    }["StockLineChart.useEffect"], []);
    // Loading state
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
            style: {
                height
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/StockLineChart.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 dark:text-gray-400 text-sm",
                        children: "Loading chart..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/StockLineChart.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/StockLineChart.tsx",
                lineNumber: 212,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/charts/StockLineChart.tsx",
            lineNumber: 208,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
            style: {
                height
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-red-500 text-2xl mb-2",
                        children: "⚠️"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/StockLineChart.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-600 dark:text-red-400 text-sm",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/StockLineChart.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/StockLineChart.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/charts/StockLineChart.tsx",
            lineNumber: 223,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Empty data state
    if (!data || data.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
            style: {
                height
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-gray-400 text-2xl mb-2",
                        children: "📊"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/StockLineChart.tsx",
                        lineNumber: 243,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 dark:text-gray-400 text-sm",
                        children: "No data available"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/StockLineChart.tsx",
                        lineNumber: 244,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/StockLineChart.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/charts/StockLineChart.tsx",
            lineNumber: 238,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4",
        style: {
            height
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
            ref: chartRef,
            data: chartData,
            options: options
        }, void 0, false, {
            fileName: "[project]/src/components/charts/StockLineChart.tsx",
            lineNumber: 255,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/charts/StockLineChart.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StockLineChart, "Y3KrPvS4usQmbtO0/ORXUFv3zLk=");
_c = StockLineChart;
var _c;
__turbopack_context__.k.register(_c, "StockLineChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/charts/index.ts [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Chart Components Export
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$charts$2f$StockLineChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/charts/StockLineChart.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/charts/index.ts [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$charts$2f$StockLineChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/charts/StockLineChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$charts$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/charts/index.ts [app-client] (ecmascript) <locals>");
}),
"[project]/src/app/charts-demo/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>ChartsDemoPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$charts$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/charts/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$charts$2f$StockLineChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/charts/StockLineChart.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ChartsDemoPage() {
    var _companies_find;
    _s();
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedCompany, setSelectedCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('RELIANCE');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Completely self-contained data generation
    const generateChartData = function(symbol) {
        let days = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 30;
        console.log('🔍 generateChartData called with:', {
            symbol,
            days
        });
        // Safe type checking
        if (!symbol || typeof symbol !== 'string') {
            console.error('❌ Invalid symbol:', symbol);
            return [];
        }
        const upperSymbol = symbol.trim().toUpperCase();
        console.log('✅ Processing symbol:', upperSymbol);
        // Company data - completely self-contained
        const companies = {
            'RELIANCE': {
                basePrice: 2500,
                volatility: 0.025,
                avgVolume: 5000000
            },
            'TCS': {
                basePrice: 3500,
                volatility: 0.020,
                avgVolume: 3000000
            },
            'HDFCBANK': {
                basePrice: 1500,
                volatility: 0.030,
                avgVolume: 4000000
            },
            'INFY': {
                basePrice: 1400,
                volatility: 0.022,
                avgVolume: 3500000
            },
            'ICICIBANK': {
                basePrice: 900,
                volatility: 0.035,
                avgVolume: 4500000
            }
        };
        const company = companies[upperSymbol];
        if (!company) {
            console.warn('⚠️ Company not found:', upperSymbol);
            return [];
        }
        console.log('✅ Generating data for:', upperSymbol, company);
        // Generate data
        const data = [];
        let currentPrice = company.basePrice;
        const start = new Date();
        start.setDate(start.getDate() - days);
        for(let i = 0; i < days; i++){
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            // Skip weekends
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                continue;
            }
            // Generate price movement
            const change = (Math.random() - 0.5) * company.volatility * 2;
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
        console.log('✅ Generated', data.length, 'data points');
        return data;
    };
    // Generate mock data for demonstration
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartsDemoPage.useEffect": ()=>{
            const generateData = {
                "ChartsDemoPage.useEffect.generateData": async ()=>{
                    try {
                        var _chartData_, _chartData_1;
                        setLoading(true);
                        setError(null);
                        console.log('🔍 ChartsDemoPage: Starting data generation');
                        console.log('📊 Current selectedCompany:', {
                            selectedCompany,
                            type: typeof selectedCompany,
                            isString: typeof selectedCompany === 'string'
                        });
                        // Simulate API delay
                        await new Promise({
                            "ChartsDemoPage.useEffect.generateData": (resolve)=>setTimeout(resolve, 1000)
                        }["ChartsDemoPage.useEffect.generateData"]);
                        // Type guard 1: Ensure selectedCompany is a string
                        if (typeof selectedCompany !== 'string') {
                            console.error('❌ ChartsDemoPage: selectedCompany is not a string:', {
                                selectedCompany,
                                type: typeof selectedCompany
                            });
                            throw new Error('Invalid company symbol: not a string');
                        }
                        // Type guard 2: Ensure selectedCompany is not empty
                        if (selectedCompany.trim().length === 0) {
                            console.error('❌ ChartsDemoPage: selectedCompany is empty');
                            throw new Error('Invalid company symbol: empty string');
                        }
                        const companySymbol = selectedCompany.trim().toUpperCase();
                        console.log('✅ ChartsDemoPage: Using company symbol:', companySymbol);
                        // Generate data using self-contained function
                        console.log('🔍 ChartsDemoPage: Calling generateChartData');
                        const chartData = generateChartData(companySymbol, 30);
                        if (!chartData || chartData.length === 0) {
                            console.error('❌ ChartsDemoPage: No data generated for company:', companySymbol);
                            throw new Error("No data generated for ".concat(companySymbol));
                        }
                        console.log('✅ ChartsDemoPage: Successfully generated data:', {
                            company: companySymbol,
                            dataPoints: chartData.length,
                            firstDate: ((_chartData_ = chartData[0]) === null || _chartData_ === void 0 ? void 0 : _chartData_.date) || 'N/A',
                            lastDate: ((_chartData_1 = chartData[chartData.length - 1]) === null || _chartData_1 === void 0 ? void 0 : _chartData_1.date) || 'N/A'
                        });
                        setChartData(chartData);
                    } catch (err) {
                        console.error('❌ ChartsDemoPage: Error generating data:', err);
                        setError(err instanceof Error ? err.message : 'Failed to generate chart data. Please try again.');
                    } finally{
                        setLoading(false);
                    }
                }
            }["ChartsDemoPage.useEffect.generateData"];
            generateData();
        }
    }["ChartsDemoPage.useEffect"], [
        selectedCompany
    ]);
    // Company options for demo
    const companies = [
        {
            symbol: 'RELIANCE',
            name: 'Reliance Industries Ltd'
        },
        {
            symbol: 'TCS',
            name: 'Tata Consultancy Services Ltd'
        },
        {
            symbol: 'HDFCBANK',
            name: 'HDFC Bank Ltd'
        },
        {
            symbol: 'INFY',
            name: 'Infosys Ltd'
        },
        {
            symbol: 'ICICIBANK',
            name: 'ICICI Bank Ltd'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold text-gray-900 dark:text-white",
                                        children: "Stock Charts Demo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/charts-demo/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-gray-600 dark:text-gray-400",
                                        children: "Interactive stock charts built with Chart.js and React"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/charts-demo/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/charts-demo/page.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 sm:mt-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "company-select",
                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                        children: "Select Company:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/charts-demo/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "company-select",
                                        value: selectedCompany,
                                        onChange: (e)=>setSelectedCompany(e.target.value),
                                        className: "block w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        children: companies.map((company)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: company.symbol,
                                                children: [
                                                    company.symbol,
                                                    " - ",
                                                    company.name
                                                ]
                                            }, company.symbol, true, {
                                                fileName: "[project]/src/app/charts-demo/page.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/charts-demo/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/charts-demo/page.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/charts-demo/page.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/charts-demo/page.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/charts-demo/page.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900 dark:text-white mb-4",
                                children: [
                                    selectedCompany,
                                    " - ",
                                    (_companies_find = companies.find((c)=>c.symbol === selectedCompany)) === null || _companies_find === void 0 ? void 0 : _companies_find.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/charts-demo/page.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$charts$2f$StockLineChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StockLineChart"], {
                                data: chartData,
                                title: "".concat(selectedCompany, " Price Chart"),
                                height: 400,
                                loading: loading,
                                error: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/charts-demo/page.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/charts-demo/page.tsx",
                        lineNumber: 206,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/charts-demo/page.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/charts-demo/page.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/charts-demo/page.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_s(ChartsDemoPage, "5f55x00oOg9gJQDWl4nvrDf191A=");
_c = ChartsDemoPage;
var _c;
__turbopack_context__.k.register(_c, "ChartsDemoPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_cd24d1fb._.js.map