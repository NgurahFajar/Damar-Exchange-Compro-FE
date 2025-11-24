import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, ArrowRight, Moon, Sun, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MainLoading from '../components/Loaders/MainLoading';

// AnimatedBackground component remains the same
const AnimatedBackground = memo(({ isDark }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
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
                    width: '400px',
                    height: '400px',
                    left: `${30 * i}%`,
                    top: `${20 * i}%`,
                    backgroundColor: isDark ? '#4c1d95' : '#E25822',
                }}
            />
        ))}
    </div>
));

// ErrorAlert component remains the same
const ErrorAlert = memo(({ error }) => (
    <AnimatePresence>
        {error && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
            >
                <div className="flex items-center space-x-2">
                    <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="text-sm text-red-400 font-medium">{error}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
));

const Login = () => {
    // State declarations remain the same
    const [credentials, setCredentials] = useState({
        user: '',
        password: '',
        remember_me: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDark, setIsDark] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, user } = useAuth();

    // Effects and handlers remain the same
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('login')) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, user, navigate, location]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(credentials);
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.error);
                setCredentials(prev => ({
                    ...prev,
                    password: ''
                }));
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Authentication failed');
            setCredentials(prev => ({
                ...prev,
                password: ''
            }));
        } finally {
            setLoading(false);
        }
    }, [credentials, login, navigate]);

    const handleBackToLanding = useCallback(() => {
        navigate('/');
    }, [navigate]);

    // Animation variants and style classes remain the same
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const backgroundClass = isDark
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
        : "bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50";

    const cardClass = isDark
        ? "bg-gray-800/40 backdrop-blur-md"
        : "bg-white/30 backdrop-blur-md";

    const inputClass = isDark
        ? "border-gray-700/50 bg-gray-700/50"
        : "border-gray-200/50 bg-white/50";

    return (
        <div className="fixed inset-0 w-full min-h-screen font-poppins">
            <div className={`relative w-full min-h-screen flex items-center justify-center ${backgroundClass} transition-colors duration-500`}>
                <AnimatedBackground isDark={isDark} />

                {/* Back to Landing Page Button */}
                <motion.button
                    className={`absolute top-4 left-4 px-4 py-2 rounded-lg ${
                        isDark ? 'bg-gray-800/40 text-white' : 'bg-white/30 text-gray-800'
                    } backdrop-blur-sm flex items-center space-x-2 hover:bg-opacity-50 transition-all`}
                    onClick={handleBackToLanding}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Landing Page</span>
                </motion.button>

                <motion.div
                    className={`relative w-full max-w-md p-8 m-4 ${cardClass} rounded-2xl shadow-2xl border border-opacity-20 ${
                        isDark ? 'border-white/20' : 'border-gray-200/30'
                    }`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Theme toggle button */}
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm"
                        onClick={() => setIsDark(!isDark)}
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-yellow-400"/>
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600"/>
                        )}
                    </motion.button>

                    {/* Header content */}
                    <motion.div className="text-center space-y-4" variants={itemVariants}>
                        <motion.div
                            className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center"
                            whileHover={{scale: 1.05, rotate: 5}}
                            whileTap={{scale: 0.95}}
                        >
                            <Lock className="h-10 w-10 text-white"/>
                        </motion.div>

                        <motion.h2
                            className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                            variants={itemVariants}
                        >
                            Damar Exchange
                        </motion.h2>

                        <motion.p
                            className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                            variants={itemVariants}
                        >
                            Login to access Admin Dashboard
                        </motion.p>
                    </motion.div>

                    <ErrorAlert error={error} />

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <motion.div className="space-y-4" variants={itemVariants}>
                            {/* Username input */}
                            <div className="relative">
                                <User
                                    className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}/>
                                <motion.input
                                    whileFocus={{scale: 1.02}}
                                    type="text"
                                    required
                                    className={`pl-10 block w-full rounded-lg ${inputClass} px-3 py-3 ${isDark ? 'text-white' : 'text-gray-900'} placeholder-gray-400`}
                                    placeholder="Username"
                                    value={credentials.user}
                                    onChange={(e) => setCredentials({
                                        ...credentials,
                                        user: e.target.value.toLowerCase().trim()
                                    })}
                                />
                            </div>

                            {/* Password input */}
                            <div className="relative">
                                <Lock
                                    className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}/>
                                <motion.input
                                    whileFocus={{scale: 1.02}}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className={`pl-10 pr-10 block w-full rounded-lg ${inputClass} px-3 py-3 ${isDark ? 'text-white' : 'text-gray-900'} placeholder-gray-400`}
                                    placeholder="Password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember me checkbox */}
                        <motion.div variants={itemVariants} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    checked={credentials.remember_me}
                                    onChange={(e) => setCredentials({...credentials, remember_me: e.target.checked})}
                                />
                                <label htmlFor="remember-me"
                                       className={`ml-2 block text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Remember me
                                </label>
                            </div>
                        </motion.div>

                        {/* Submit button */}
                        <motion.button
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 rounded-lg text-white
                                ${loading ? 'bg-orange-500/80' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <MainLoading size={20} isDark={isDark} message="" fullScreen={false} />
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                <span className="flex items-center">
                                    Log in
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                                </span>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Full screen loading overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50"
                    >
                        <MainLoading
                            isDark={isDark}
                            message="Authenticating..."
                            fullScreen={true}
                            size={60}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;