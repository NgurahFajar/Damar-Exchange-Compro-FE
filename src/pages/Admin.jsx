import React, { memo, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext.jsx';
import Sidebar from '../pages/AdminPartition/components/SideBar.jsx';
import Dashboard from './AdminPartition/Dashboard';
import CurrencyManipulation from './AdminPartition/CurrencyManipulation';
import ImageManagement from './AdminPartition/ImageManagement';
import { Image } from 'lucide-react';


const ContentWrapper = memo(({ children }) => (
    <main className="flex-1 ml-64 min-h-screen relative z-10">
        <div className="p-6">
            <AnimatePresence mode="wait">
                {children}
            </AnimatePresence>
        </div>
    </main>
));

// Routes configuration
const ROUTES = [
    { path: 'dashboard', element: Dashboard },
    { path: 'currency', element: CurrencyManipulation },
    { path: 'images', element: ImageManagement },
    { path: '/', element: Dashboard },
];

const Admin = () => {
    const { isDark, backgroundClass } = useTheme();

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }), []);

    const styleClasses = useMemo(() => ({
        background: isDark
            ? "bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900"
            : "bg-gradient-to-br from-purple-500 via-orange-100 to-blue-100",
        card: isDark
            ? "bg-gray-800/20 backdrop-blur-md"
            : "bg-white/20 backdrop-blur-md"
    }), [isDark]);

    return (
        <div className={`min-h-screen ${styleClasses.background} transition-colors duration-500`}>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"/>
            </div>

            <div className="fixed left-0 top-0 h-full z-20">
                <Sidebar />
            </div>

            {/* Main Content */}
            <ContentWrapper>
                <Routes>
                    {ROUTES.map(({ path, element: Component }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<Component />}
                        />
                    ))}
                </Routes>
            </ContentWrapper>
        </div>
    );
};

export default Admin;