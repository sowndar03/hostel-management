import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

const PrivateRoutes = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <LoadingScreen />;

    return isAuthenticated ? children : <Navigate to="/" replace state={{ from: location.pathname }} />

}
export default PrivateRoutes;