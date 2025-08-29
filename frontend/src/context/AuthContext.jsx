import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();
const api_url = import.meta.env.VITE_API_URL;

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

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

    const notifications = async () => {
        try {
            const res = await api.post(`${api_url}/notification/getAll`);
            setNotification(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        } catch (err) {

        }
    }

    useEffect(() => {
        const token = localStorage.getItem("logintoken");
        if (token) {
            fetchUser();
            notifications();
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
            value={{ isAuthenticated, login, logout, username, loading, notification, setNotification, unreadCount }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
