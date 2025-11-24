import React, {createContext, useCallback, useContext, useState} from 'react';
import {useLocalStorage} from "@/hooks/Currency/useLocalStorage.js";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useLocalStorage('theme', true);

    // Base styles
    const backgroundClass = isDark
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-gradient"
        : "bg-gradient-to-br from-orange-400 via-purple-500 to-orange-600 animate-gradient-xy";

    const cardClass = isDark
        ? "backdrop-blur-lg bg-gray-800/40 border border-gray-700/30 shadow-2xl"
        : "backdrop-blur-lg bg-white/20 border border-gray-200/30 shadow-2xl";

    // Text styles
    const textClass = isDark
        ? "text-white"
        : "text-gray-800";

    const secondaryTextClass = isDark
        ? "text-gray-300"
        : "text-gray-600";

    // Table styles
    const tableHeaderClass = isDark
        ? "bg-gray-800/50 text-white font-medium"
        : "bg-gray-100/50 text-gray-800 font-medium";

    const tableRowClass = isDark
        ? "border-gray-700/30 hover:bg-gray-700/30"
        : "border-gray-200 hover:bg-gray-50/80";

    const tableDataClass = isDark
        ? "text-white"
        : "text-gray-800";

    // Input styles
    const inputClass = isDark
        ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
        : "bg-white/90 border-gray-200 text-gray-800 placeholder-gray-500";

    // Button styles
    const primaryButtonClass = isDark
        ? "bg-orange-600 hover:bg-orange-700 text-white"
        : "bg-orange-500 hover:bg-orange-600 text-white";

    const secondaryButtonClass = isDark
        ? "bg-gray-700/50 hover:bg-gray-600/50 text-white"
        : "bg-gray-100 hover:bg-gray-200 text-gray-800";

    // Currency converter specific
    const converterStyles = {
        text: isDark ? 'text-white' : 'text-gray-800',
        mutedText: isDark ? 'text-gray-300' : 'text-gray-600',
        innerBg: isDark ? 'bg-gray-700/50' : 'bg-white/90',
        borderColor: isDark ? 'border-gray-600' : 'border-gray-200',
    };

    // Dashboard specific
    const dashboardStyles = {
        gradientBg: isDark
            ? 'bg-gradient-to-br from-gray-800/40 to-gray-700/40'
            : 'bg-gradient-to-br from-white to-gray-50',
        refreshButton: {
            base: "flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium shadow-lg transition-colors",
            active: "bg-orange-600 hover:bg-orange-700",
            disabled: "bg-orange-400 cursor-not-allowed"
        },
        alert: {
            bg: isDark ? 'bg-gray-800' : 'bg-white',
            text: isDark ? 'text-white' : 'text-gray-800'
        }
    };

    // Hover effects
    const hoverClass = isDark
        ? "hover:bg-gray-700/30 hover:shadow-lg hover:shadow-gray-800/20"
        : "hover:bg-white/30 hover:shadow-lg hover:shadow-gray-200/50";

    // Loading states
    const loadingClass = isDark
        ? "bg-gray-800/20"
        : "bg-white/20";

    const themeValue = {
        isDark,
        setIsDark,
        backgroundClass,
        cardClass,
        textClass,
        secondaryTextClass,
        tableHeaderClass,
        tableRowClass,
        tableDataClass,
        inputClass,
        primaryButtonClass,
        secondaryButtonClass,
        converterStyles,
        dashboardStyles,
        hoverClass,
        loadingClass
    };

    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev);
    }, []);

    return (
        <ThemeContext.Provider value={themeValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;