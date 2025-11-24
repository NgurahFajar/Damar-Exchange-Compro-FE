import { api } from '@utils/axiosInstance.js';
import html2canvas from 'html2canvas';

const currencySymbols = {
  // --- Major currencies ---
  USD: "$",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  CNY: "¥",
  HKD: "HK$",
  NZD: "NZ$",

  // --- Asia ---
  IDR: "Rp",
  SGD: "S$",
  MYR: "RM",
  THB: "฿",
  PHP: "₱",
  VND: "₫",
  KRW: "₩",
  INR: "₹",
  BDT: "৳",
  LKR: "Rs",
  MMK: "K",
  KHR: "៛",
  LAK: "₭",
  PKR: "Rs",
  AFN: "؋",
  IRR: "﷼",
  IQD: "د.ع",
  ILS: "₪",
  SAR: "﷼",
  AED: "د.إ",
  QAR: "﷼",
  KWD: "د.ك",
  OMR: "﷼",
  BHD: "ب.د",
  JOD: "د.أ",
  TRY: "₺",

  // --- Europe (non-euro included) ---
  DKK: "kr",
  NOK: "kr",
  SEK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  RON: "lei",
  BGN: "лв",
  HRK: "kn",
  RUB: "₽",
  UAH: "₴",
  ISK: "kr",

  // --- Americas ---
  MXN: "$",
  BRL: "R$",
  ARS: "$",
  CLP: "$",
  COP: "$",
  PEN: "S/",
  UYU: "$U",
  VES: "Bs",
  DOP: "RD$",
  CRC: "₡",
  GTQ: "Q",
  HNL: "L",
  NIO: "C$",
  PAB: "B/.",
  BZD: "BZ$",
  BBD: "Bds$",
  BSD: "B$",
  TTD: "TT$",
  XCD: "EC$",

  // --- Africa ---
  ZAR: "R",
  NGN: "₦",
  EGP: "£",
  KES: "KSh",
  TZS: "TSh",
  UGX: "USh",
  GHS: "₵",
  DZD: "د.ج",
  MAD: "د.م.",
  TND: "د.ت",
  ETB: "Br",
  XAF: "FCFA",
  XOF: "CFA",
  BWP: "P",
  MZN: "MT",

  // --- Oceania / Pacific ---
  FJD: "FJ$",
  PGK: "K",
  WST: "T",
  TOP: "T$",
  VUV: "Vt",
};

class CurrencyServiceError extends Error {
    constructor(message, code = 500, data = null) {
        super(message);
        this.name = 'CurrencyServiceError';
        this.code = code;
        this.data = data;
    }
}

