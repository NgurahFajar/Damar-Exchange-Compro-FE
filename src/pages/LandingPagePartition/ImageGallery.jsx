import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';
import { api } from '@/utils/axiosInstance';
import {useTranslation} from "react-i18next";

const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 }
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.2 }
    }
};

const LoadingSkeleton = memo(() => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-200/80">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            </div>
        ))}
    </div>
));

const GalleryImage = memo(({ image, onImageClick }) => {
    const [imageError, setImageError] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setImageError(false);

        const processedUrl = getImageUrl(image.path);
        console.log('Image Debug Info:', {
            originalPath: image.path,
            processedUrl,
            storageUrl: import.meta.env.VITE_STORAGE_URL,
        });

        setImageUrl(processedUrl);
        setIsLoading(false);
    }, [image]);

    const handleImageError = () => {
        console.error('Image failed to load:', {
            url: imageUrl,
            image: {
                id: image.id,
                path: image.path,
                originalName: image.original_name
            }
        });
        setImageError(true);
    };

    return (
        <motion.div
            className="overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
            whileHover={{ scale: 1.01 }}
            onClick={() => !imageError && onImageClick({ ...image, url: imageUrl })}
        >
            <div className="relative rounded-2xl">
                {isLoading ? (
                    <div className="w-full h-full aspect-square flex items-center justify-center bg-gray-700 rounded-2xl">
                        <div className="text-center p-4">
                            <p className="text-sm text-gray-400">Loading...</p>
                        </div>
                    </div>
                ) : !imageError ? (
                    imageUrl && (
                        <>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-purple-500/30 to-blue-500/30
                                opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300 rounded-2xl"
                            />
                            <img
                                src={imageUrl}
                                alt={image.original_name || 'Gallery image'}
                                className="w-full h-full aspect-square object-cover rounded-2xl"
                                onError={handleImageError}
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
                        </>
                    )
                ) : (
                    <div className="w-full h-full aspect-square flex items-center justify-center bg-gray-700 rounded-2xl">
                        <div className="text-center p-4">
                            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Failed to load image</p>
                            <p className="text-xs text-gray-500 mt-1 break-all">
                                {image.path}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
});

const Modal = memo(({ image, onClose }) => {
    if (!image) return null;

    return (
        <motion.div
            {...animations.fadeIn}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                {...animations.scaleIn}
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
                        src={image.url}
                        alt={image.original_name || 'Enlarged view'}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
});

const ImageGallery = ({ isDark }) => {
    const { t } = useTranslation();
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/images');

                if (!response?.data) {
                    throw new Error('No data received');
                }

                setImages(response.data);
            } catch (err) {
                setError(err.message || 'Failed to load images');
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleImageClick = useCallback((image) => {
        setSelectedImage(image);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedImage(null);
    }, []);

    const containerClasses = useMemo(() => ({
        wrapper: "w-full px-4 md:px-8",
        header: "relative p-6 rounded-xl bg-gradient-to-tr from-orange-600/10 via-purple-600/10 to-blue-600/10 mb-8",
        headerContent: "flex items-center gap-4",
        iconContainer: `w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center 
            justify-center shadow-lg transform -rotate-3`,
        title: `text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`,
        gallery: "rounded-xl"
    }), [isDark]);

    if (error) {
        return (
            <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={containerClasses.wrapper}>
            <div className="max-w-7xl mx-auto">
                <div className={containerClasses.header}>
                    <div className={containerClasses.headerContent}>
                        <div className={containerClasses.iconContainer}>
                            <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className={containerClasses.title}> {t('office_gallery')}</h2>
                    </div>
                </div>

                <div className={containerClasses.gallery}>
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {images.map((image) => (
                                <GalleryImage
                                    key={image.id}
                                    image={image}
                                    onImageClick={handleImageClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <Modal
                        image={selectedImage}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

GalleryImage.displayName = 'GalleryImage';
Modal.displayName = 'Modal';
LoadingSkeleton.displayName = 'LoadingSkeleton';
ImageGallery.displayName = 'ImageGallery';

export default memo(ImageGallery);