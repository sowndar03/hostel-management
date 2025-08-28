import React from 'react';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoutes = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (isAuthenticated) {
        if (location.pathname === "/login" || location.pathname === "/register") {
            return <Navigate to={location.state?.from || "/dashboard"} replace />;
        }
    }

    return children;
};

export default PublicRoutes;
