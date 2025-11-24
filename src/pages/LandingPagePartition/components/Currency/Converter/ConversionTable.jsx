import React, { memo, useState, useRef, useEffect } from "react";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import idrImage from "@assets/IDR.webp";

// Styles remain the same
const styles = {
    card: (isDark) => ({
        wrapper: isDark
            ? "backdrop-blur-lg bg-gradient-to-br from-transparent to-orange-700/5 rounded-xl shadow-xl border border-gray-600/30"
            : "backdrop-blur-lg bg-white rounded-xl shadow-xl border border-gray-200/30",
        header: `p-4 flex items-center gap-2 ${isDark
            ? "bg-gray-800/50 rounded-xl"
            : "bg-white/50"}`,
        headerText: isDark ? "text-white" : "text-gray-900",
        row: `flex justify-between p-3 border-t transition-colors ${isDark
            ? "border-gray-700/30 hover:bg-gray-700/30"
            : "border-gray-200/30 hover:bg-gray-100/30"}`,
        currencyText: `font-medium text-orange-500`,
        valueText: isDark ? "text-gray-300" : "text-gray-600"
    })
};

// CurrencyIcon component remains the same
const CurrencyIcon = memo(({ currency, currencyData }) => {
    if (currency === 'IDR') {
        return <img src={idrImage} alt="IDR" className="w-6 h-6 rounded-full" />;
    }
    return currencyData?.icon_url ? (
        <img src={currencyData.icon_url} alt={currency} className="w-6 h-6 rounded-full" />
    ) : (
        <div className="w-6 h-6 rounded-full bg-orange-500/90 flex items-center justify-center text-white text-xs">
            {currency?.charAt(0)}
        </div>
    );
});

// TableRow component remains the same
const TableRow = memo(({ amount, fromCurrency, toCurrency, rate, isReverse, style }) => {
    const calculatedAmount = isReverse
        ? (amount / rate).toFixed(2)
        : (amount * rate).toFixed(2);

    return (
        <div className={style.row}>
            <span className={style.currencyText}>
                {amount.toLocaleString()} {fromCurrency}
            </span>
            <span className={style.valueText}>
                {calculatedAmount} {toCurrency}
            </span>
        </div>
    );
});

const ConversionCard = memo(({
                                 isReverse,
                                 fromCurrency,
                                 toCurrency,
                                 fromCurrencyData,
                                 toCurrencyData,
                                 amounts,
                                 rate,
                                 style,
                                 isDark
                             }) => {
    const displayFromCurrency = isReverse ? toCurrency : fromCurrency;
    const displayToCurrency = isReverse ? fromCurrency : toCurrency;
    const displayFromData = isReverse ? toCurrencyData : fromCurrencyData;
    const displayToData = isReverse ? fromCurrencyData : toCurrencyData;

    return (
        <>
            <div className={`${style.header} flex items-center justify-center gap-2`}>
                <CurrencyIcon
                    currency={displayFromCurrency}
                    currencyData={displayFromData}
                />
                <span className={`text-lg font-medium ${style.headerText}`}>
                    {displayFromCurrency}
                </span>
                <span className="text-orange-500">→</span>
                <CurrencyIcon
                    currency={displayToCurrency}
                    currencyData={displayToData}
                />
                <span className={`text-lg font-medium ${style.headerText}`}>
                    {displayToCurrency}
                </span>
            </div>
            <div>
                {amounts.map((value, index) => (
                    <motion.div
                        key={value}
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: {
                                opacity: 1,
                                x: 0,
                                transition: {
                                    delay: index * 0.05,
                                    duration: 0.5
                                }
                            }
                        }}
                    >
                        <TableRow
                            amount={value}
                            fromCurrency={displayFromCurrency}
                            toCurrency={displayToCurrency}
                            rate={isReverse ? 1/rate : rate}
                            style={style}
                        />
                    </motion.div>
                ))}
            </div>
        </>
    );
});

export const ConversionTable = memo(({
                                         fromCurrency,
                                         toCurrency,
                                         currencies,
                                         isDark = true,
                                         amount,
                                         convertedAmount
                                     }) => {
    const { t } = useTranslation();
    const scrollContainerRef = useRef(null);
    const style = styles.card(isDark);
    const amounts = [1, 5, 10, 50, 100, 500, 1000, 5000];
    const slides = [false, true];

    const fromCurrencyData = currencies && currencies.find(c => c.currency_code === fromCurrency);
    const toCurrencyData = currencies && currencies.find(c => c.currency_code === toCurrency);
    const rate = amount && convertedAmount ? convertedAmount / amount : 1;

    const MobileView = () => {
        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [scrollLeft, setScrollLeft] = useState(0);

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainerRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        };

        return (
            <div className="relative overflow-hidden">
                <div className="text-center py-2">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('conversion_result.scroll_hint')}
                    </p>
                </div>
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch',
                        scrollSnapType: 'x mandatory'
                    }}
                >
                    {slides.map((isReverse, index) => (
                        <div
                            key={index}
                            className={`${style.wrapper} min-w-full flex-shrink-0 snap-center`}
                        >
                            <ConversionCard
                                isReverse={isReverse}
                                fromCurrency={fromCurrency}
                                toCurrency={toCurrency}
                                fromCurrencyData={fromCurrencyData}
                                toCurrencyData={toCurrencyData}
                                amounts={amounts}
                                rate={rate}
                                style={style}
                                isDark={isDark}
                            />
                        </div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                    <div className="h-1 bg-orange-500/50 rounded-full w-16"></div>
                </div>
            </div>
        );
    };

    const DesktopView = () => (
        <div className="grid grid-cols-2 gap-4">
            {slides.map((isReverse) => (
                <motion.div
                    key={isReverse}
                    className={style.wrapper}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5 }
                        }
                    }}
                >
                    <ConversionCard
                        isReverse={isReverse}
                        fromCurrency={fromCurrency}
                        toCurrency={toCurrency}
                        fromCurrencyData={fromCurrencyData}
                        toCurrencyData={toCurrencyData}
                        amounts={amounts}
                        rate={rate}
                        style={style}
                        isDark={isDark}
                    />
                </motion.div>
            ))}
        </div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            <div className="block md:hidden">
                <MobileView />
            </div>
            <div className="hidden md:block">
                <DesktopView />
            </div>

            <style jsx global>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </motion.div>
    );
});

CurrencyIcon.displayName = 'CurrencyIcon';
TableRow.displayName = 'TableRow';
ConversionCard.displayName = 'ConversionCard';
ConversionTable.displayName = 'ConversionTable';

export default ConversionTable;