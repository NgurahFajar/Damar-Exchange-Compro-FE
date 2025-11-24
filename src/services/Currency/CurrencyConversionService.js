import CurrencyService from './CurrencyService';

export class CurrencyConversionService {
    static calculateConversion(amount, fromCurrency, toCurrency, currencies) {
        if (!amount || !fromCurrency || !toCurrency || !currencies.length) return null;

        const inputAmount = parseFloat(amount);
        if (isNaN(inputAmount) || inputAmount <= 0) return null;

        try {
            if (fromCurrency === 'IDR') {
                const toCurrencyData = currencies.find(c => c.currency_code === toCurrency);
                if (!toCurrencyData?.sell_rate) return null;
                return inputAmount / parseFloat(toCurrencyData.sell_rate);
            }

            if (toCurrency === 'IDR') {
                const fromCurrencyData = currencies.find(c => c.currency_code === fromCurrency);
                if (!fromCurrencyData?.buy_rate) return null;
                return inputAmount * parseFloat(fromCurrencyData.buy_rate);
            }

            return null;
        } catch (error) {
            console.error("Conversion error:", error);
            return null;
        }
    }

    static formatAmount(amount, currencyCode, locale = undefined) {
        return CurrencyService.formatCurrency(parseFloat(amount), currencyCode, locale);
    }

    static getCurrencySymbol(currencyCode) {
        return CurrencyService.getCurrencySymbol(currencyCode);
    }

    static formatAmountWithSymbol(amount, currencyCode, locale = undefined) {
        const symbol = this.getCurrencySymbol(currencyCode);
        const formattedAmount = this.formatAmount(amount, currencyCode, locale);
        return `${symbol} ${formattedAmount}`;
    }

    static calculateExchangeRates(amount, fromCurrency, toCurrency, convertedAmount) {
        const fromToRate = (parseFloat(convertedAmount) / parseFloat(amount)).toFixed(6);
        const toFromRate = (parseFloat(amount) / parseFloat(convertedAmount)).toFixed(6);
        return { fromToRate, toFromRate };
    }

    static generateConversionTable(fromCurrency, toCurrency, currencies) {
        const amounts = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

        const calculateAmount = (amount, isReverse = false) => {
            const fromCurrencyData = currencies.find(c => c.currency_code === fromCurrency);
            const toCurrencyData = currencies.find(c => c.currency_code === toCurrency);

            let result;
            if (!isReverse) {
                if (fromCurrency === 'IDR') {
                    result = amount / parseFloat(toCurrencyData.sell_rate);
                } else {
                    result = amount * parseFloat(fromCurrencyData.buy_rate);
                }
            } else {
                if (fromCurrency === 'IDR') {
                    result = amount * parseFloat(toCurrencyData.sell_rate);
                } else {
                    result = amount * parseFloat(fromCurrencyData.buy_rate);
                }
            }

            return result.toFixed(5);
        };

        return { amounts, calculateAmount };
    }

    static validateConversion(amount, fromCurrency, toCurrency) {
        // Check for empty fields
        if (!amount || !fromCurrency || !toCurrency) {
            return {
                isValid: false,
                error: 'Please fill in all required fields: amount and both currencies'
            };
        }

        // Validate amount
        const inputAmount = parseFloat(amount);
        if (isNaN(inputAmount)) {
            return {
                isValid: false,
                error: 'Please enter a valid numerical amount (e.g., 100 or 100.50)'
            };
        }

        // Check amount range
        if (inputAmount <= 0) {
            return {
                isValid: false,
                error: 'Amount must be greater than 0'
            };
        }

        if (inputAmount > 999999999) {
            return {
                isValid: false,
                error: 'Amount exceeds maximum limit (999,999,999)'
            };
        }

        // Validate currency selection
        if (fromCurrency === toCurrency) {
            return {
                isValid: false,
                error: 'Please select different currencies for conversion'
            };
        }

        return { isValid: true, error: null };
    }
}

export default CurrencyConversionService;