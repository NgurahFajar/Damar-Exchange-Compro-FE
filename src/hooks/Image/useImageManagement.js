import { useState, useCallback, useRef } from 'react';
import { api } from '@/utils/axiosInstance';
import Swal from 'sweetalert2';
import { alertConfigs } from '@/config/alertConfigs';

const useImageManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const initialRender = useRef(true);

    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get('/images');

            if (response?.data) {
                const processedImages = Array.isArray(response.data) ? response.data : [];

                setImages(processedImages);
                setError(null);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (err) {

            setError(err.message || 'Failed to load images');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpload = async (file) => {
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                ...alertConfigs.error,
                title: 'Error',
                text: 'File size should be less than 2MB'
            });
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const response = await api.post('/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 'success') {
                Swal.fire({
                    ...alertConfigs.success,
                    title: 'Success',
                    text: 'Image uploaded successfully'
                });
                await fetchImages();
            }
        } catch (err) {

            Swal.fire({
                ...alertConfigs.error,
                title: 'Error',
                text: 'Failed to upload image'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId) => {
        const result = await Swal.fire({
            title: 'Delete Image',
            text: 'Are you sure you want to delete this image?',
            icon: 'warning',
            ...alertConfigs.confirm
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const response = await api.delete(`/images/${imageId}`);
                if (response.status === 'success') {
                    Swal.fire({
                        ...alertConfigs.success,
                        title: 'Success',
                        text: 'Image deleted successfully'
                    });
                    await fetchImages();
                }
            } catch (err) {
                Swal.fire({
                    ...alertConfigs.error,
                    title: 'Error',
                    text: 'Failed to delete image'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return {
        images,
        loading,
        uploading,
        error,
        initialRender,
        fetchImages,
        handleUpload,
        handleDelete
    };
};

export default useImageManagement;
