import React, { useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, RefreshCcw, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import MainLoading from "@/components/Loaders/MainLoading";
import ImageUploader from './components/Image/ImageUploader.jsx';
import ImageCard from './components/Image/ImageCard.jsx';
import useImageManagement from '../../hooks/Image/useImageManagement.js';

// Memoized EmptyState component
const EmptyState = memo(({ cardClass, textClass }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${cardClass} p-8 rounded-lg text-center`}
    >
        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textClass} mb-2`}>
            No images uploaded
        </h3>
        <p className="text-gray-400">
            Upload your first image to get started
        </p>
    </motion.div>
));

// Memoized Header component with retry functionality
const Header = memo(({ textClass, loading, fetchImages }) => (
    <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${textClass}`}>
            Image Management
        </h1>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                console.log('Manually refreshing images...');
                fetchImages();
            }}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
        </motion.button>
    </div>
));

// Memoized UploadSection component
const UploadSection = memo(({ cardClass, textClass, handleUpload, uploading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardClass} p-6 rounded-lg shadow-lg`}
    >
        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
            Upload New Image
        </h2>
        <ImageUploader onUpload={handleUpload} loading={uploading} />
    </motion.div>
));

// Memoized ImageGrid component with error boundary
const ImageGrid = memo(({ images, handleDelete }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
        {images.map((image) => (
            <ImageCard
                key={image.id}
                image={image}
                onDelete={handleDelete}
            />
        ))}
    </motion.div>
));

// Memoized LoadingOverlay component
const LoadingOverlay = memo(({ isDark, uploading }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
        <MainLoading
            isDark={isDark}
            message={uploading ? "Uploading image..." : "Loading..."}
            size={40}
        />
    </motion.div>
));

// Memoized ErrorMessage component with auto-dismiss
const ErrorMessage = memo(({ error }) => (
    <AnimatePresence mode="wait">
        {error && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
            >
                <AlertCircle size={20} />
                <span className="mr-2">{error}</span>
                <button
                    onClick={() => setError(null)}
                    className="ml-2 hover:text-gray-200 transition-colors"
                >
                    <AlertCircle size={16} />
                </button>
            </motion.div>
        )}
    </AnimatePresence>
));

const ImageManagement = () => {
    const {
        images,
        loading,
        uploading,
        error,
        initialRender,
        fetchImages,
        handleUpload,
        handleDelete
    } = useImageManagement();

    const { isDark, cardClass, textClass } = useTheme();

    // Initial fetch with error handling
    useEffect(() => {
        const loadImages = async () => {
            try {
                await fetchImages();
            } catch (err) {
                console.error('Failed to load images:', err);
            }
        };

        loadImages();
    }, [fetchImages]);

    // Show loading state on initial render
    if (loading && initialRender.current) {
        initialRender.current = false;
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <MainLoading isDark={isDark} message="Loading images..." size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <Header
                textClass={textClass}
                loading={loading}
                fetchImages={fetchImages}
            />

            <UploadSection
                cardClass={cardClass}
                textClass={textClass}
                handleUpload={handleUpload}
                uploading={uploading}
            />

            {/* Conditional rendering with AnimatePresence for smooth transitions */}
            <AnimatePresence mode="wait">
                {images.length > 0 ? (
                    <ImageGrid
                        images={images}
                        handleDelete={handleDelete}
                    />
                ) : (
                    !loading && (
                        <EmptyState
                            cardClass={cardClass}
                            textClass={textClass}
                        />
                    )
                )}
            </AnimatePresence>

            {/* Loading overlay with AnimatePresence */}
            <AnimatePresence>
                {(loading || uploading) && !initialRender.current && (
                    <LoadingOverlay
                        isDark={isDark}
                        uploading={uploading}
                    />
                )}
            </AnimatePresence>

            <ErrorMessage error={error} />
        </div>
    );
};

export default ImageManagement;