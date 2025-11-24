// RouteSecurityWrapper.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx'

const PUBLIC_ROUTES = ['/', '/login'];

const RouteSecurityWrapper = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleRouteSecurityCheck = async () => {
            // Check if user is admin and trying to access public routes
            if (user?.role === 'admin' && PUBLIC_ROUTES.includes(location.pathname)) {
                console.log('Admin accessing public route - logging out');
                await logout();
                navigate('/login', { replace: true });
                return;
            }
        };

        handleRouteSecurityCheck();
    }, [location.pathname, user, logout, navigate]);

    return children;
};

export default RouteSecurityWrapper;