import React, { memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {ArrowLeftRight, Award, Banknote} from 'lucide-react';
import { useCurrencyConverter } from '@/hooks/Currency/Conversion/useCurrencyConverter.js';
import { SelectButton } from '@/pages/LandingPagePartition/components/Currency/Converter/SelectButton';
import { AmountInput } from '@/pages/LandingPagePartition/components/Currency/Converter/AmountInput';
import ConversionResult from '@/pages/LandingPagePartition/components/Currency/Converter/ConversionResult';
import { ConversionTable } from '@/pages/LandingPagePartition/components/Currency/Converter/ConversionTable';
import { ErrorMessage } from '@/pages/LandingPagePartition/components/Currency/Converter/ErrorMessage';
import MainLoading from "@components/Loaders/MainLoading";

const animations = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07, delayChildren: 0.02 }
        }
    },
    fadeInScale: {
        hidden: { opacity: 0, transform: 'scale(0.985)' },
        visible: {
            opacity: 1,
            transform: 'scale(1)',
            transition: { duration: 0.5 }
        }
    }
};

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

const CurrencyConverter = memo(({ isDark }) => {
    const { t } = useTranslation();
    const {
        state,
        handleConversion,
        handleReset,
        handleAmountChange,
        handleCurrencyChange,
        handleSwapCurrencies
    } = useCurrencyConverter();

    const styles = useMemo(() => ({
        text: isDark ? 'text-white' : 'text-gray-800',
        mutedText: isDark ? 'text-gray-300' : 'text-gray-600',
        innerBg: isDark ? 'bg-gray-800/50' : 'bg-white/90',
        borderColor: isDark ? 'border-gray-700' : 'border-gray-200',
    }), [isDark]);

    const handleDismissError = useCallback(() => {
        setState(prev => ({ ...prev, error: '' }));
    }, []);

    if (state.loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <MainLoading isDark message={t('loading')} size={40} />
            </div>
        );
    }

    return (
        <motion.div
            variants={animations.container}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8 font-poppins"
            role="main"
            aria-label={t('currency_converter')}
        >
            <motion.div
                variants={animations.fadeInScale}
                className="rounded-xl p-4 shadow-xl backdrop-blur-lg"
            >
                <TitleSection
                    title={t('currency_converter')}
                    icon={Banknote}
                    isDark={isDark}
                />


                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-4">
                    <motion.p
                        className={`text-sm sm:text-base text-gray-400 lg:text-base ${styles.mutedText} border-l-4 border-orange-500 pl-3 md:pr-60 lg:pr-80 flex-1`}
                        variants={animations.fadeInScale}
                    >
                        {t('currency_converter_subtitle')}
                    </motion.p>
                </div>

                <motion.div variants={animations.fadeInScale}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleConversion();
                        }}
                        className="space-y-4 my-2 lg:mx-4"
                    >
                        <div className="flex gap-2 mt-10">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-1.5 md:px-6 md:py-2 rounded-lg md:rounded-xl bg-orange-700 text-white text-sm md:text-base font-medium hover:bg-gray-600/50 transition-colors"
                            >
                                {t('reset')}
                            </button>
                            <AnimatePresence mode="wait">
                                {state.error && (
                                    <ErrorMessage
                                        error={state.error}
                                        isDark={isDark}
                                        onDismiss={handleDismissError}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        <div className={`rounded-xl p-4 ${styles.innerBg} border ${styles.borderColor}`}>
                            <AmountInput
                                amount={state.amount}
                                fromCurrency={state.fromCurrency}
                                currencies={state.currencies}
                                onChange={handleAmountChange}
                                styles={styles}
                                t={t}
                                aria-label={t('amount_input')}
                            />
                        </div>

                        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
                            <SelectButton
                                label={t('from')}
                                value={state.fromCurrency}
                                onChange={handleCurrencyChange('fromCurrency')}
                                currencies={state.currencies}
                                fromCurrency={state.fromCurrency}
                                isDark={isDark}
                            />

                            <button
                                type="button"
                                onClick={handleSwapCurrencies}
                                className={`w-8 h-8 md:w-10 md:h-10  rounded-full bg-orange-600 flex items-center justify-center mt-7 md:mt-8 lg:mt-10 
                                    transition-opacity hover:bg-orange-700
                                    ${(!state.fromCurrency || !state.toCurrency) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!state.fromCurrency || !state.toCurrency}
                                aria-label={t('swap_currencies')}
                            >
                                <ArrowLeftRight className="w-5 h-5 text-white"/>
                            </button>

                            <SelectButton
                                label={t('to')}
                                value={state.toCurrency}
                                onChange={handleCurrencyChange('toCurrency')}
                                currencies={state.currencies}
                                fromCurrency={state.fromCurrency}
                                isDark={isDark}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 items-start md:grid-cols-2 pt-2 md:pt-6">
                            <div className="w-full rounded-xl">
                                <AnimatePresence mode="wait">
                                    {state.convertedAmount && (
                                        <ConversionResult
                                            amount={state.amount}
                                            fromCurrency={state.fromCurrency}
                                            toCurrency={state.toCurrency}
                                            convertedAmount={state.convertedAmount}
                                            isDark={isDark}
                                            statusText={state.fromCurrency && state.toCurrency ? `${state.fromCurrency} to ${state.toCurrency} — Last updated...` : ''}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex flex-col space-y-2">
                                {state.fromCurrency && state.toCurrency && (
                                    <p className={`text-xs sm:text-sm text-right ${styles.mutedText}`}>
                                    <span className="font-medium text-orange-500">
                                        {state.currencies[state.fromCurrency]?.currency_code || state.fromCurrency}
                                    </span>
                                        {` ${t('time.to')} `}
                                        <span className="font-medium text-orange-500">
                                            {state.currencies[state.toCurrency]?.currency_code || state.toCurrency}
                                        </span>
                                        <span className="hidden sm:inline">
                                                {` — ${t('time.last_updated')} `}
                                                {new Date().toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })},<span>{` ${t('time.time')}: `}<span className="text-orange-500">
                                                {new Date().toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                })}
                                            </span>
                                        </span>
                                        </span>
                                        <span className="sm:hidden">
                                            {` — ${t('time.updated')} `}{new Date().toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                            })}
                                        </span>
                                    </p>
                                )}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="py-1.5 md:py-3 px-3 md:px-6 h-12 lg:h-14 md:ml-7 lg:ml-8 bg-orange-700 hover:bg-orange-600 text-white text-base
                                        md:text-lg rounded-lg sm:rounded-xl font-semibold w-full sm:w-auto transition-colors"
                                >
                                    {t('convert_button')}
                                </motion.button>
                            </div>
                        </div>

                        {state.convertedAmount && (
                            <div className={`flex items-center justify-center gap-2 pb-12 md:pt-20 my-8`}>
                                <div className="w-5 h-5 flex-shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        className={`w-5 h-5 ${isDark ? 'text-orange-500' : 'text-orange-600'}`}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                        <path d="M12 8v4"/>
                                        <path d="M12 16h.01"/>
                                    </svg>
                                </div>
                                <p className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {t('market_rate_message')}
                                </p>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {state.convertedAmount && state.fromCurrency && state.toCurrency && (
                                <ConversionTable
                                    fromCurrency={state.fromCurrency}
                                    toCurrency={state.toCurrency}
                                    currencies={state.currencies}
                                    isDark={isDark}
                                    amount={parseFloat(state.amount)}
                                    convertedAmount={parseFloat(state.convertedAmount)}
                                />
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </motion.div>
        </motion.div>
    );
});

CurrencyConverter.displayName = 'CurrencyConverter';
export default CurrencyConverter;