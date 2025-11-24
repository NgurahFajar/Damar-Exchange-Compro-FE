import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import {getImageUrl} from "@utils/imageUtils.js";

const ImageCard = ({ image, onDelete }) => {
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

    const handleImageError = (e) => {
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

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg"
        >
            <div className="relative group h-48">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <div className="text-center p-4">
                            <p className="text-sm text-gray-400">Loading...</p>
                        </div>
                    </div>
                ) : !imageError ? (
                    imageUrl && (
                        <img
                            src={imageUrl}
                            alt={image.original_name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <div className="text-center p-4">
                            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Failed to load image</p>
                            <p className="text-xs text-gray-500 mt-1 break-all">
                                {image.path}
                            </p>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <button
                        onClick={() => onDelete(image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-red-500 rounded-full hover:bg-red-600"
                    >
                        <Trash2 className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <p className="text-sm text-gray-400 truncate" title={image.original_name}>
                    {image.original_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {new Date(image.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatSize(image.size)}
                </p>
            </div>
        </motion.div>
    );
};

ImageCard.propTypes = {
    image: PropTypes.shape({
        id: PropTypes.number.isRequired,
        path: PropTypes.string.isRequired,
        original_name: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ImageCard;