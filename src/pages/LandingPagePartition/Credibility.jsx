import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Award, ZoomIn, X, CheckCircle2, Shield, Building2 } from 'lucide-react';
import cert1 from '../../../public/assets/certificates/sertifikat.webp';
import cert2 from '../../../public/assets/certificates/sertifikat2.webp';


const certificates = [
    {
        image: cert1,
        alt: "Excellence in Service Certificate",
        containerStyle: "h-full w-full object-scale-down"
    },
    {
        image: cert2,
        alt: "Quality Assurance Certificate",
        containerStyle: "w-full h-full object-cover"
    }
];

const features = [
    {
        icon: Shield,
        text: "licensed_by_bank_indonesia"
    },
    {
        icon: Building2,
        text: "established_since_2024"
    },
    {
        icon: CheckCircle2,
        text: "certified_money_changer"
    }
];

const CertificateImage = memo(({ image, alt, containerStyle, onClick }) => (
    <motion.div
        className="overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
        whileHover={{ scale: 1.01 }}
        onClick={onClick}
    >
        <div className="relative rounded-2xl">
            <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-purple-500/30
                    to-blue-500/30 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300 rounded-2xl"
            />
            <img
                src={image}
                alt={alt}
                className={`${containerStyle} rounded-2xl`}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0
                group-hover:opacity-100 transition-opacity duration-300 z-20">
                <motion.div
                    className="bg-orange-600/90 p-4 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                >
                    <ZoomIn className="w-6 h-6 text-white" />
                </motion.div>
            </div>
        </div>
    </motion.div>
));

const CredibilitySection = memo(({ isDark }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col justify-center h-full p-2 md:p-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-orange-800 to-orange-500
                    flex items-center justify-center shadow-lg transform -rotate-3">
                    <Award className="w-7 h-7 text-white" />
                </div>
                <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('credibility.section_title')}
                </h2>
            </div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base mb-8`}>
                {t('credibility.intro')}
            </p>
            <div className="space-y-6">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 text-base md:text-lg">
                        <feature.icon className="w-6 h-6 text-orange-500" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} `}>
                            {t(`credibility.features.${feature.text}`)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
});

const CredibilityInfo = memo(({ isDark }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col justify-center h-full p-6 md:p-8">
            <h3 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                {t('credibility.partner_title')}
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg space-y-4`}>
                {t('credibility.partner_description')}
            </p>
        </div>
    );
});

const Modal = memo(({ certificate, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
        >
            <motion.button
                className="absolute top-4 right-4 p-3 bg-orange-700 text-white rounded-full z-10"
                whileHover={{ scale: 1.1 }}
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </motion.button>
            <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
                <img
                    src={certificate.image}
                    alt={certificate.alt}
                    className="max-w-full max-h-full object-contain"
                />
            </div>
        </motion.div>
    </motion.div>
));

const Credibility = memo(({ isDark }) => {
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    return (
        <div className="px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="md:order-1 order-2">
                        <CertificateImage
                            image={certificates[0].image}
                            alt={certificates[0].alt}
                            containerStyle={certificates[0].containerStyle}
                            onClick={() => setSelectedCertificate(certificates[0])}
                        />
                    </div>
                    <div className="md:order-2 order-1">
                        <CredibilitySection isDark={isDark} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CredibilityInfo isDark={isDark} />
                    <CertificateImage
                        image={certificates[1].image}
                        alt={certificates[1].alt}
                        containerStyle={certificates[1].containerStyle}
                        onClick={() => setSelectedCertificate(certificates[1])}
                    />
                </div>
            </div>

            <AnimatePresence>
                {selectedCertificate && (
                    <Modal
                        certificate={selectedCertificate}
                        onClose={() => setSelectedCertificate(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
});

export default Credibility;