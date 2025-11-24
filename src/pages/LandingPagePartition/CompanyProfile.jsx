import React, {useMemo, memo, Suspense} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Target, Award, Lightbulb, TrendingUp } from 'lucide-react';
import comingSoonImage from '../../../public/assets/comingson.webp';
import Credibility from "@/pages/LandingPagePartition/Credibility.jsx";
import MainLoading from "@components/Loaders/MainLoading.jsx";


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
    fadeIn: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    },
    slideUp: {
        initial: { y: 20, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    },
    slideLeft: {
        initial: { x: -20, opacity: 0 },
        animate: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    },
    scale: {
        initial: { scale: 0.95, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    }
};

// Memoized style utilities
const useStyles = (isDark) => useMemo(() => ({
    textClass: isDark ? 'text-white' : 'text-gray-900',
    cardBg: isDark ? 'bg-gray-700/50' : 'bg-white/50'
}), [isDark]);

const ValueCard = memo(({ title, description, icon: Icon, isDark, delay = 0 }) => {
    const styles = useStyles(isDark);

    return (
        <motion.div
            variants={animations.slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay }}
            className={`${styles.cardBg} p-6 rounded-xl shadow-lg backdrop-blur-sm will-change-transform`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-orange-600/90 shadow-lg">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className={`text-xl font-bold  ${styles.textClass} mb-3`}>{title}</h3>
                    <p className={`${styles.textClass} opacity-90 leading-relaxed text-sm md:text-lg  font-light`}>{description}</p>
                </div>
            </div>
        </motion.div>
    );
});

const Section = memo(({ className, children, variants = animations.slideUp }) => (
    <motion.div
        variants={variants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        className={className}
    >
        {children}
    </motion.div>
));

const CompanyProfile = memo(({ isDark }) => {
    const { t } = useTranslation();
    const styles = useStyles(isDark);

    const valueIcons = useMemo(() => ({
        'Satisfaction': Star,
        'Meaningful': Target,
        'Impressive': Award,
        'Leading': TrendingUp,
        'Excellence': Lightbulb
    }), []);

    const values = useMemo(() => [
        { title: 'Satisfaction', desc: t("satifaction") },
        { title: 'Meaningful', desc: t("Meaningful") },
        { title: 'Impressive', desc: t("Impressive") },
        { title: 'Leading', desc: t("Leading") },
        { title: 'Excellence', desc: t("Excellence") }
    ], [t]);

    return (
        <section id="profile" className="min-h-screen px-4 sm:px-6 lg:px-8 font-poppins">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Video Profile */}
                <Section className={`rounded-2xl`}>
                    <motion.h2
                        variants={animations.fadeIn}
                        className={`text-3xl sm:text-4xl font-bold  ${styles.textClass} mb-8 text-center`}
                    >
                        Video Profile
                    </motion.h2>
                    <motion.div
                        className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl will-change-transform"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="relative w-full"
                            style={{
                                paddingBottom: '56.25%', // Maintain aspect ratio of 16:9
                            }}
                        >
                            <img
                                className="absolute top-0 left-0 w-full h-full rounded-2xl object-contain md:object-cover"
                                src={comingSoonImage}
                                alt="Coming Soon"
                            />
                        </div>
                    </motion.div>
                </Section>

                <Suspense fallback={<ComponentLoader isDark={isDark}/>}>
                    <section id="credibility" className="container py-14 md:py-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 rounded-2xl">
                        <Credibility isDark={isDark}/>
                    </section>
                </Suspense>

                {/* About Section */}
                <Section className={`rounded-2xl p-8 shadow-xl`}>
                    <motion.h2
                        variants={animations.slideLeft}
                        className={`text-2xl sm:text-3xl font-bold  ${styles.textClass} mb-6`}
                    >
                        <span className={styles.textClass}>
                            {t('about')} {' '}
                            <span>Damar</span> {' '}
                            <span className="text-[#DC5233]">Exchange</span>
                        </span>
                    </motion.h2>
                    <motion.div
                        variants={animations.fadeIn}
                        className={`${styles.textClass} space-y-6 text-sm md:text-lg  font-light leading-relaxed text-justify`}
                    >
                        <p>{t('about_description1')}</p>
                        <p>{t('about_description2')}</p>
                    </motion.div>
                </Section>

                {/* Work Culture Section */}
                <Section className={`rounded-2xl p-8 shadow-xl`}>
                    <motion.h2
                        variants={animations.slideLeft}
                        className={`text-2xl sm:text-3xl font-bold  ${styles.textClass} mb-8`}
                    >
                        {t("work_culture")}
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {values.map((value, index) => (
                                <ValueCard
                                    key={value.title}
                                    title={value.title}
                                    description={value.desc}
                                    icon={valueIcons[value.title]}
                                    isDark={isDark}
                                    delay={index * 0.1}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </Section>

                {/* Vision Section */}
                <Section className={`rounded-2xl p-8 shadow-xl`}>
                    <motion.div
                        variants={animations.slideUp}
                        className="space-y-6"
                    >
                        <h2 className={`text-2xl sm:text-3xl font-bold  ${styles.textClass} mb-6`}>
                            {t("vision_commitment")}
                        </h2>
                        <p className={`${styles.textClass} text-sm md:text-base leading-relaxed text-justify  font-light`}>
                            {t("description_vision_commitment")}
                        </p>
                    </motion.div>
                </Section>
            </div>
        </section>
    );
});

// Add display names for debugging
ValueCard.displayName = 'ValueCard';
Section.displayName = 'Section';
CompanyProfile.displayName = 'CompanyProfile';

export default CompanyProfile;