export const CurrencyService = {
    _cache: {
        currencies: null,
        timestamp: null,
        ttl: 1000 * 60 * 5, // 5 minutes cache
    },

    async getAllCurrencies(forceRefresh = false) {
        try {
            // Check cache first
            const now = Date.now();
            if (!forceRefresh &&
                this._cache.currencies &&
                this._cache.timestamp &&
                (now - this._cache.timestamp < this._cache.ttl)) {
                console.log('Returning cached currencies');
                return {
                    data: this._cache.currencies,
                    status: 'success',
                    fromCache: true
                };
            }

            console.log('Fetching fresh currencies...');
            const response = await api.get('/currencies');

            if (!response?.data) {
                throw new Error('Invalid API response: No data received');
            }

            const currencyData = Array.isArray(response.data) ?
                response.data : response.data.data;

            if (!Array.isArray(currencyData)) {
                throw new Error('Invalid API response: Data is not an array');
            }

            // Process and validate each currency object
            const processedData = currencyData.map(currency => {
                if (!currency.currency_code) {
                    throw new Error('Invalid currency data: Missing currency code');
                }
                return {
                    ...currency,
                    buy_rate: parseFloat(currency.buy_rate) || 0,
                    sell_rate: parseFloat(currency.sell_rate) || 0,
                    symbol: this.getCurrencySymbol(currency.currency_code)
                };
            });

            // Update cache
            this._cache.currencies = processedData;
            this._cache.timestamp = now;

            return {
                data: processedData,
                status: 'success',
                fromCache: false
            };
        } catch (error) {
            console.error('CurrencyService error:', error);
            // Return cached data if available when request fails
            if (this._cache.currencies) {
                return {
                    data: this._cache.currencies,
                    status: 'error',
                    fromCache: true,
                    error: error.message
                };
            }
            throw error;
        }
    },

    getCurrencyByCode: async (currencyCode) => {
        try {
            const response = await api.get(`/currencies/${currencyCode}`);
            return response;
        } catch (error) {
            console.error(`Error fetching currency ${currencyCode}:`, error);
            throw new CurrencyServiceError(
                error.message || 'Failed to fetch currency',
                error.code || 500,
                error.data
            );
        }
    },

    createCurrency: async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            };
            const response = await api.post('/currencies', formData, config);
            return response;
        } catch (error) {
            throw new CurrencyServiceError(
                error.message || 'Failed to create currency',
                error.code || 500,
                error.data
            );
        }
    },

    updateCurrency: async (currencyCode, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            };
            formData.append('_method', 'PUT');
            const response = await api.post(`/currencies/${currencyCode}`, formData, config);
            return response;
        } catch (error) {
            throw new CurrencyServiceError(
                error.message || 'Failed to update currency',
                error.code || 500,
                error.data
            );
        }
    },

    deleteCurrency: async (currencyCode) => {
        try {
            const response = await api.delete(`/currencies/${currencyCode}`);
            return response;
        } catch (error) {
            throw new CurrencyServiceError(
                error.message || 'Failed to delete currency',
                error.code || 500,
                error.data
            );
        }
    },

    convertCurrency: (params) => {
        const { amount, fromCurrency, toCurrency, currencies } = params;

        if (!amount || !fromCurrency || !toCurrency || !currencies?.length) {
            throw new CurrencyServiceError('Invalid conversion parameters', 400);
        }

        const fromCurrencyData = currencies.find(c => c.currency_code === fromCurrency);
        const toCurrencyData = currencies.find(c => c.currency_code === toCurrency);

        if (!fromCurrencyData || !toCurrencyData) {
            throw new CurrencyServiceError('Currency not found', 404);
        }

        let result;
        let rate;

        if (fromCurrency === 'IDR') {
            rate = 1 / parseFloat(toCurrencyData.sell_rate);
            result = amount * rate;
        } else if (toCurrency === 'IDR') {
            rate = parseFloat(fromCurrencyData.buy_rate);
            result = amount * rate;
        } else {
            throw new CurrencyServiceError('Invalid currency pair', 400);
        }

        return {
            status: 'success',
            data: {
                amount: Number(amount),
                from_currency: fromCurrency,
                to_currency: toCurrency,
                result: Number(result.toFixed(2)),
                rate: Number(rate.toFixed(6))
            },
            message: 'Conversion calculated successfully'
        };
    },

    getConversionTable: (params) => {
        const { fromCurrency, toCurrency, currencies } = params;
        const amounts = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

        return amounts.map(amount => ({
            amount,
            forward: CurrencyService.convertCurrency({
                amount, fromCurrency, toCurrency, currencies
            }),
            reverse: CurrencyService.convertCurrency({
                amount, fromCurrency: toCurrency, toCurrency: fromCurrency, currencies
            })
        }));
    },
    getCurrencySymbol: (code) => currencySymbols[code] || code,

    formatCurrency: (value, currencyCode, locale = 'id-ID') => {
        const symbol = currencySymbols[currencyCode] || currencyCode;
        const formattedValue = value.toLocaleString(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return `${symbol} ${formattedValue}`;
    },

    /*SelectablePrintableTable Service*/
    preloadImage: async (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    generatePrintableTable: async (params) => {
        const {
            selectedCurrencies,
            currencies,
            isDark,
            element,
            lastUpdated
        } = params;

        try {
            // Preload all currency flags
            const selectedItems = currencies.filter(c => selectedCurrencies.includes(c.currency_code));
            await Promise.all(selectedItems.map(c =>
                c.icon_url ? CurrencyService.preloadImage(c.icon_url) : Promise.resolve()
            ));

            if (!element) {
                throw new CurrencyServiceError('Print element not found', 404);
            }

            // Create a clone for proper styling
            const clone = element.cloneNode(true);
            clone.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                width: 1200px;
                background-color: ${isDark ? '#1F2937' : '#FFFFFF'};
                color: ${isDark ? '#FFFFFF' : '#1F2937'};
                padding: 20px;
                z-index: -1000;
            `;
            document.body.appendChild(clone);

            // Wait for images to load
            await Promise.all(
                Array.from(clone.getElementsByTagName('img')).map(
                    img => new Promise((resolve) => {
                        if (img.complete) resolve();
                        else {
                            img.onload = resolve;
                            img.onerror = resolve;
                        }
                    })
                )
            );

            // Generate canvas
            const canvas = await html2canvas(clone, {
                scale: 2,
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                logging: false,
                useCORS: true,
                allowTaint: true,
                imageTimeout: 15000,
                removeContainer: true,
                windowWidth: 1200,
                onclone: (clonedDoc) => {
                    const element = clonedDoc.querySelector('.hidden > div');
                    if (element) {
                        element.querySelectorAll('*').forEach(el => {
                            if (window.getComputedStyle(el).color === 'rgb(0, 0, 0)') {
                                el.style.color = isDark ? '#FFFFFF' : '#1F2937';
                            }
                        });
                    }
                }
            });

            document.body.removeChild(clone);

            return canvas;
        } catch (error) {
            console.error('Error generating printable table:', error);
            throw new CurrencyServiceError(
                error.message || 'Failed to generate printable table',
                error.code || 500
            );
        }
    },

    downloadTableAsImage: async (canvas) => {
        try {
            const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
            const link = document.createElement('a');
            link.download = `currency-rates-${new Date().toISOString().split('T')[0]}.jpg`;
            link.href = dataUrl;
            link.click();
            return true;
        } catch (error) {
            console.error('Error downloading table:', error);
            throw new CurrencyServiceError(
                error.message || 'Failed to download table as image',
                error.code || 500
            );
        }
    },

    searchCurrencies: (currencies, searchTerm) => {
        const searchLower = searchTerm.toLowerCase();
        return currencies.filter(currency => (
            currency.currency_code.toLowerCase().includes(searchLower) ||
            currency.currency_name.toLowerCase().includes(searchLower)
        ));
    },

    formatCurrencyValue: (value) => {
        if (value === null) return '-';
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
};

export default CurrencyService;