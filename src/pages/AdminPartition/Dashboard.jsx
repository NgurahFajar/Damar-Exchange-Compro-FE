import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Activity, RefreshCcw, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '@utils/axiosInstance';
import MainLoading from "@components/Loaders/MainLoading";
import debounce from 'lodash/debounce';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Memoized StatCard Component
const StatCard = React.memo(({ title, value, icon: Icon, bgColor, subtitle }) => {
    const { cardClass, textClass, secondaryTextClass } = useTheme();
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${cardClass} p-6 rounded-lg shadow-lg`}
        >
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <p className={secondaryTextClass}>{title}</p>
                    <p className={`text-2xl font-semibold ${textClass}`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-400">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${bgColor}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </motion.div>
    );
});

// Memoized CurrencyTableRow Component
const CurrencyTableRow = React.memo(({ currency, highestSpreadValue }) => {
    const { tableRowClass, tableDataClass } = useTheme();

    // Memoize spread calculation
    const spread = useMemo(() =>
            parseFloat(currency.sell_rate) - parseFloat(currency.buy_rate),
        [currency.buy_rate, currency.sell_rate]
    );

    // Memoize formatted numbers
    const formattedBuyRate = useMemo(() =>
            `Rp. ${parseFloat(currency.buy_rate).toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`,
        [currency.buy_rate]
    );

    const formattedSellRate = useMemo(() =>
            `Rp. ${parseFloat(currency.sell_rate).toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`,
        [currency.sell_rate]
    );

    const formattedSpread = useMemo(() =>
            `Rp. ${spread.toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`,
        [spread]
    );

    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${tableRowClass} hover:bg-gray-700/50 transition-colors`}
        >
            <td className={`p-4 ${tableDataClass}`}>
                {currency.icon_url ? (
                    <img
                        src={currency.icon_url}
                        alt={currency.currency_code}
                        className="h-6 w-6 object-contain"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">
                            {currency.currency_code.charAt(0)}
                        </span>
                    </div>
                )}
            </td>
            <td className={`p-4 ${tableDataClass} font-medium`}>{currency.currency_code}</td>
            <td className={`p-4 ${tableDataClass}`}>{currency.currency_name}</td>
            <td className={`p-4 ${tableDataClass}`}>{formattedBuyRate}</td>
            <td className={`p-4 ${tableDataClass}`}>{formattedSellRate}</td>
            <td className={`p-4 ${tableDataClass}`}>
                <span className={spread > highestSpreadValue * 0.8 ? 'text-orange-400' : ''}>
                    {formattedSpread}
                </span>
            </td>
        </motion.tr>
    );
});

const Dashboard = () => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalCurrencies: 0,
        avgBuyRate: 0,
        avgSellRate: 0,
        highestSpread: { currency: '', value: 0 }
    });
    const [chartData, setChartData] = useState([]);
    const initialRender = useRef(true);
    const prevCurrenciesRef = useRef([]);
    const abortControllerRef = useRef(null);

    const {
        isDark,
        cardClass,
        textClass,
        secondaryTextClass,
        tableHeaderClass,
        tableRowClass,
        tableDataClass
    } = useTheme();

    // Optimized calculations with caching
    const calculateStats = useCallback((currencyData) => {
        if (JSON.stringify(currencyData) === JSON.stringify(prevCurrenciesRef.current)) {
            return;
        }
        prevCurrenciesRef.current = currencyData;

        const total = currencyData.length;
        if (total === 0) return;

        const calculations = currencyData.reduce((acc, curr) => {
            const buyRate = parseFloat(curr.buy_rate);
            const sellRate = parseFloat(curr.sell_rate);
            const spread = sellRate - buyRate;

            acc.totalBuy += buyRate;
            acc.totalSell += sellRate;

            if (spread > (acc.maxSpread?.value || 0)) {
                acc.maxSpread = {
                    currency: curr.currency_code,
                    value: spread,
                    name: curr.currency_name
                };
            }

            return acc;
        }, { totalBuy: 0, totalSell: 0, maxSpread: null });

        setStats({
            totalCurrencies: total,
            avgBuyRate: calculations.totalBuy / total,
            avgSellRate: calculations.totalSell / total,
            highestSpread: calculations.maxSpread
        });
    }, []);

    const prepareChartData = useCallback((currencyData) => {
        const data = currencyData.map(currency => {
            const buyRate = parseFloat(currency.buy_rate);
            const sellRate = parseFloat(currency.sell_rate);
            return {
                name: currency.currency_code,
                buyRate,
                sellRate,
                spread: sellRate - buyRate
            };
        });
        setChartData(data);
    }, []);

    // Debounced fetch with abort controller
    const debouncedFetch = useMemo(
        () => debounce(async () => {
            try {
                // Cancel previous request if exists
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current = new AbortController();

                setLoading(true);
                const response = await api.get('/currencies', {
                    signal: abortControllerRef.current.signal
                });

                if (response.status === 'success' && Array.isArray(response.data)) {
                    setCurrencies(response.data);
                    calculateStats(response.data);
                    prepareChartData(response.data);
                    setError(null);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Fetch error:', err);
                setError('Failed to fetch dashboard data');
                setCurrencies([]);
            } finally {
                setLoading(false);
            }
        }, 300),
        [calculateStats, prepareChartData]
    );

    const fetchData = useCallback(() => {
        debouncedFetch();
    }, [debouncedFetch]);

    useEffect(() => {
        fetchData();
        const refreshInterval = setInterval(fetchData, 300000);

        return () => {
            clearInterval(refreshInterval);
            debouncedFetch.cancel();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData, debouncedFetch]);

    // Memoized chart options
    const chartOptions = useMemo(() => ({
        tooltip: {
            contentStyle: {
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem'
            },
            itemStyle: { color: '#9CA3AF' },
            labelStyle: { color: '#F3F4F6' }
        }
    }), []);

    // Memoized currency stats for cards
    const formattedStats = useMemo(() => ({
        avgBuyRate: stats.avgBuyRate.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }),
        avgSellRate: stats.avgSellRate.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }),
        highestSpreadValue: stats.highestSpread.value.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }), [stats.avgBuyRate, stats.avgSellRate, stats.highestSpread.value]);

    if (loading && initialRender.current) {
        initialRender.current = false;
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <MainLoading isDark message="Loading dashboard data..." size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className={`text-2xl font-bold ${textClass}`}>
                    Dashboard Overview
                </h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchData}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Currencies"
                    value={stats.totalCurrencies}
                    icon={DollarSign}
                    bgColor="bg-blue-500"
                    subtitle="Active currencies"
                />
                <StatCard
                    title="Average Buy Rate"
                    value={`Rp. ${formattedStats.avgBuyRate}`}
                    icon={TrendingDown}
                    bgColor="bg-green-500"
                    subtitle="Mean purchase rate"
                />
                <StatCard
                    title="Average Sell Rate"
                    value={`Rp. ${formattedStats.avgSellRate}`}
                    icon={TrendingUp}
                    bgColor="bg-orange-500"
                    subtitle="Mean selling rate"
                />
                <StatCard
                    title="Highest Spread"
                    value={stats.highestSpread.currency}
                    subtitle={`Rp. ${formattedStats.highestSpreadValue}`}
                    icon={Activity}
                    bgColor="bg-purple-500"
                />
            </div>

            {/* Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardClass} p-6 rounded-lg shadow-lg`}
            >
                <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
                    Currency Spread Analysis
                </h2>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <Tooltip {...chartOptions.tooltip} />
                            <Line
                                type="monotone"
                                dataKey="buyRate"
                                stroke="#10B981"
                                name="Buy Rate"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="sellRate"
                                stroke="#F97316"
                                name="Sell Rate"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="spread"
                                stroke="#8B5CF6"
                                name="Spread"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Exchange Rates Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${cardClass} rounded-lg shadow-lg overflow-hidden`}
            >
                <div className="p-6 border-b border-gray-700">
                    <h2 className={`text-xl font-semibold ${textClass}`}>
                        Current Exchange Rates
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Showing {currencies.length} currencies
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        <table className="w-full">
                            <thead className="sticky top-0 z-10 bg-gray-800">
                            <tr className={tableHeaderClass}>
                                <th className="text-left p-4 font-medium">Icon</th>
                                <th className="text-left p-4 font-medium">Code</th>
                                <th className="text-left p-4 font-medium">Name</th>
                                <th className="text-left p-4 font-medium">Buy Rate</th>
                                <th className="text-left p-4 font-medium">Sell Rate</th>
                                <th className="text-left p-4 font-medium">Spread</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                            {currencies.length > 0 ? (
                                currencies
                                    .slice()
                                    .reverse()
                                    .map((currency) => (
                                        <CurrencyTableRow
                                            key={currency.currency_code}
                                            currency={currency}
                                            highestSpreadValue={stats.highestSpread.value}
                                        />
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertCircle size={24} className="text-gray-400" />
                                            <p className="text-gray-400">No currency data available</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Loading Overlay */}
            {loading && !initialRender.current && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <MainLoading isDark message="Updating dashboard..." size={40} />
                </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
                    >
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;