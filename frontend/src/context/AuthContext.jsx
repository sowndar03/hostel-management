import React, { createContext, useState, useEffect } from "react";
import api from "../api";
import { io } from "socket.io-client";
import { toast } from 'react-toastify';
import { requestForToken } from "../utils/firebase";

export const AuthContext = createContext();
const api_url = import.meta.env.VITE_API_URL;
const app_url = import.meta.env.VITE_APP_URL;

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [user, setUser] = useState(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const fetchUser = async () => {
        try {
            const response = await api.post(`${api_url}/user/loggedUser`);
            setUsername(response.data.user.name);
            setUser(response.data.user);
            registerFCMtoken(response.data.user._id);
            //Socket
            const socketConnection = io(backend_url, { withCredentials: true });
            if (response.data.user) {
                const role_id = response.data.user.role_id;
                const id = response.data.user._id;
                if (role_id == 1) {
                    socketConnection.emit('join-admin-room', id);
                    socketConnection.on('new-ticket', (ticket) => {
                        const { ticket_id, hostelName, user_name, web_link } = ticket;

                        toast.info(`New Ticket has been created by ${user_name} from ${hostelName}`);

                        setNotification(prev => [
                            {
                                notification_type: "Ticket",
                                module_type: "Ticketing",
                                module_sub_type: "New Ticket",
                                title: "New Ticket Raised",
                                message: `New Ticket has been created by ${user_name} from ${hostelName}`,
                                web_link: `${web_link}`, 
                                assigned_user: "admin",
                                viewed_user: "",
                                status: 1,
                                createdAt: new Date().toISOString(),
                                _id: ticket_id,
                            },
                            ...prev
                        ]);

                        setUnreadCount(prev => prev + 1);
                    });

                } else {
                    socketConnection.emit('join-user-room', id);
                }
            }
            setAuthenticated(true);
        } catch (err) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const registerFCMtoken = async (id) => {
        const fcmToken = await requestForToken();
        if (fcmToken) {
            await api.post(`${api_url}/user/store-fcm-token`, {
                id,
                fcmToken
            });
        }
    }

    const notifications = async () => {
        try {
            const res = await api.post(`${api_url}/notification/getAll`);
            setNotification(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        } catch (err) {
            console.error("Error fetching notifications:", err);
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

    const login = async (token) => {
        localStorage.setItem("logintoken", token);
        setLoading(true);
        await fetchUser();
        await notifications();
    };

    const logout = () => {
        localStorage.removeItem("logintoken");
        setAuthenticated(false);
        setUsername(null);
        setNotification([]);
        setUnreadCount(0);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                username,
                user,
                loading,
                notification,
                setNotification,
                unreadCount,
                setUnreadCount,
                notifications
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
