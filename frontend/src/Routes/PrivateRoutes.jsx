import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    return isAuthenticated ? children : <Navigate to="/" replace state={{ from: location.pathname }} />

}
export default PrivateRoutes;