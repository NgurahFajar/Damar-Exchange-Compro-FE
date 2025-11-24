import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, CheckIcon, ShieldCheckIcon, ClockIcon, ArrowUpDown, BadgeCheck, Banknote } from 'lucide-react';

// Animation variants for better performance
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
    fadeInSlide: {
        hidden: {
            opacity: 0,
            transform: 'translateX(-10px)',
            willChange: 'transform'
        },
        visible: {
            opacity: 1,
            transform: 'translateX(0px)',
            transition: {
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
                opacity: { duration: 0.35 }
            }
        }
    }
};

// Memoized Feature Item Component
const FeatureItem = memo(({ icon: Icon, text, isDark, delay }) => (
    <motion.div
        className="flex items-center gap-4 transition-transform duration-200 hover:translate-x-2"
        variants={animations.fadeInSlide}
        custom={delay}
    >
        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-orange-600/90 flex items-center justify-center shadow-lg">
            <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </div>
        <p className={`text-sm md:text-lg font-light  ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {text}
        </p>
    </motion.div>
));

const About = memo(({ isDark }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            variants={animations.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-poppins"
        >
            {/* Welcome Card */}
            <motion.div
                variants={animations.fadeInScale}
                className={`rounded-2xl p-4 lg:p-12 shadow-xl relative overflow-hidden backdrop-blur-lg `}
            >
                {/* Decorative Background Elements */}
                <div className="absolute -right-40 top-0 w-40 h-40 rounded-full bg-orange-600/5 blur-3xl"/>
                <div className="absolute -left-40 bottom-0 w-40 h-40 rounded-full bg-purple-600/5 blur-3xl"/>

                <div className="relative space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold  ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <span className="block leading-tight">
                                    {t('welcome_message')}
                                </span>
                                <div className="relative">
                                    <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent  inline-block leading-tight">
                                        Damar Exchange
                                    </span>
                                </div>
                            </h1>
                        </div>
                    </div>

                    {/* Tagline */}
                    <motion.p
                        className={`text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} border-l-4 border-orange-500 pl-4 font-semibold `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {t('tag_line')}
                    </motion.p>

                    {/* Feature List */}
                    <motion.div className="space-y-5 md:space-y-8 relative" variants={animations.container}>
                        {/* Decorative line */}
                        <div className="absolute left-3 md:left-5 top-4 bottom-8 w-0.5 bg-gradient-to-b from-orange-500 to-transparent opacity-20"/>

                        <FeatureItem icon={Send} text={t('tag_line_deliver')} isDark={isDark} delay={0.1} />
                        <FeatureItem icon={CheckIcon} text={t('tag_line2')} isDark={isDark} delay={0.2} />
                        <FeatureItem icon={ShieldCheckIcon} text={t('tag_line3')} isDark={isDark} delay={0.3} />
                        <FeatureItem icon={ClockIcon} text={t('tag_line4')} isDark={isDark} delay={0.4} />
                        <FeatureItem icon={ArrowUpDown} text={t('tag_line5')} isDark={isDark} delay={0.5} />
                        <FeatureItem icon={BadgeCheck} text={t('customer_satisfaction')} isDark={isDark} delay={0.7} />
                        <FeatureItem icon={Banknote} text={t('competitive_rates')} isDark={isDark} delay={0.8} />
                    </motion.div>
                </div>
                <div className={`mt-12 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} text-center text-sm`}>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {t('footer.copyright', {year: new Date().getFullYear()})}
                    </p>
                </div>
            </motion.div>

            {/* About Messages Card */}
            <motion.div
                variants={animations.fadeInScale}
                className={`rounded-2xl p-6 lg:p-8 shadow-xl relative overflow-hidden`}
            >
                <div className="space-y-2 relative">
                    {/* About Section */}
                    <motion.div
                        variants={animations.fadeInScale}
                        className="p-6 rounded-xl bg-gradient-to-br from-transparent to-orange-700/5"
                    >
                        <h3 className={`text-xl md:text-2xl font-semibold  mb-4 flex items-center gap-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            <span className="w-8 h-1 bg-orange-500 rounded-full"/>
                            {t('about')}
                        </h3>
                        <p className={`text-sm font-light  lg:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('about_message')}
                        </p>
                    </motion.div>

                    {/* Trust Section */}
                    <motion.div
                        variants={animations.fadeInScale}
                        className="p-6 rounded-xl bg-gradient-to-br from-transparent to-orange-700/5"
                    >
                        <h3 className={`text-xl md:text-2xl font-semibold  mb-4 flex items-center gap-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            <span className="w-8 h-1 bg-orange-500 rounded-full"/>
                            {t('trusted_and_licensed')}
                        </h3>
                        <p className={`text-sm font-light  lg:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('security_message')}
                        </p>
                    </motion.div>

                    {/* Service Section */}
                    <motion.div
                        variants={animations.fadeInScale}
                        className="p-6 rounded-xl bg-gradient-to-br from-transparent to-orange-700/5"
                    >
                        <h3 className={`text-xl md:text-2xl font-semibold  mb-4 flex items-center gap-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            <span className="w-8 h-1 bg-orange-500 rounded-full"/>
                            {t('fast_and_professional')}
                        </h3>
                        <p className={`text-sm font-light  lg:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('reputation_message')}
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
});

FeatureItem.displayName = 'FeatureItem';
About.displayName = 'About';

export default About;