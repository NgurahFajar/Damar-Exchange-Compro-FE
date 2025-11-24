import React, { useState, useEffect, lazy, Suspense, useCallback, useMemo, memo } from 'react';
import { motion, LazyMotion, domAnimation, useScroll, useSpring, useInView } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance.js';
import Header from '../components/Layouts/Header.jsx';
import Footer from '../components/Layouts/Footer.jsx';
import MainLoading from "@components/Loaders/MainLoading.jsx";
import { useTranslation } from 'react-i18next';
import About from "@/pages/LandingPagePartition/About.jsx";
import whatsappImage from '../../public/assets/whatsapp.webp';


const Carousel = lazy(() => import(/* webpackChunkName: "carousel" */ '../pages/LandingPagePartition/Carousel.jsx'));
const Location = lazy(() => import(/* webpackChunkName: "location" */ '../pages/LandingPagePartition/Location.jsx'));
const CompanyProfile = lazy(() => import(/* webpackChunkName: "company-profile" */ '../pages/LandingPagePartition/CompanyProfile.jsx'));
const GoogleReviews = lazy(() => import(/* webpackChunkName: "company-profile" */ '../pages/LandingPagePartition/GoogleReviews.jsx'));
const CurrencyConverter = lazy(() => import(/* webpackChunkName: "currency-converter" */ '../pages/LandingPagePartition/CurrencyConverter.jsx'));
const CurrencyDashboard = lazy(() => import(/* webpackChunkName: "currency-dashboard" */ '../pages/LandingPagePartition/CurrencyDashboard.jsx'));
const SectionDivider = lazy(() => import(/* webpackChunkName: "section-divider" */ "@components/Layouts/SectionDivider.jsx"));
const ImageGallery = lazy(() => import(/* webpackChunkName: "image-gallery" */ "@/pages/LandingPagePartition/ImageGallery"));


const ComponentLoader = React.memo(({ isDark }) => (
    <div className={`w-full h-32 md:h-64 flex items-center justify-center ${isDark ? 'bg-gray-800/20' : 'bg-white/20'} rounded-lg backdrop-blur-md`}>
        <MainLoading
            isDark={isDark}
            message="Loading component..."
            size={32}
        />
    </div>
));

const animations = {
    fadeInUp: {
        hidden: {
            opacity: 0,
            y: 20,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    },
    fadeIn: {
        hidden: {
            opacity: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    },
    slideInRight: {
        hidden: {
            opacity: 0,
            x: 20,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }
};

const ScrollProgress = memo(() => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-50"
            style={{ scaleX }}
        />
    );
});

const AnimatedSection = memo(({ children, animation = "fadeInUp", className = "" }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <motion.div
            ref={ref}
            variants={animations[animation]}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={className}
        >
            {children}
        </motion.div>
    );
});


const WhatsAppButton = memo(({ isDark }) => {
    const phoneNumber = '+6281338407237';
    const message = 'Hello, I need assistance with currency exchange.';
    const whatsappURL = useMemo(() =>
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        [phoneNumber, message]
    );

    const buttonStyles = useMemo(() => ({
        background: isDark
            ? 'bg-gray-700/80 hover:bg-gray-600/90'
            : 'bg-white hover:bg-gray-50',
        shadow: isDark
            ? 'shadow-lg hover:shadow-xl'
            : 'shadow-md hover:shadow-lg',
        ringFocus: isDark
            ? 'focus:ring-gray-600'
            : 'focus:ring-green-500'
    }), [isDark]);

    return (
        <motion.div
            className="fixed bottom-4 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <button
                    className={`p-3 rounded-full transition-all duration-300 
                        focus:outline-none focus:ring-2 ${buttonStyles.background} 
                        ${buttonStyles.shadow} ${buttonStyles.ringFocus}`}
                >
                    <img
                        src={whatsappImage}
                        alt="WhatsApp"
                        width="27"
                        height="27"
                        className="w-7 h-7 md:w-11 md:h-11"
                        loading="lazy"
                        decoding="async"
                    />
                </button>
            </a>
        </motion.div>
    );
});

