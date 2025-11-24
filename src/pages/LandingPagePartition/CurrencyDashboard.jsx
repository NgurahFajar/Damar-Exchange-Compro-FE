import React, { useState, useEffect, memo, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {AlertCircle, RefreshCcw, CandlestickChart} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CurrencyService } from '@/services/Currency/CurrencyService.js';
import MainLoading from "@components/Loaders/MainLoading.jsx";
import Swal from "sweetalert2";
import PrintableTable from './components/Currency/Dashboard/SelectablePrintableTable.jsx';
import TableSkeleton from './components/Currency/Dashboard/TableSkeleton.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const animations = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.02,
                ease: [0.23, 1, 0.32, 1]
            }
        }
    },
    fadeInScale: {
        hidden: {
            opacity: 0,
            transform: 'scale(0.985)',
            willChange: 'transform'
        },
        visible: {
            opacity: 1,
            transform: 'scale(1)',
            transition: {
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
                opacity: { duration: 0.35 }
            }
        }
    },
    row: {
        hidden: {
            opacity: 0,
            transform: 'translateY(10px)',
            willChange: 'transform'
        },
        visible: {
            opacity: 1,
            transform: 'translateY(0)',
            transition: {
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1]
            }
        }
    }
};


const useStyles = (isDark) => useMemo(() => ({
    text: isDark ? 'text-white' : 'text-gray-800',
    mutedText: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-600/20' : 'border-gray-200',
    innerBg: isDark ? 'bg-gray-700/50' : 'bg-white',
    containerBg: isDark ? 'bg-transparent' : 'bg-white',
    tableHoverBg: isDark ? 'hover:bg-gray-700/10' : 'hover:bg-gray-50',
    gradientBg: isDark
        ? 'bg-gradient-to-br from-transparent to-orange-700/5'
        : 'bg-white',
    refreshButton: {
        base: "flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm lg:text-base font-medium shadow-lg transition-colors",
        active: "bg-orange-700 hover:bg-orange-600",
        disabled: "bg-orange-400 cursor-not-allowed"
    },
    alert: {
        error: {
            bg: isDark ? 'bg-gray-800' : 'bg-white',
            text: isDark ? 'text-white' : 'text-gray-800'
        }
    }
}), [isDark]);

