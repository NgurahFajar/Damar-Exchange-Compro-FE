import React from 'react';
import { motion } from 'framer-motion';
import { HashLoader } from 'react-spinners';

const MainLoading = ({
                         isDark = true,
                         message = "Loading...",
                         fullScreen = false,
                         size = 50,
                         color = "#ea580c", // Orange-600 to match your theme
                         className = ""
                     }) => {
    // Matching your landing page background gradients
    const backgroundClass = isDark
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
        : "bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50";

    const cardClass = isDark
        ? "bg-gray-800/40 backdrop-blur-md"
        : "bg-white/30 backdrop-blur-md";

    const textClass = isDark ? "text-white" : "text-gray-900";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    // Background blob animation matching your landing page
    const BlobBackground = () => (
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={`blob-${i}`}
                    className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        delay: i * 2,
                    }}
                    style={{
                        width: '500px',
                        height: '500px',
                        left: `${30 * i}%`,
                        top: `${20 * i}%`,
                        backgroundColor: isDark ? '#4c1d95' : '#E25822',
                    }}
                />
            ))}
        </div>
    );

    const LoadingWrapper = ({ children }) => {
        if (fullScreen) {
            return (
                <div className={`fixed inset-0 flex items-center justify-center ${backgroundClass} ${className}`}>
                    <BlobBackground />
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={`${cardClass} p-8 md:p-12 rounded-2xl shadow-lg relative z-10 border border-white/10`}
                    >
                        {children}
                    </motion.div>
                </div>
            );
        }
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`flex items-center justify-center p-4 ${className}`}
            >
                {children}
            </motion.div>
        );
    };

    return (
        <LoadingWrapper>
            <div className="flex flex-col items-center space-y-6">
                <HashLoader
                    color={isDark ? "#f97316" : "#ea580c"}
                    size={size}
                    loading={true}
                    speedMultiplier={0.5}
                />
                {message && (
                    <div className="text-center space-y-2">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`${textClass} text-lg md:text-xl font-medium`}
                        >
                            {message}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}
                        >
                            Please wait while we process your request
                        </motion.p>
                    </div>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default MainLoading;