import React, { memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Star, MessageSquare} from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import profile1 from '../../../public/assets/avatars/profile (1).webp';
import profile2 from '../../../public/assets/avatars/profile (2).webp';
import profile3 from '../../../public/assets/avatars/profile (3).webp';
import profile4 from '../../../public/assets/avatars/profile (4).webp';
import profile5 from '../../../public/assets/avatars/profile (5).webp';
import { useTranslation } from 'react-i18next';

// Extracted animations object outside component to prevent recreation
const animations = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.02,
                ease: [0.23, 1, 0.32, 1]
            }
        }
    },
    fadeInScale: {
        hidden: {
            opacity: 0,
            transform: 'scale(0.985)',
            willChange: 'transform'
        },
        visible: {
            opacity: 1,
            transform: 'scale(1)',
            transition: {
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
                opacity: { duration: 0.35 }
            }
        }
    },
    review: {
        hidden: {
            opacity: 0,
            transform: 'translateY(10px)',
            willChange: 'transform'
        },
        visible: {
            opacity: 1,
            transform: 'translateY(0)',
            transition: {
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1]
            }
        }
    }
};

const reviewsData = [
    {
        id: 1,
        translationKey: 'review_irina',
        rating: 5,
        photoUrl: profile2,
    },
    {
        id: 2,
        translationKey: 'review_carlo',
        rating: 5,
        photoUrl: profile5,
    },
    {
        id: 3,
        translationKey: 'review_diva',
        rating: 5,
        photoUrl: profile3,
    },
    {
        id: 4,
        translationKey: 'review_arpan',
        rating: 5,
        photoUrl: profile4,
    },
    {
        id: 5,
        translationKey: 'review_reksa',
        rating: 5,
        photoUrl: profile1,
    }
];

const StarRating = memo(({ rating, size = 16 }) => {
    const stars = useMemo(() =>
            [...Array(rating)].map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className="text-yellow-400 fill-current"
                />
            )),
        [rating, size]
    );

    return <div className="flex">{stars}</div>;
});

const ReviewCard = memo(({ review, isDark }) => {
    const { t } = useTranslation();

    const imageProps = useMemo(() => ({
        src: review.photoUrl,
        alt: `${t(`${review.translationKey}.author`)}'s profile`,
        className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover",
        effect: "opacity",
        threshold: 100,
        loading: "lazy",
        placeholderSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
    }), [review.photoUrl, review.translationKey, t]);

    return (
        <motion.div
            variants={animations.review}
            className={`p-4 sm:p-6 rounded-xl ${isDark ? 'border-gray-700/20' : 'border-gray-200/20'} border 
                backdrop-blur-sm bg-gradient-to-br from-transparent to-orange-700/5`}
        >
            <div className="flex items-start gap-4">
                <LazyLoadImage {...imageProps} />
                <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className={`font-semibold text-base sm:text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            {t(`${review.translationKey}.author`)}
                        </h3>
                        <StarRating rating={review.rating} />
                    </div>
                    <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}>
                        {t(`${review.translationKey}.text`)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
});

const TitleSection = memo(({ title, icon: Icon, isDark }) => (
    <div className="flex items-center gap-4 mb-6">
        <motion.div
            className="h-10 w-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400
                flex items-center justify-center shadow-lg transform -rotate-3"
            whileHover={{ rotate: 0, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <Icon className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
        </h2>
    </div>
));

const Header = memo(({ isDark }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-start gap-2">
            <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <TitleSection
                        title={t('customer_reviews')}
                        icon={MessageSquare}
                        isDark={isDark}
                    />
                    <div className="flex items-center gap-2">
                        <StarRating rating={5} size={24} />
                        <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>5.0</span>
                    </div>
                </div>
                <motion.p
                    className={`text-base md:text-md ${isDark ? 'text-gray-300' : 'text-gray-700'} 
                        border-l-4 border-orange-500 pl-3`}
                    variants={animations.fadeInScale}
                >
                    {t('customer_reviews_subtitle')}
                </motion.p>
            </div>
        </div>
    );
});

const GoogleReviews = ({ isDark = false }) => {
    const { t } = useTranslation();

    const renderReviews = useCallback(() => (
        <AnimatePresence mode="wait">
            {reviewsData.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    isDark={isDark}
                />
            ))}
        </AnimatePresence>
    ), [isDark]);

    return (
        <motion.div
            variants={animations.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
            <motion.div
                variants={animations.fadeInScale}
                className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl relative overflow-hidden backdrop-blur-lg font-poppins"
            >
                {/* Decorative Background - matching About component */}
                <div className="absolute -right-40 top-0 w-40 h-40 rounded-full bg-orange-600/5 blur-3xl"/>
                <div className="absolute -left-40 bottom-0 w-40 h-40 rounded-full bg-purple-600/5 blur-3xl"/>

                <div className="relative space-y-4 sm:space-y-6">
                    <Header isDark={isDark} />

                    <motion.div
                        variants={animations.fadeInScale}
                        className="space-y-4"
                    >
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar space-y-4 p-2">
                            {renderReviews()}
                        </div>

                        <div className="mt-4 text-center pt-4 border-t border-gray-200/20">
                            <a
                                href="https://maps.app.goo.gl/b5JFGgNsiRP2TZUC7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm sm:text-base ${isDark ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'} 
                                    transition-colors`}
                            >
                                {t('view_all_reviews')}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

StarRating.displayName = 'StarRating';
ReviewCard.displayName = 'ReviewCard';
Header.displayName = 'Header';
GoogleReviews.displayName = 'GoogleReviews';

export default memo(GoogleReviews);