import React, { memo, useMemo } from "react";
import { motion } from 'framer-motion';
import CurrencyConversionService from "@/services/Currency/CurrencyConversionService.js";

const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    },
    slideUp: {
        initial: { y: 20, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    }
};

const useStyles = (isDark) => useMemo(() => ({
    text: {
        primary: isDark ? "text-white" : "text-gray-900",
        secondary: isDark ? "text-gray-300" : "text-gray-600"
    },
    card: {
        wrapper: isDark
            ? "backdrop-blur-lg bg-gray-800/50 rounded-2xl shadow-xl"
            : "backdrop-blur-lg bg-white/50 rounded-2xl shadow-xl",
        amount: "bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"
    }
}), [isDark]);

const ConversionResult = memo(({
                                   amount,
                                   fromCurrency,
                                   toCurrency,
                                   convertedAmount,
                                   currencies,
                                   isDark = true,
                                   statusText,
                               }) => {
    if (!convertedAmount) return null;

    const styles = useStyles(isDark);
    const formattedAmount = CurrencyConversionService.formatAmount(amount, fromCurrency);
    const formattedConvertedAmount = CurrencyConversionService.formatAmount(convertedAmount, toCurrency);
    const { fromToRate, toFromRate } = CurrencyConversionService.calculateExchangeRates(
        amount, fromCurrency, toCurrency, convertedAmount
    );

    return (
        <motion.section
            initial="initial"
            animate="animate"
            className="w-full"
        >
            <motion.div
                variants={animations.slideUp}
                className={`p-4 ${styles.card.wrapper}`}
            >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex flex-col space-y-2 flex-1">
                        <motion.div
                            variants={animations.fadeIn}
                            className={`text-base sm:text-lg font-medium ${styles.text.primary}`}
                        >
                            {formattedAmount} {fromCurrency}
                        </motion.div>
                        <motion.div
                            variants={animations.fadeIn}
                            className="flex items-baseline gap-2"
                        >
                            <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${styles.card.amount}`}>
                                {formattedConvertedAmount}
                            </span>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={animations.fadeIn}
                        className="flex items-center border-t sm:border-l-4 sm:border-t-0 border-orange-500 pt-2 sm:pt-0 sm:pl-4"
                    >
                        <div className={`text-xs sm:text-sm space-y-1 ${styles.text.secondary}`}>
                            <div>1 {fromCurrency} = {fromToRate} {toCurrency}</div>
                            <div>1 {toCurrency} = {toFromRate} {fromCurrency}</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.section>
    );
});

ConversionResult.displayName = 'ConversionResult';

export default ConversionResult;