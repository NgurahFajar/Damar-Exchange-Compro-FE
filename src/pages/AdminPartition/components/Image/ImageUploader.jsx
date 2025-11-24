import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import PropTypes from 'prop-types';

// Use default parameter instead of defaultProps
const ImageUploader = ({ onUpload, loading = false }) => {
    const { isDark } = useTheme();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <label
                className={`
                    flex flex-col items-center justify-center w-full h-64 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/30'} 
                    transition-colors
                `}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className={`w-10 h-10 mb-3 text-gray-400 ${loading ? 'animate-pulse' : ''}`} />
                    <p className={`mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        PNG, JPG or GIF (MAX. 2MB)
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                />
            </label>
        </div>
    );
};

ImageUploader.propTypes = {
    onUpload: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default ImageUploader;