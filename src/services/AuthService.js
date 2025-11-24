// src/services/AuthService.js
import { api } from '../utils/axiosInstance.js';

const AUTH_ENDPOINTS = {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    USER: 'auth/user',
    REFRESH: 'auth/refresh'
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

class AuthService {
    constructor() {
        this.refreshTimeout = null;
    }

    async login(credentials) {
        try {
            this.clearSession();

            const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
                user: credentials.user.toLowerCase().trim(),
                password: credentials.password,
                remember_me: credentials.remember_me
            });

            if (response.status === 'success' && response.data?.user) {
                const { data } = response;
                this.setSession({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    user: data.user
                });

                if (data.expires_in) {
                    this.setupRefreshTimer(data.expires_in);
                }

                return {
                    success: true,
                    user: data.user
                };
            }

            // Check for rate limiting
            if (response.status === 'error' && response.code === 429) {
                const minutes = response.params?.minutes || 5;
                const remaining = response.params?.rate_limit_info?.remaining || 0;

                return {
                    success: false,
                    error: `Too many login attempts. Please try again in ${minutes} minutes.`,
                    rateLimitInfo: {
                        minutes,
                        remaining,
                        isRateLimited: true
                    }
                };
            }

            // Handle invalid credentials with remaining attempts
            if (response.status === 'error' && response.code === 401) {
                const remaining = response.params?.remaining_attempts || 0;
                return {
                    success: false,
                    error: `Invalid credentials. ${remaining} attempts remaining.`,
                    rateLimitInfo: {
                        remaining,
                        isRateLimited: false
                    }
                };
            }

            return {
                success: false,
                error: response.message || 'Invalid response format'
            };

        } catch (error) {
            console.error('Login error:', error);

            // Check if it's a rate limit error from axios
            if (error.response?.status === 429) {
                const minutes = error.response.data?.params?.minutes || 5;
                return {
                    success: false,
                    error: `Too many login attempts. Please try again in ${minutes} minutes.`,
                    rateLimitInfo: {
                        minutes,
                        isRateLimited: true
                    }
                };
            }

            return {
                success: false,
                error: error.message || 'Authentication failed'
            };
        }
    }


    setupRefreshTimer(expiresIn) {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        const refreshTime = (expiresIn * 1000) - 60000; // Refresh 1 minute before expiry
        this.refreshTimeout = setTimeout(() => this.refreshToken(), refreshTime);
    }

    async refreshToken() {
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            if (!refresh_token) {
                throw new Error('No refresh token available');
            }

            const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
                refresh_token
            });

            if (response.status === 'success') {
                const { data } = response;
                this.setSession({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    user: data.user
                });

                if (data.expires_in) {
                    this.setupRefreshTimer(data.expires_in);
                }

                return true;
            }
            return false;
        } catch (error) {
            this.clearSession();
            return false;
        }
    }

    async getCurrentUser() {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('No valid token found');
            }

            const response = await api.get(AUTH_ENDPOINTS.USER);
            if (response.status === 'success' && response.data?.user) {
                const user = response.data.user;

                // Verify role matches the last route
                const lastRoute = this.getLastRoute();
                const isAdminRoute = lastRoute?.startsWith('/admin');
                if (isAdminRoute && user.role !== 'admin') {
                    throw new Error('Role mismatch');
                }

                localStorage.setItem('user', JSON.stringify(user));
                return user;
            }
            throw new Error(response.message || 'Failed to get user data');
        } catch (error) {
            this.clearSession();
            throw error;
        }
    }

    async logout() {
        try {
            if (this.isAuthenticated()) {
                await api.post(AUTH_ENDPOINTS.LOGOUT);
            }
        } finally {
            this.clearSession();
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        const lastActivity = parseInt(localStorage.getItem('last_activity_time'));
        const currentTime = new Date().getTime();

        if (!token) return false;
        if (lastActivity && (currentTime - lastActivity) > SESSION_TIMEOUT) {
            this.clearSession();
            return false;
        }

        return true;
    }

    setSession(authData) {
        if (authData.access_token) {
            localStorage.setItem('token', authData.access_token);
        }
        if (authData.refresh_token) {
            localStorage.setItem('refresh_token', authData.refresh_token);
        }
        if (authData.user) {
            localStorage.setItem('user', JSON.stringify(authData.user));
        }
        this.updateLastActivity();
    }

    clearSession() {
        localStorage.clear();
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null;
        }
    }

    updateLastActivity() {
        localStorage.setItem('last_activity_time', new Date().getTime().toString());
    }

    setLastRoute(route) {
        localStorage.setItem('last_route', route);
    }

    getLastRoute() {
        return localStorage.getItem('last_route');
    }

    getCurrentUserSync() {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    }

    async checkRateLimit() {
        try {
            const response = await api.get(`${AUTH_ENDPOINTS.LOGIN}/rate-limit`);
            return response.data?.rate_limit_info || null;
        } catch (error) {
            console.error('Rate limit check failed:', error);
            return null;
        }
    }
}

export const authService = new AuthService();