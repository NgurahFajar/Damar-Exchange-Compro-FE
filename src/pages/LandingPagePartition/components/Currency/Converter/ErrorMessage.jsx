import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const errorVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

export const ErrorMessage = ({ error, isDark, onDismiss }) => {
    const baseClasses = `
    flex items-center gap-3 px-4 py-3 rounded-xl
    shadow-lg backdrop-blur-sm
    transform-gpu
    ${isDark ?
        'bg-red-900/30 text-red-200 border border-red-700/50' :
        'bg-red-50 text-red-700 border border-red-200'
    }
  `;

    return (
        <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={baseClasses}
            role="alert"
            aria-live="polite"
        >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className={`ml-auto p-1 rounded-full hover:bg-red-800/20 
            transition-colors duration-200`}
                    aria-label="Dismiss error"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
};

export default ErrorMessage;