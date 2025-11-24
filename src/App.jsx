// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18next.js';
import Login from './pages/Login';
import Admin from "./pages/Admin";
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './pages/AdminPartition/RouteSecurity/ProtectedRoute.jsx'
import RouteSecurityWrapper from "@/pages/AdminPartition/RouteSecurity/RoutesSecurityWrapper.jsx";
import {CurrencyProvider} from "@/contexts/CurrencyContext.jsx";

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <ThemeProvider>
                    <CurrencyProvider>
                    <RouteSecurityWrapper>
                        <div className="min-h-screen">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<LandingPage />} />

                                {/* Admin Routes */}
                                <Route path="/admin/*" element={
                                    <Routes>
                                        {/* Admin Login Route */}
                                        <Route path="login" element={<Login />} />
                                        {/* Protected Admin Routes */}
                                        <Route path="*" element={
                                            <ProtectedRoute>
                                                <Admin />
                                            </ProtectedRoute>
                                        } />
                                    </Routes>
                                } />

                                {/* Redirect /login to /admin/login */}
                                <Route
                                    path="/login"
                                    element={<Navigate to="/admin/login" replace />}
                                />

                                {/* Catch all */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </RouteSecurityWrapper>
                    </CurrencyProvider>
                </ThemeProvider>
            </AuthProvider>
        </I18nextProvider>
    );
};

export default App;