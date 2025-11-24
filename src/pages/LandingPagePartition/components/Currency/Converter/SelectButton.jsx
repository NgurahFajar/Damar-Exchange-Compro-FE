import React, {memo, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import idrImage from "@assets/IDR.webp";
import {Search} from "lucide-react";
import CurrencyConversionService from "@/services/Currency/CurrencyConversionService.js";

export const SelectButton = memo(({ value, onChange, label, currencies, fromCurrency, isDark }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const selectedCurrency = currencies.find(c => c.currency_code === value);
    const currencySymbol = selectedCurrency?.symbol || CurrencyConversionService.getCurrencySymbol(value);
    const isFromSelection = label === t('from');
    const isToSelection = label === t('to');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setSearchTerm('');
    }, [value]);

    const handleSelect = (currencyCode) => {
        onChange(currencyCode);
        setIsOpen(false);
        setSearchTerm('');
        buttonRef.current?.focus();
    };

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const availableOptions = currencies.filter(curr => {
        if (isFromSelection) return true;
        if (isToSelection && fromCurrency === 'IDR') return curr.currency_code !== 'IDR';
        if (isToSelection && fromCurrency !== 'IDR') return curr.currency_code === 'IDR';
        return true;
    });

    const filteredOptions = availableOptions.filter(curr => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return curr.currency_code.toLowerCase().includes(searchLower) ||
            curr.currency_name?.toLowerCase().includes(searchLower);
    });

    const displayText = value === 'IDR'
        ? (
            <>
                {window.innerWidth >= 640 && "Rp "}{value}
                {window.innerWidth >= 640 && " - Indonesia Rupiah"}
            </>
        )
        : value
            ? (
                <>
                    {window.innerWidth >= 640 && `${currencySymbol} `}{value}
                    {window.innerWidth >= 640 && ` - ${selectedCurrency?.currency_name}`}
                </>
            )
            : t('select_currency');

    return (
        <div className="relative flex-1 min-w-0" ref={dropdownRef}>
            <label className="text-sm lg:text-base block mb-1 lg:mb-2">
                <span className={isDark ? 'text-white' : 'text-gray-700'}>
                    {label}
                </span>
            </label>

            <button
                ref={buttonRef}
                type="button"
                className={`w-full flex items-center gap-2 p-2 sm:p-3 lg:p-4
                    rounded-xl lg:rounded-2xl
                    ${isDark ? 'bg-gray-800/50' : 'bg-white'}
                    border ${isDark ? 'border-gray-700' : 'border-white-200'}
                    backdrop-blur-lg shadow-sm
                    transition-colors
                    ${isToSelection && !fromCurrency ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                disabled={isToSelection && !fromCurrency}
                onClick={!isToSelection || fromCurrency ? handleButtonClick : undefined}
            >
                <div className="flex items-center min-w-0 flex-1 gap-1 sm:gap-2">
                    {value === 'IDR' ? (
                        <img
                            src={idrImage}
                            alt="IDR flag"
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded object-cover flex-shrink-0"
                        />
                    ) : selectedCurrency?.icon_url ? (
                        <img
                            src={selectedCurrency.icon_url}
                            alt={`${selectedCurrency.currency_code} flag`}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-gray-800 flex items-center justify-center text-[10px] sm:text-xs text-white flex-shrink-0">
                            {selectedCurrency?.currency_code?.charAt(0) || '?'}
                        </div>
                    )}
                    <span className={`text-sm sm:text-base lg:text-lg truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {displayText}
                    </span>
                </div>
                <svg
                    className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-200
                        ${isDark ? 'text-white' : 'text-gray-600'} 
                        ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`
                    absolute left-0 right-0 mt-2 z-50
                    rounded-xl border shadow-lg
                    ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}
                    max-h-56 sm:max-h-56 flex flex-col
                    w-full sm:min-w-[280px]
                `}>
                    <div className={`
                        sticky top-0 p-1.5 sm:p-2 z-10
                        rounded-2xl
                        ${isDark ? 'border-b border-gray-700 bg-gray-900/50' : 'border-b border-gray-200 bg-white'}
                    `}>
                        <div className="relative">
                            <Search className={`absolute left-2 top-2.5 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('search_currency')}
                                className={`
                                    w-full pl-8 pr-3 py-2 rounded-lg text-sm
                                    focus:outline-none focus:ring-2 focus:ring-orange-500
                                    ${isDark ?
                                    'bg-gray-900/50 text-white placeholder-gray-400' :
                                    'bg-gray-100 text-gray-900 placeholder-gray-500'
                                }
                                `}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto overscroll-contain">
                        {isFromSelection && (
                            <button
                                type="button"
                                onClick={() => handleSelect('IDR')}
                                className={`w-full flex items-center gap-2 p-3 ${isDark ?
                                    'hover:bg-purple-950/70 ' + (value === 'IDR' ? 'bg-purple-950/70' : '') :
                                    'hover:bg-gray-100 ' + (value === 'IDR' ? 'bg-gray-100' : '')}`}
                            >
                                <img src={idrImage} alt="IDR flag" className="w-5 h-5 rounded" />
                                <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>IDR</span>
                                <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium hidden sm:inline`}> - Indonesia Rupiah</span>
                            </button>
                        )}

                        {filteredOptions.map((curr) => (
                            curr.currency_code !== 'IDR' && (
                                <button
                                    key={curr.currency_code}
                                    type="button"
                                    onClick={() => handleSelect(curr.currency_code)}
                                    className={`w-full flex items-center gap-2 p-3 ${isDark ?
                                        'hover:hover:bg-purple-950/70 ' + (value === curr.currency_code ? 'bg-purple-950/70' : '') :
                                        'hover:bg-gray-100 ' + (value === curr.currency_code ? 'bg-gray-100' : '')}`}
                                >
                                    {curr.icon_url ? (
                                        <img
                                            src={curr.icon_url}
                                            alt={`${curr.currency_code} flag`}
                                            className="w-5 h-5 rounded"
                                        />
                                    ) : (
                                        <div className="w-5 h-5 rounded bg-gray-900/50 flex items-center justify-center text-xs text-white">
                                            {curr.currency_code.charAt(0)}
                                        </div>
                                    )}
                                    <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                                        {curr.currency_code}
                                    </span>
                                    <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium hidden sm:inline`}> - {curr.currency_name}</span>
                                </button>
                            )
                        ))}

                        {filteredOptions.length === 0 && (
                            <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {t('no_results')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
