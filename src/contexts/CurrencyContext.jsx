import {createContext, useCallback, useEffect, useMemo, useRef, useState} from "react";
import CurrencyService from "@/services/Currency/CurrencyService.js";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const abortControllerRef = useRef(null);

    const fetchCurrencies = useCallback(async (useCache = true) => {
        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            setLoading(true);
            const response = await CurrencyService.getAllCurrencies(useCache,
                abortControllerRef.current.signal);

            setCurrencies(response.data);
            setLastUpdated(new Date());
            setError(null);
        } catch (error) {
            if (error.name === 'AbortError') return;
            setError(error.message || 'Failed to fetch currencies');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrencies();
        const interval = setInterval(() => fetchCurrencies(false), 60000);

        return () => {
            clearInterval(interval);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchCurrencies]);

    const value = useMemo(() => ({
        currencies,
        loading,
        error,
        lastUpdated,
        fetchCurrencies
    }), [currencies, loading, error, lastUpdated, fetchCurrencies]);


    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};