import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(true);

    const istokenValid = (token) => {
        if (!token) {
            return false;
        } try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp * 1000 > Date.now();
        } catch (err) {
            return false;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("logintoken");
        setAuthenticated(istokenValid(token));
    }, []);

    const login = (token) => {
        localStorage.setItem("logintoken", token);
        setAuthenticated(istokenValid(token));
    }

    const logout = () => {
        localStorage.removeItem("logintoken");
        setAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}