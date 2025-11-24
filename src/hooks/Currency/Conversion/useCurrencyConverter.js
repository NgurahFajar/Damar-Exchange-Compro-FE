import { useState, useCallback, useEffect } from 'react';
import { CurrencyService } from '@/services/Currency/CurrencyService.js'
import { CurrencyConversionService } from '@/services/Currency/CurrencyConversionService.js'

const initialState = {
    amount: '',
    fromCurrency: '',
    toCurrency: '',
    convertedAmount: '',
    error: '',
    currencies: [],
    loading: true
};

export const useCurrencyConverter = () => {
    const [state, setState] = useState(initialState);

    const fetchCurrencies = useCallback(async () => {
        try {
            const response = await CurrencyService.getAllCurrencies();
            if (response.status === 'success') {
                setState(prev => ({ ...prev, currencies: response.data, loading: false }));
            } else {
                throw new Error('Failed to fetch currencies');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message || 'Failed to fetch currencies',
                loading: false
            }));
        }
    }, []);

    useEffect(() => {
        fetchCurrencies();
    }, [fetchCurrencies]);

    useEffect(() => {
        if (state.fromCurrency === 'IDR') {
            setState(prev => ({
                ...prev,
                toCurrency: prev.currencies.find(c => c.currency_code !== 'IDR')?.currency_code || ''
            }));
        } else if (state.fromCurrency && state.fromCurrency !== 'IDR') {
            setState(prev => ({ ...prev, toCurrency: 'IDR' }));
        }
    }, [state.fromCurrency, state.currencies]);

    const handleConversion = useCallback(() => {
        const { amount, fromCurrency, toCurrency, currencies } = state;
        const validation = CurrencyConversionService.validateConversion(amount, fromCurrency, toCurrency);

        if (!validation.isValid) {
            setState(prev => ({
                ...prev,
                error: validation.error,
                convertedAmount: ''
            }));
            return;
        }

        try {
            const result = CurrencyConversionService.calculateConversion(
                amount,
                fromCurrency,
                toCurrency,
                currencies
            );

            if (result === null) throw new Error('Invalid currency pair');

            setState(prev => ({
                ...prev,
                error: '',
                convertedAmount: result.toFixed(2)
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message,
                convertedAmount: ''
            }));
        }
    }, [state]);

    const handleReset = useCallback(() => {
        setState(prev => ({
            ...prev,
            amount: '',
            fromCurrency: '',
            toCurrency: '',
            convertedAmount: '',
            error: ''
        }));
    }, []);

    const handleAmountChange = useCallback((e) => {
        setState(prev => ({
            ...prev,
            amount: e.target.value,
            convertedAmount: '',
            error: ''
        }));
    }, []);

    const handleCurrencyChange = useCallback((field) => (value) => {
        setState(prev => ({
            ...prev,
            [field]: value,
            convertedAmount: '',
            error: ''
        }));
    }, []);

    const handleSwapCurrencies = useCallback(() => {
        setState(prev => {
            if (!prev.fromCurrency || !prev.toCurrency) return prev;
            return {
                ...prev,
                fromCurrency: prev.toCurrency,
                toCurrency: prev.fromCurrency,
                convertedAmount: '',
                error: ''
            };
        });
    }, []);

    return {
        state,
        handleConversion,
        handleReset,
        handleAmountChange,
        handleCurrencyChange,
        handleSwapCurrencies
    };
};

export default useCurrencyConverter;