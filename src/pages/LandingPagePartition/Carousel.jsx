import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Import images directly
import carousel1 from '../../../public/assets/carousel 4.webp';
import carousel2 from '../../../public/assets/carousel 5.webp';
import carousel3 from '../../../public/assets/carousel 2.webp';
import carousel4 from '../../../public/assets/carousel 3.webp';
import carousel5 from '../../../public/assets/carousel 1.webp';

// Pre-import icons instead of lazy loading for smoother UI
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Constants moved outside component to prevent recreation
const CAROUSEL_CONFIG = {
    ANIMATION_DURATION: 0.5,
    AUTO_SLIDE_INTERVAL: 5000,
    SWIPE_THRESHOLD: 50,
    INITIAL_SLIDE: 0,
    ASPECT_RATIO: 21 / 9,
};

// Memoized carousel images array
const carouselImages = [
    { 
        src: carousel1, 
        alt: 'Currency Exchange Services', 
        priority: true,
        onClick: () => handleImageClick("Currency Exchange Services")
    },
    { 
        src: carousel2, 
        alt: 'Money Exchange Rates', 
        onClick: () => handleImageClick("Money Exchange Rates") 
    },
    { 
        src: carousel3, 
        alt: 'Foreign Currency Exchange', 
        onClick: () => handleImageClick("Foreign Currency Exchange") 
    },
    { 
        src: carousel4, 
        alt: 'International Money Transfer', 
        onClick: () => handleImageClick("International Money Transfer") 
    },
    { 
        src: carousel5, 
        alt: 'The Best of The Best',
        onClick: () => handleImageClick("The Best of The Best") 
    }
];


// Optimized animation variants
const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.645, 0.045, 0.355, 1.000]
        }
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.645, 0.045, 0.355, 1.000]
        }
    },
    exit: (direction) => ({
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.645, 0.045, 0.355, 1.000]
        }
    })
};

// Optimized button animation variants
const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
};

// Memoized image component
const CarouselImage = React.memo(({ image, onLoad, onClick }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
        if (onLoad) onLoad();
    }, [onLoad]);

    // Memoized placeholder for consistent reference
    const placeholderSvg = useMemo(() =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E`,
        []
    );
    

    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <LazyLoadImage
                src={image.src}
                alt={image.alt}
                effect="blur"
                afterLoad={handleImageLoad}
                threshold={300}
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
                visibleByDefault={image.priority}
                placeholderSrc={placeholderSvg}
                
            />
        </div>
    );
});

const NavigationButton = React.memo(({ onClick, icon: Icon, label, isDark }) => (
    <motion.button
        onClick={onClick}
        className={`p-2 rounded-full ${isDark ? 'bg-gray-700/50' : 'bg-white/50'} hover:bg-opacity-70 will-change-transform`}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label={label}
    >
        <Icon className="w-6 h-6 text-white" />
    </motion.button>
));

const DotIndicator = React.memo(({ index, currentIndex, onClick }) => (
    <button
        onClick={onClick}
        className={`w-2 h-2 rounded-full transition-all ${
            index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/75'
        }`}
        aria-label={`Go to slide ${index + 1}`}
    />
));

const Carousel = React.memo(({ isDark }) => {
    const [state, setState] = useState({
        currentIndex: CAROUSEL_CONFIG.INITIAL_SLIDE,
        direction: 0
    });

    const autoPlayRef = useRef(null);
    const isHoveredRef = useRef(false);

    const handleNext = useCallback(() => {
        setState(prev => ({
            direction: 1,
            currentIndex: (prev.currentIndex + 1) % carouselImages.length
        }));
    }, []);

    const handlePrevious = useCallback(() => {
        setState(prev => ({
            direction: -1,
            currentIndex: prev.currentIndex === 0 ? carouselImages.length - 1 : prev.currentIndex - 1
        }));
    }, []);

    const handleDotClick = useCallback((index) => {
        setState(prev => ({
            direction: index > prev.currentIndex ? 1 : -1,
            currentIndex: index
        }));
    }, []);

    const handleImageClick = useCallback((serviceName) => {
        const phoneNumber = "+621234567890";  // Ganti dengan nomor WhatsApp yang sesuai
        const message = `Halo, saya tertarik dengan layanan ${serviceName}.`;  // Pesan berdasarkan nama layanan
    
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
        // Membuka WhatsApp di tab baru
        window.open(url, '_blank');
    }, []);

    // Optimized auto-play with RAF
    useEffect(() => {
        let rafId;
        let startTime;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            if (progress >= CAROUSEL_CONFIG.AUTO_SLIDE_INTERVAL && !isHoveredRef.current) {
                handleNext();
                startTime = timestamp;
            }

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [handleNext]);

    // Memoized aspect ratio style
    const aspectRatioStyle = useMemo(() => ({
        paddingBottom: `${(1 / CAROUSEL_CONFIG.ASPECT_RATIO) * 100}%`
    }), []);

    return (
        <div className="relative w-full mt-8 sm:mt-12">
            <div className="container mx-auto px-2 sm:px-4">
                <div
                    className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 w-full max-w-none"
                    style={{paddingBottom: `${(1 / CAROUSEL_CONFIG.ASPECT_RATIO) * 100}%`}}
                >
                    <div className="absolute inset-0" onClick={handleImageClick} >
                        <AnimatePresence initial={false} custom={state.direction} mode="wait">
                            <motion.div
                                key={state.currentIndex}
                                custom={state.direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="absolute inset-0"
                                
                            >
                                <CarouselImage
                                    image={carouselImages[state.currentIndex]}
                                    priority={state.currentIndex === 0}
                                    onClick={carouselImages[state.currentIndex].onClick}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls - Made bigger */}
                        <div
                            className="absolute inset-0 flex items-center justify-between px-2 sm:px-6 opacity-0 hover:opacity-100 transition-opacity"
                            onMouseEnter={() => {
                                isHoveredRef.current = true;
                            }}
                            onMouseLeave={() => {
                                isHoveredRef.current = false;
                            }}
                        >
                            <NavigationButton
                                onClick={(e) => e.stopPropagation(handlePrevious())}
                                icon={ChevronLeft}
                                label="Previous slide"
                                isDark={isDark}
                                className="w-10 h-10 sm:w-12 sm:h-12"
                            />
                            <NavigationButton
                                onClick={(e) => e.stopPropagation(handleNext())}
                                icon={ChevronRight}
                                label="Next slide"
                                isDark={isDark}
                                className="w-10 h-10 sm:w-12 sm:h-12"
                            />
                        </div>

                        {/* Dots Indicator - Made bigger and more spaced */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                            {carouselImages.map((_, index) => (
                                <DotIndicator
                                    key={index}
                                    index={index}
                                    currentIndex={state.currentIndex}
                                    onClick={(e) => e.stopPropagation(handleDotClick(index))}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

CarouselImage.displayName = 'CarouselImage';
NavigationButton.displayName = 'NavigationButton';
DotIndicator.displayName = 'DotIndicator';
Carousel.displayName = 'Carousel';

export default Carousel;