const LandingPage = () => {
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(true);
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchCurrencies = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/v1/currencies');
            if (response.data?.data) {
                setCurrencies(response.data.data);
                setLastUpdated(new Date());
                setError(null);
            }
        } catch (err) {
            setError('Failed to fetch currency data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrencies();
        const interval = setInterval(fetchCurrencies, 60000);
        return () => clearInterval(interval);
    }, [fetchCurrencies]);

    const scrollToSection = useCallback((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, []);

    const styleClasses = useMemo(() => ({
        background: isDark
            ? "bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900"
            : "bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50",
        card: isDark
            ? "bg-gray-800/20 backdrop-blur-md"
            : "bg-white/20 backdrop-blur-md"
    }), [isDark]);

    if (loading) {
        return (
            <MainLoading
                isDark={isDark}
                message="Loading accessing page..."
                fullScreen
                size={60}
            />
        );
    }

    return (
        <LazyMotion features={domAnimation}>
            <div className={`min-h-screen ${styleClasses.background} transition-colors duration-500`}>
                <ScrollProgress />
                {/* Static background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"/>
                </div>
                <WhatsAppButton isDark={isDark} />
                <Header isDark={isDark} setIsDark={setIsDark} onNavigate={scrollToSection} />

                <main className="relative overflow-hidden">
                    <div className="h-16 sm:h-24" />
                    <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                        <AnimatedSection>
                            <div className="w-full">
                                <Carousel isDark={isDark}/>
                            </div>
                        </AnimatedSection>
                    </Suspense>

                    <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                        <SectionDivider isDark={isDark} variant="icon" />
                    </Suspense>

                    {/* Hero Section */}
                    <section id="home" className="min-h-[50vh] sm:min-h-screen">
                        <div className="container mx-auto max-w-6xl px-8 md:px-12 lg:px-16">
                            <AnimatedSection animation="fadeInUp">
                                <section id="about" className="my-12 lg:my-16">
                                    <About isDark={isDark}/>
                                </section>
                                <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                                    <AnimatedSection animation="slideInRight">
                                        <div id="currencyDashboard">
                                            <CurrencyDashboard
                                                isDark={isDark}
                                                currencies={currencies}
                                                onRefresh={fetchCurrencies}
                                                lastUpdated={lastUpdated}
                                            />
                                        </div>
                                    </AnimatedSection>
                                    <AnimatedSection animation="slideInRight">
                                        <div id="currencyConverter">
                                            <CurrencyConverter isDark={isDark} currencies={currencies}/>
                                        </div>
                                    </AnimatedSection>
                                </Suspense>
                            </AnimatedSection>
                        </div>
                    </section>

                    <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                        <SectionDivider isDark={isDark} variant="icon" />
                    </Suspense>

                    <section id="company-profile">
                        <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                            <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                                <AnimatedSection animation="fadeInUp">
                                    <CompanyProfile isDark={isDark}/>
                                </AnimatedSection>
                            </Suspense>
                        </div>
                    </section>

                    <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                        <SectionDivider isDark={isDark} variant="icon" />
                    </Suspense>

                    <section>
                        <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
                            <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                                <GoogleReviews isDark={isDark}/>
                            </Suspense>
                        </div>
                    </section>

                    <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                        <SectionDivider isDark={isDark} variant="icon" />
                    </Suspense>

                    <section id="gallery">
                        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                            <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                                <AnimatedSection animation="fadeInUp">
                                    <ImageGallery isDark={isDark}/>
                                </AnimatedSection>
                            </Suspense>
                        </div>
                    </section>

                    <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                        <SectionDivider isDark={isDark} variant="icon" />
                    </Suspense>

                    <section id="location">
                        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                            <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                                <AnimatedSection animation="fadeInUp">
                                    <Location isDark={isDark}/>
                                </AnimatedSection>
                            </Suspense>
                        </div>
                    </section>

                    <AnimatedSection animation="fadeIn">
                        <section id="footer">
                            <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                                <Footer isDark={isDark}/>
                            </Suspense>
                        </section>
                    </AnimatedSection>
                </main>
            </div>
        </LazyMotion>
    );
};

export default LandingPage;