const formatCurrencyValue = (value) => {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const CurrencyFlag = memo(({ currency }) => {
    if (currency.icon_url) {
        return (
            <LazyLoadImage
                src={currency.icon_url}
                alt={`${currency.currency_code} flag`}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded object-cover"
                effect="opacity"
                threshold={100}
            />
        );
    }

    return (
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-gray-600 flex items-center justify-center text-xs text-white">
            {currency.currency_code.charAt(0)}
        </div>
    );
});

const CurrencyRow = memo(({ currency, styles, isDark }) => (
    <motion.tr
        key={`${currency.currency_code}`}
        initial={{ opacity: 1, transform: 'translateY(0)' }} // Ensure it is visible immediately
        animate={{ opacity: 1, transform: 'translateY(0)' }}
        className={`border-t ${styles.border} transition-colors duration-200 ${styles.tableHoverBg} font-poppins text-sm md:text-base`}
    >
    {/* Flag Column - Fixed width, centered */}
        <td className="w-16 py-2.5 hidden sm:table-cell">
            <div className="flex justify-center">
                <CurrencyFlag currency={currency} />
            </div>
        </td>

        {/* Currency Code Column - Fixed width */}
        <td className={`w-32 py-2.5 ${styles.text}`}>
            <div className="flex items-center gap-2">
                <span className="sm:hidden mr-2">
                    <CurrencyFlag currency={currency} />
                </span>
                <span className="font-medium min-w-[60px]">
                    {currency.currency_code}
                </span>
            </div>
        </td>

        {/* Currency Name Column - Flexible width */}
        <td className={`py-2.5 ${styles.text} hidden lg:table-cell px-4`}>
            {currency.currency_name}
        </td>

        {/* Buy Rate Column - Fixed width, right aligned */}
        <td className={`w-32 py-2.5 text-right pr-2 md:pr-10 ${styles.text}`}>
            {formatCurrencyValue(currency.buy_rate)}
        </td>

        {/* Sell Rate Column - Fixed width, right aligned */}
        <td className={`w-32 py-2.5 text-right pr-2 md:pr-10 ${styles.text}`}>
            {formatCurrencyValue(currency.sell_rate)}
        </td>
    </motion.tr>
), (prevProps, nextProps) => {
    return prevProps.currency.currency_code === nextProps.currency.currency_code &&
        prevProps.currency.buy_rate === nextProps.currency.buy_rate &&
        prevProps.currency.sell_rate === nextProps.currency.sell_rate &&
        prevProps.isDark === nextProps.isDark;
});

const TableHeader = memo(({ styles, isDark }) => {
        const { t } = useTranslation();

        return (
            <tr className={`text-sm font-semibold font-poppins text-base md:text-lg ${styles.text}`}>
                {/* Flag Header - Fixed width, centered */}
                <th className="w-16 py-2.5 hidden sm:table-cell text-center">
                    {t('table_headers.flag')}
                </th>

                {/* Currency Code Header - Fixed width */}
                <th className="w-32 py-2.5 text-left">
                    {t('table_headers.currency')}
                </th>

                {/* Currency Name Header - Flexible width */}
                <th className="py-2.5 text-left hidden lg:table-cell px-4">
                    {t('table_headers.name')}
                </th>

                {/* Buy Rate Header - Fixed width, right aligned */}
                <th className="w-32 py-2.5 text-right pr-5 md:pr-14">
                    {t('table_headers.we_buy')}
                </th>

                {/* Sell Rate Header - Fixed width, right aligned */}
                <th className="w-32 py-2.5 text-right pr-5 md:pr-14">
                    {t('table_headers.we_sell')}
                </th>
            </tr>
        );
    }, (prevProps, nextProps) =>
        JSON.stringify(prevProps.styles) === JSON.stringify(nextProps.styles) &&
        prevProps.isDark === nextProps.isDark
);

const TitleSection = memo(({ title, icon: Icon, isDark }) => (
    <div className="flex items-center gap-4 mb-2">
        <motion.div
            className="h-10 w-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-orange-800 to-orange-500
                flex items-center justify-center shadow-lg transform"
            whileHover={{ rotate: 0, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <Icon className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
        </h2>
    </div>
));

const CurrencyDashboard = ({ isDark }) => {
    const { t } = useTranslation();
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const initialRender = useRef(true);
    const abortControllerRef = useRef(null);

    const styles = useStyles(isDark);

    const alertConfigs = useMemo(() => ({
        error: {
            confirmButtonText: 'OK',
            confirmButtonColor: '#DC5233',
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#fff' : '#1f2937'
        }
    }), [isDark]);

    const showErrorAlert = useCallback((message) => {
        Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            ...alertConfigs.error
        });
    }, [alertConfigs]);

    const fetchCurrencies = useCallback(async () => {
        try {
            if (!loading) setLoading(true);
            const response = await CurrencyService.getAllCurrencies();

            if (response?.data) {
                const currencyData = Array.isArray(response.data) ?
                    response.data : response.data.data;

                setCurrencies([...currencyData]);
                setLastUpdated(new Date());
                setError(null);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
            setCurrencies([]);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [setCurrencies, setLoading, setError]);

    const reversedCurrencies = useMemo(() => {
        if (!Array.isArray(currencies) || currencies.length === 0) {
            return [];
        }
        return [...currencies].reverse();
    }, [currencies]);


    useEffect(() => {
        fetchCurrencies();
        const interval = setInterval(() => fetchCurrencies(false), 5 * 60 * 1000);
        return () => {
            clearInterval(interval);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchCurrencies]);

    const handleRefresh = useCallback(async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        await fetchCurrencies(false);
    }, [isRefreshing, fetchCurrencies]);

    return (
        <motion.div
            key={`dashboard-${isDark}`}
            variants={animations.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 md:mb-8 font-poppins"
        >
            <motion.div
                variants={animations.fadeInScale}
                className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-8 shadow-xl relative overflow-hidden backdrop-blur-lg`}
            >
                <div
                    className={`absolute -left-40 bottom-0 w-40 h-40 rounded-full ${isDark ? 'bg-purple-600/5' : 'bg-purple-100/50'} blur-3xl`}/>

                <div className="relative space-y-4 sm:space-y-6">
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <TitleSection
                                title={t('currency_dashboard_title')}
                                icon={CandlestickChart}
                                isDark={isDark}
                            />
                            <div className="flex items-center gap-2">
                                <PrintableTable
                                    currencies={reversedCurrencies}
                                    styles={styles}
                                    isDark={isDark}
                                    lastUpdated={lastUpdated}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className={`${styles.refreshButton.base} shrink-0 
                                        ${isRefreshing ? styles.refreshButton.disabled : styles.refreshButton.active}`}
                                >
                                    <RefreshCcw className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">
                                        {isRefreshing ? t('refreshing') : t('refresh_rates')}
                                    </span>
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 md:gap-4">
                            <motion.p
                                className={`text-sm md:text-base text-gray-400 ${styles.mutedText} border-l-4 border-orange-500 pl-3 md:pr-18 lg:pr-24 md:pr-32 flex-1`}
                                variants={animations.fadeInScale}
                            >
                                {t('currency_dashboard_subtitle')}
                            </motion.p>
                            <p className={`text-sm sm:text-base lg:text-lg font-poppins font-light ${styles.mutedText}`}>
                                {t('last_updated', {
                                    time: lastUpdated?.toLocaleTimeString() || new Date().toLocaleTimeString()
                                })}
                            </p>
                        </div>
                    </div>

                    <motion.div
                        key={`table-${isDark}`}
                        variants={animations.fadeInScale}
                        className={`p-3 rounded-xl ${styles.gradientBg} shadow-sm space-y-4`}
                    >
                        {loading ? (
                            <TableSkeleton styles={styles} isDark={isDark} />
                        ) : currencies.length > 0 ? (
                            <div className="relative">
                                <table className="w-full">
                                    <thead>
                                    <TableHeader styles={styles} isDark={isDark} />
                                    </thead>
                                </table>

                                <div className="max-h-[300px] sm:max-h-[480px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full">
                                        <tbody>
                                        <AnimatePresence mode="sync">
                                            {reversedCurrencies.map((currency) => (
                                                <CurrencyRow
                                                    key={currency.currency_code}
                                                    currency={currency}
                                                    styles={styles}
                                                    isDark={isDark}
                                                />
                                            ))}
                                        </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <td colSpan="5" className="p-8 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <RefreshCcw size={24} className={styles.mutedText} />
                                        <p className={styles.mutedText}>No currency data available</p>
                                    </div>
                                </td>
                            </motion.tr>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {loading && !initialRender.current && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <MainLoading isDark={isDark} message="Updating rates..." size={40}/>
                </div>
            )}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        className={`fixed bottom-4 right-4 ${styles.alert.error.bg} ${styles.alert.error.text} px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}
                    >
                        <AlertCircle size={20}/>
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

CurrencyFlag.displayName = 'CurrencyFlag';
CurrencyRow.displayName = 'CurrencyRow';
TableHeader.displayName = 'TableHeader';
CurrencyDashboard.displayName = 'CurrencyDashboard';

export default CurrencyDashboard;
