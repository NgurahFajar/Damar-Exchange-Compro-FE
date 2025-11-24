import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Globe, Menu, X, ChevronDown } from 'lucide-react';
import logo from '../../../public/logo_example.svg';
import { useTranslation } from 'react-i18next';
import _ from "lodash";



const animations = {
    scale: {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
    },
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    }
};

const NavigationButton = memo(({ item, isDark, isActive, onClick, hasSubmenu }) => (
    <motion.button
        {...animations.scale}
        onClick={onClick}
        className={`px-4 py-2.5 rounded-xl transition-all duration-200 relative text-sm font-medium font-poppins flex items-center gap-2
            ${isDark
            ? `text-gray-300 hover:text-white hover:bg-gray-800/50 ${isActive ? 'bg-gray-800/50' : ''}`
            : `text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 ${isActive ? 'bg-gray-100/50' : ''}`}`}
    >
        {item.label}
        {isActive && (
            <motion.div
                layoutId="activeTab"
                className="absolute -bottom-2 left-2 right-2 h-1 bg-[#DC5233] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
));

const ThemeToggle = memo(({ isDark, onChange }) => (
    <motion.button
        {...animations.scale}
        onClick={onChange}
        className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 w-full
            ${isDark
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 shadow-lg shadow-yellow-400/15'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-lg shadow-gray-400/10'}`}
    >
        <div className="flex items-center justify-center gap-2">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                >
                    {isDark
                        ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                        : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
                </motion.div>
            </AnimatePresence>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
        </div>
    </motion.button>
));

const LanguageToggle = memo(({ isDark, currentLang, onChange }) => (
    <motion.button
        {...animations.scale}
        onClick={onChange}
        className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl transition-all duration-200 
            ${isDark
            ? 'text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/30'
            : 'text-gray-900 hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-200/50'}`}
    >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
            {currentLang === 'en' ? 'English' : 'Indonesia'}
        </span>
    </motion.button>
));

const MobileMenu = memo(({ isOpen, onClose, children, isDark, activeSection, themeToggle, languageToggle }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    {...animations.fadeIn}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    className={`fixed top-0 right-0 w-[85%] max-w-md h-screen z-50 flex flex-col
                        ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-l border-gray-700/30' : 'bg-white border-l border-gray-200/30'} 
                        backdrop-blur-xl shadow-2xl overflow-hidden`}
                >
                    <div className="h-20 px-6 flex items-center justify-between border-b border-gray-500/10 bg-opacity-50 backdrop-blur-sm">
                        <h2 className={`text-xl font-bold font-poppins tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Menu
                        </h2>
                        <motion.button
                            onClick={onClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2.5 rounded-xl transition-colors duration-200 ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    </div>
                    <nav className="flex-1 p-6 space-y-2.5 overflow-y-auto">
                        {React.Children.map(children, child => (
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`relative rounded-xl transition-all duration-200 ${
                                    activeSection === child.props.item.id
                                        ? (isDark ? 'bg-gray-800/50' : 'bg-gray-100/50')
                                        : 'hover:bg-gray-500/5'
                                }`}
                            >
                                {child}
                            </motion.div>
                        ))}
                    </nav>
                    <div className="p-6 space-y-3 border-t border-gray-500/10">
                        {themeToggle}
                        {languageToggle}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
));

const useScrollAnimation = (offset = 80) => {
    return useCallback((element) => {
        if (!element) return;

        // Get header height dynamically
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;

        // Calculate position considering header height
        const targetPosition = element.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight -
            16; // Additional offset for spacing

        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // Slightly reduced for snappier scrolling

        let startTime = null;

        // Improved easing function for smoother scrolling
        const easeInOutQuart = t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;

        const animation = currentTime => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            window.scrollTo(0, startPosition + (distance * easeInOutQuart(progress)));

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }, [offset]);
};

const Header = memo(({ isDark, setIsDark }) => {
    const { t, i18n } = useTranslation();
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const smoothScroll = useScrollAnimation();

    const navigationItems = useMemo(() => [
        { id: 'home', label: t('home') },
        {
            id: 'currency',
            label: t('currency'),
            sectionRef: 'currencyDashboard',
            submenu: [
                { id: 'rates', label: t('rates') },
                { id: 'history', label: t('history') }
            ]
        },
        { id: 'converter', label: t('converter'), sectionRef: 'currencyConverter' },
        { id: 'company-profile', label: t('companyProfile') },
        { id: 'location', label: t('location') },
        { id: 'footer', label: t('contact') }
    ], [t]);

    useEffect(() => {
        const handleScroll = _.throttle(() => {
            setIsScrolled(window.scrollY > 20);
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            handleScroll.cancel();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToSection = useCallback((sectionId, sectionRef) => {
        const element = document.getElementById(sectionRef || sectionId);
        if (!element) return;

        setIsMobileMenuOpen(false);
        smoothScroll(element);
        setActiveSection(sectionId);
    }, [smoothScroll]);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                ${isScrolled
                ? (isDark ? 'bg-gray-700/20' : 'bg-white/95')
                : 'bg-transparent'} 
                backdrop-blur-xl border-b ${isDark ? 'border-gray-800/30' : 'border-gray-200/30'}`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 sm:h-24">
                    <motion.div
                        {...animations.scale}
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => scrollToSection('home')}
                    >
                        <img src={logo} alt="Logo" className="h-10 w-auto md:h-16" />
                        <div className="flex flex-col">
                            <span className={`text-sm md:text-xl lg:text-2xl font-bold font-poppins tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Damar <span className="text-[#DC5233]">Exchange</span>
                            </span>
                            <span className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} font-poppins sm:block`}>
                                Your Trusted Exchange Partner
                            </span>
                        </div>
                    </motion.div>

                    <nav className="hidden lg:flex items-center space-x-2">
                        {navigationItems.map(item => (
                            <NavigationButton
                                key={item.id}
                                item={item}
                                isDark={isDark}
                                isActive={activeSection === item.id}
                                onClick={() => scrollToSection(item.id, item.sectionRef)}
                                hasSubmenu={item.submenu}
                            />
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Show theme and language toggles only on large screens */}
                        <div className="hidden lg:flex items-center gap-2">
                            <ThemeToggle isDark={isDark} onChange={() => setIsDark(!isDark)} />
                            <motion.button
                                {...animations.scale}
                                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 
                                    ${isDark
                                    ? 'text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/30'
                                    : 'text-gray-900 hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-200/50'}`}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {i18n.language === 'en' ? 'EN' : 'ID'}
                                </span>
                            </motion.button>
                        </div>
                        <motion.button
                            {...animations.scale}
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`lg:hidden p-2.5 rounded-xl transition-all duration-200
                                ${isDark
                                ? 'text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/30'
                                : 'text-gray-900 hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-200/50'}`}
                        >
                            <Menu className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                isDark={isDark}
                activeSection={activeSection}
                themeToggle={
                    <ThemeToggle
                        isDark={isDark}
                        onChange={() => setIsDark(!isDark)}
                    />
                }
                languageToggle={
                    <LanguageToggle
                        isDark={isDark}
                        currentLang={i18n.language}
                        onChange={() => i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en')}
                    />
                }
            >
                {navigationItems.map(item => (
                    <NavigationButton
                        key={item.id}
                        item={item}
                        isDark={isDark}
                        isActive={activeSection === item.id}
                        onClick={() => scrollToSection(item.id, item.sectionRef)}
                        hasSubmenu={item.submenu}
                    />
                ))}
            </MobileMenu>
        </motion.header>
    );
});

NavigationButton.displayName = 'NavigationButton';
ThemeToggle.displayName = 'ThemeToggle';
LanguageToggle.displayName = 'LanguageToggle';
MobileMenu.displayName = 'MobileMenu';
Header.displayName = 'Header';

export default Header;