import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, Check, Search, ChevronRight } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Swal from 'sweetalert2';
import { CurrencyService } from '@/services/Currency/CurrencyService';

const SelectablePrintableTable = ({ currencies, styles, isDark, lastUpdated }) => {
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCurrencies = CurrencyService.searchCurrencies(currencies, searchTerm);

    const handleToggleSelection = (currencyCode) => {
        setSelectedCurrencies(prev =>
            prev.includes(currencyCode)
                ? prev.filter(code => code !== currencyCode)
                : [...prev, currencyCode]
        );
    };

    const handleSelectAll = () => {
        if (selectedCurrencies.length === filteredCurrencies.length) {
            setSelectedCurrencies([]);
        } else {
            setSelectedCurrencies(filteredCurrencies.map(c => c.currency_code));
        }
    };

    const handlePrint = async () => {
        // Show loading state
        Swal.fire({
            title: 'Generating image...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const printableElement = document.querySelector('.hidden > div');

            const canvas = await CurrencyService.generatePrintableTable({
                selectedCurrencies,
                currencies,
                isDark,
                element: printableElement,
                lastUpdated
            });

            await CurrencyService.downloadTableAsImage(canvas);

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Exchange rates table has been saved as an image.',
                confirmButtonColor: '#DC5233',
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#fff' : '#1f2937'
            });
        } catch (error) {
            console.error('Error in print process:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to generate image',
                confirmButtonColor: '#DC5233',
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#fff' : '#1f2937'
            });
        }

        setIsSelectMode(false);
        setSelectedCurrencies([]);
        setSearchTerm('');
    };

    const handleCancel = () => {
        setIsSelectMode(false);
        setSelectedCurrencies([]);
        setSearchTerm('');
    };

    if (!isSelectMode) {
        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSelectMode(true)}
                className={`${styles.refreshButton.base} bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20`}
            >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Save as Image</span>
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className={`
                    ${isDark ? 'bg-gray-800/90' : styles.innerBg} 
                    rounded-xl sm:rounded-2xl w-full 
                    max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl 
                    h-[60vh] sm:h-[70vh]
                    flex flex-col shadow-2xl backdrop-blur-xl 
                    border custom-scrollbar ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
                `}
            >
                {/* Header - Now with responsive padding and text size */}
                <div className={`p-4 sm:p-6 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <h2 className={`${styles.text} text-xl sm:text-2xl font-bold`}>Select Currencies to Print</h2>
                        <span className={`${styles.mutedText} text-sm font-medium px-3 py-1 rounded-full ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            {selectedCurrencies.length} selected
                        </span>
                    </div>
                    <p className={`${styles.mutedText} mt-2 text-sm sm:text-base`}>
                        Choose the currencies you want to include in your exported image.
                    </p>
                </div>

                {/* Main Content Area - Flexible height with overflow */}
                <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
                    {/* Search and Actions - Now more responsive */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className={`relative left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Search currencies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-xl
                                    ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'} 
                                    ${styles.text} outline-none focus:ring-2 focus:ring-purple-500/50 transition-all
                                    text-sm sm:text-base placeholder:text-gray-400`}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSelectAll}
                            className={`px-4 py-2 sm:py-3 rounded-xl ${styles.text} 
                                ${isDark ? 'border-gray-600 hover:bg-gray-700/50 bg-gray-700/20' : 'border-gray-200 hover:bg-gray-50 bg-white'} 
                                border transition-all shadow-sm text-sm sm:text-base whitespace-nowrap`}
                        >
                            {selectedCurrencies.length === filteredCurrencies.length ? 'Deselect All' : 'Select All'}
                        </motion.button>
                    </div>

                    {/* Currency Grid - Scrollable container with responsive grid */}
                    <div className="flex-1 min-h-0 overflow-hidden rounded-xl border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}">
                        <div className="h-full overflow-y-auto custom-scrollbar p-2 sm:p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredCurrencies.map((currency) => (
                                        <motion.div
                                            layout
                                            key={currency.currency_code}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onClick={() => handleToggleSelection(currency.currency_code)}
                                            className={`
                                                flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer
                                                ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}
                                                ${selectedCurrencies.includes(currency.currency_code)
                                                ? isDark ? 'bg-purple-500/10 border-purple-500/20'
                                                    : 'bg-purple-50 border-purple-100'
                                                : isDark ? 'border-gray-700/50'
                                                    : 'border-gray-200/50'}
                                                border transition-all group
                                            `}
                                        >
                                            {/* Currency Selection and Info - More compact on mobile */}
                                            <div className={`
                                                w-5 h-5 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center transition-all
                                                ${selectedCurrencies.includes(currency.currency_code)
                                                ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/20'
                                                : isDark ? 'border-gray-600' : 'border-gray-300'}
                                                group-hover:border-purple-400
                                            `}>
                                                {selectedCurrencies.includes(currency.currency_code) && (
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="flex-shrink-0">
                                                    {currency.icon_url ? (
                                                        <LazyLoadImage
                                                            src={currency.icon_url}
                                                            alt={`${currency.currency_code} flag`}
                                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover shadow-md"
                                                            effect="opacity"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-base sm:text-lg font-bold text-white shadow-md">
                                                            {currency.currency_code.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`font-bold ${styles.text} text-sm sm:text-base`}>
                                                            {currency.currency_code}
                                                        </span>
                                                        <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ${styles.mutedText} hidden sm:block`} />
                                                        <span className={`text-xs sm:text-sm ${styles.mutedText} truncate`}>
                                                            {currency.currency_name}
                                                        </span>
                                                    </div>
                                                    <span className={`${styles.text} text-right text-base sm:text-lg font-bold mt-1`}>
                                                        {currency.sell_rate === null ? '-' : currency.sell_rate.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Now with better spacing and responsive design */}
                    <div className="flex justify-end gap-2 sm:gap-3 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancel}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl border flex items-center gap-2 transition-all text-sm sm:text-base
                                ${isDark ? 'border-gray-600 hover:bg-gray-700/50 text-gray-200'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'}
                                shadow-sm`}
                        >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePrint}
                            disabled={selectedCurrencies.length === 0}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white 
                                flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 text-sm sm:text-base
                                ${selectedCurrencies.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print Selected</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Hidden printable table */}
            <div className="hidden">
                <div className={`p-6 ${styles.innerBg} rounded-xl`}>
                    <div className="mb-6 text-center">
                        <h2 className={`text-2xl font-bold ${styles.text} mb-2`}>Currency Exchange Rates</h2>
                        <p className={`${styles.mutedText} text-sm`}>
                            Last updated: {lastUpdated.toLocaleString()}
                        </p>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className={`text-sm font-semibold ${styles.text}`}>
                            <th className="py-3 px-4 text-left border-b-2 border-orange-500">Currency</th>
                            <th className="py-3 px-4 text-left border-b-2 border-orange-500">Name</th>
                            <th className="py-3 px-4 text-right border-b-2 border-orange-500">We Buy</th>
                            <th className="py-3 px-4 text-right border-b-2 border-orange-500">We Sell</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currencies
                            .filter(c => selectedCurrencies.includes(c.currency_code))
                            .map((currency) => (
                                <tr key={currency.currency_code} className={`border-b ${styles.border}`}>
                                    <td className={`py-3 px-4 ${styles.text}`}>
                                        <div className="flex items-center gap-2">
                                            {currency.icon_url ? (
                                                <img
                                                    src={currency.icon_url}
                                                    alt={`${currency.currency_code} flag`}
                                                    className="w-5 h-5 rounded"
                                                    crossOrigin="anonymous"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded bg-gray-600 flex items-center justify-center text-xs text-white">
                                                    {currency.currency_code.charAt(0)}
                                                </div>
                                            )}
                                            <span>{currency.currency_code}</span>
                                        </div>
                                    </td>
                                    <td className={`py-3 px-4 ${styles.text}`}>{currency.currency_name}</td>
                                    <td className={`py-3 px-4 text-right ${styles.text}`}>
                                        {CurrencyService.formatCurrencyValue(currency.buy_rate)}
                                    </td>
                                    <td className={`py-3 px-4 text-right ${styles.text}`}>
                                        {CurrencyService.formatCurrencyValue(currency.sell_rate)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default SelectablePrintableTable;