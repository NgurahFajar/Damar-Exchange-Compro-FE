import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {LayoutDashboard, DollarSign, LogOut, Loader2, Sun, Moon, ImageIcon} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import logo from "../../../../public/logo_example.svg";

const Sidebar = () => {
    const { isDark, setIsDark } = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const menuItems = [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/admin/dashboard' },
        { icon: DollarSign, text: 'Currency Manipulation', path: '/admin/currency' },
        { icon: ImageIcon, text: 'Image Management', path: '/admin/images' },
    ];

    const activeClassLight = "bg-gradient-to-r from-purple-800 to-purple-900 text-white";
    const activeClassDark = "bg-gradient-to-r from-orange-600 to-orange-700 text-white";
    const inactiveClass = isDark
        ? "text-gray-300 hover:bg-white/10"
        : "text-gray-600 hover:bg-purple-50";

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`fixed left-0 top-0 h-screen w-64 flex flex-col font-poppins ${
                isDark
                    ? "bg-gray-800/40 backdrop-blur-md border-r border-white/10"
                    : "bg-white/80 backdrop-blur-md border-r border-purple-100"
            } transition-colors duration-500`}
        >
            {/* Logo and Title Section */}
            <div className="p-6 flex flex-col items-center space-y-4">
                <motion.div
                    className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-orange-700 flex items-center justify-center"
                    whileHover={{scale: 1.05, rotate: 5}}
                    whileTap={{scale: 0.95}}
                >
                    <img src={logo} alt="Logo" className="w-auto h-auto" />
                </motion.div>
                <div className="flex flex-col items-center">
                    <h1 className={`text-sm md:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Damar <span className="text-[#DC5233]">Exchange</span>
                    </h1>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-6 flex-grow">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center px-6 py-3 text-sm
                            ${isActive
                            ? (isDark ? activeClassDark : activeClassLight)
                            : inactiveClass}
                            transition-colors duration-200
                        `}
                    >
                        {({ isActive }) => (
                            <motion.div
                                className="flex items-center"
                                whileHover={{ x: 5 }}
                                animate={{ scale: isActive ? 1.05 : 1 }}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.text}
                            </motion.div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Controls */}
            <div className="p-4 flex items-center space-x-2">
                {/* Logout Button */}
                <motion.button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg
                        ${isDark
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    } transition-colors duration-200`}
                >
                    {isLoggingOut ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <div className="flex items-center">
                            <LogOut className="h-5 w-5 mr-2" />
                            <span>Logout</span>
                        </div>
                    )}
                </motion.button>

                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200"
                    onClick={() => setIsDark(!isDark)}
                >
                    {isDark ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;