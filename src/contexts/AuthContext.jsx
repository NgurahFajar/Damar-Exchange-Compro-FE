import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    const checkAuth = useCallback(async () => {
        try {
            if (authService.isAuthenticated()) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Auth check failed:', error);
            await logout(); // Ensure cleanup on auth check failure
            return false;
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await checkAuth();
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        if (!initialized) {
            initializeAuth();
        }
    }, [checkAuth, initialized]);

    const login = async (credentials) => {
        try {
            const result = await authService.login(credentials);
            if (result.success) {
                setUser(result.user);
                localStorage.setItem('last_login_time', new Date().getTime().toString());
                localStorage.removeItem('needs_reauth');
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            navigate('/', { replace: true });
        }
    };

    useEffect(() => {
        // Set up activity monitoring
        const handleActivity = () => {
            if (user) {
                authService.updateLastActivity();
            }
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [user]);

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
        );
    }

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user && authService.isAuthenticated(),
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};