import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    // Show loading spinner while checking authentication status
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" text="Đang kiểm tra đăng nhập..." />
            </div>
        );
    }

    // If not authenticated, redirect to login page
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If authenticated, render the protected component
    return <>{children}</>;
};

export default PrivateRoute;
