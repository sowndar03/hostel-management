import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();
const api_url = import.meta.env.VITE_API_URL;

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await api.post(`${api_url}/user/loggedUser`);
            setUsername(response.data.user.name);
            setAuthenticated(true);
        } catch (err) {
            console.error("Error fetching user:", err);
            logout(); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("logintoken");
        if (token) {
            fetchUser(); 
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("logintoken", token);
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("logintoken");
        setAuthenticated(false);
        setUsername(null);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, login, logout, username, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
