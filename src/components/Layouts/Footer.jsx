import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Phone, X } from 'lucide-react';
import EmailTemplate from './EmailTemplate';
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';

// Import footer images directly
import BI from '../../../public/assets/BI.webp';
import OJK from '../../../public/assets/OJK.webp';
import PVA from '../../../public/assets/PVA.webp';
import VAL from '../../../public/assets/valuta.webp';

const PreviewModal = ({ isOpen, onClose, data, isDark }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-lg shadow-2xl max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-4 max-h-[90vh] overflow-hidden border`}
                >
                    <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} flex justify-between items-center`}>
                        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Preview</h3>
                        <button
                            onClick={onClose}
                            className={`p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className={isDark ? 'text-white' : 'text-gray-900'}>
                            <EmailTemplate data={data} />
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const SocialLink = ({ icon: Icon, href, label, isDark }) => (
    <motion.a
        href={href}
        aria-label={label}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-3 rounded-full ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-colors`}
    >
        <Icon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
    </motion.a>
);

const Input = ({ type = "text", isDark, ...props }) => (
    <input
        type={type}
        {...props}
        className={`w-full p-3 rounded-lg ${
            isDark
                ? 'bg-gray-800/50 border-gray-700 placeholder-gray-500 text-white'
                : 'bg-white/50 border-gray-300 placeholder-gray-400 text-gray-900'
        } border focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors`}
    />
);

const Footer = ({ isDark }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', subject: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [showPreview, setShowPreview] = useState(false);

    const socialLinks = [
        { icon: Instagram, href: "https://www.instagram.com/damarexchange?igsh=MXhram42ZTBzaTA4Zg%3D%3D&utm_source=qr", label: "Instagram" },
        { icon: Phone, href: "tel:+6281338407237", label: "Phone" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const templateParams = {
            name: formData.name,
            subject: formData.subject,
            email: formData.email,
            message: formData.message,
            emailDamar: "damarexchange@gmail.com"
        };

        try {
            const response = await emailjs.send(
                'service_ydcfjae',
                'template_dfxk1tn',
                templateParams,
                '4NtDiL14bHwx4ZW3-'
            );

            setStatus({
                type: 'success',
                message: 'Message sent successfully!',
            });
            setFormData({ name: '', email: '', message: '', subject: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.text || 'Failed to send message. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className={`${isDark ? 'text-white' : 'text-gray-800'} py-12 font-poppins`}>
            <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                data={formData}
                isDark={isDark}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Contact Us Section */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold tracking-wide">
                                {t('footer.contact.title')}
                            </h3>
                            <div className="w-12 h-1 bg-red-500"></div>
                        </div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {t('footer.contact.address')}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((link, index) => (
                                <SocialLink key={index} {...link} isDark={isDark}/>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold tracking-wide after:content-[''] after:block after:w-12 after:h-1 after:bg-red-500 after:mt-2">
                            {t('footer.links.title')}
                        </h3>
                        <div className="flex items-center gap-8 whitespace-nowrap justify-center">
                            {[BI, OJK, PVA, VAL].map((logo, index) => (
                                <motion.img
                                    key={index}
                                    whileHover={{scale: 1.05}}
                                    src={logo}
                                    alt={logo.split('.')[0]}
                                    className="w-auto object-contain opacity-80 hover:opacity-100 transition-all
                                    h-8 md:h-10 lg:h-11 xl:h-12"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Send Message Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold tracking-wide after:content-[''] after:block after:w-12 after:h-1 after:bg-red-500 after:mt-2">
                            {t('footer.message.title')}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {status.message && (
                                <motion.div
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    className={`p-4 rounded-lg text-sm ${
                                        status.type === 'success'
                                            ? 'bg-green-500/20 text-green-200'
                                            : 'bg-red-500/20 text-red-200'
                                    }`}
                                >
                                    {t(`footer.message.status.${status.type}`)}
                                </motion.div>
                            )}

                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('footer.message.form.name')}
                                required
                                isDark={isDark}
                            />
                            <Input
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder={t('footer.message.form.subject')}
                                required
                                isDark={isDark}
                            />
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t('footer.message.form.email')}
                                required
                                isDark={isDark}
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t('footer.message.form.message')}
                                required
                                rows="4"
                                className={`w-full p-3 rounded-lg ${
                                    isDark
                                        ? 'bg-gray-800/50 border-gray-700 placeholder-gray-500 text-white'
                                        : 'bg-white/50 border-gray-300 placeholder-gray-400 text-gray-900'
                                } border focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors resize-none`}
                            />

                            <div className="flex gap-3">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    className={`flex-1 bg-red-600 hover:bg-red-500 text-white py-3 px-6 rounded-lg transition-colors font-bold ${
                                        loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? t('footer.message.form.sending') : t('footer.message.form.send')}
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPreview(true)}
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    className={`px-6 py-3 ${
                                        isDark
                                            ? 'bg-gray-800/50 hover:bg-gray-700/50'
                                            : 'bg-gray-100/50 hover:bg-gray-200/50'
                                    } rounded-lg font-bold transition-colors`}
                                >
                                    {t('footer.message.form.preview')}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} text-center`}>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {t('footer.copyright', {year: new Date().getFullYear()})}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
