// src/utils/axiosInstance.js
import axios from 'axios';

const DEFAULT_TIMEOUT = 30000;

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Only append /api/v1 if the URL is not already fully qualified
        if (!config.url.startsWith('http')) {
            if (!config.url.includes('/v1/') && !config.url.includes('/api/')) {
                config.url = `/api/v1${config.url.startsWith('/') ? config.url : `/${config.url}`}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const backendError = {
                status: error.response.data.status || 'error',
                message: error.response.data.message,
                details: error.response.data.details || null
            };

            switch (error.response.status) {
                case 401:
                    // Handle unauthorized access
                    if (!error.config.url.includes('auth/login')) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/admin/login';
                    }
                    return Promise.reject(backendError);

                case 403:
                    // Handle forbidden access (non-admin trying to access admin routes)
                    return Promise.reject({
                        ...backendError,
                        message: backendError.message || 'Insufficient privileges'
                    });

                case 422:
                    // Handle validation errors
                    return Promise.reject({
                        ...backendError,
                        errors: error.response.data.details || {}
                    });

                case 429:
                    // Handle rate limiting
                    return Promise.reject({
                        ...backendError,
                        message: backendError.message || 'Too many attempts, please try again later'
                    });

                default:
                    return Promise.reject(backendError);
            }
        }

        if (error.message === 'Network Error') {
            return Promise.reject({
                status: 'error',
                message: 'Network connection error. Please check your internet connection.'
            });
        }

        return Promise.reject({
            status: 'error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
);

// API methods that return the direct response data
export const api = {
    get: async (url, config = {}) => {
        const response = await axiosInstance.get(url, config);
        return response.data;
    },

    post: async (url, data = {}, config = {}) => {
        try {
            const response = await axiosInstance.post(url, data, config);
            return response.data;
        } catch (error) {
            console.error('API Error:', {
                url,
                error: error.response?.data || error
            });
            throw error;
        }
    },

    put: async (url, data = {}, config = {}) => {
        const response = await axiosInstance.put(url, data, config);
        return response.data;
    },

    delete: async (url, config = {}) => {
        const response = await axiosInstance.delete(url, config);
        return response.data;
    }
};

export default axiosInstance;