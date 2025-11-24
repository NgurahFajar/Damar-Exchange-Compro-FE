
/**
 * Constructs the full URL for an image based on its path
 * @param {string} path - The image path from the backend
 * @returns {string|null} The complete URL for the image
 */
export const getImageUrl = (path) => {
    if (!path) return null;

    // If path is already a full URL, return it
    if (path.startsWith('http')) return path;

    // Clean up path by removing any leading /storage/
    const cleanPath = path.replace(/^\/storage\//, '');

    // Use VITE_STORAGE_URL from environment variables
    const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

    // Ensure the path doesn't start with a slash if the URL ends with one
    const finalPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

    return `${storageUrl}/${finalPath}`;
};

/**
 * Preloads an image and returns a promise
 * @param {string} url - The image URL to preload
 * @returns {Promise} Resolves when image is loaded, rejects on error
 */
export const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
};

/**
 * Formats file size into human readable format
 * @param {number} bytes - The size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates image dimensions
 * @param {File} file - The image file to validate
 * @param {Object} options - Validation options
 * @returns {Promise<boolean>} Resolves to true if valid, false otherwise
 */
export const validateImageDimensions = (file, { maxWidth = 2000, maxHeight = 2000 } = {}) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve(img.width <= maxWidth && img.height <= maxHeight);
            };
            img.onerror = () => resolve(false);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Checks if a file is a valid image type
 * @param {File} file - The file to check
 * @returns {boolean} True if valid image type
 */
export const isValidImageType = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
};

/**
 * Creates a thumbnail URL for an image path
 * @param {string} path - Original image path
 * @param {number} size - Desired thumbnail size
 * @returns {string} Thumbnail URL
 */
export const getThumbnailUrl = (path, size = 150) => {
    const baseUrl = getImageUrl(path);
    if (!baseUrl) return null;

    // For now, return the original URL
    // In the future, you could implement thumbnail generation
    return baseUrl;
};

/**
 * Animation variants for image-related animations
 */
export const animations = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07, delayChildren: 0.02 }
        }
    },
    fadeInScale: {
        hidden: {
            opacity: 0,
            scale: 0.985,
            willChange: 'transform, opacity'
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.35,
                ease: 'easeOut'
            }
        }
    }
};

/**
 * Custom error class for image-related errors
 */
export class ImageError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR') {
        super(message);
        this.name = 'ImageError';
        this.code = code;
    }
}