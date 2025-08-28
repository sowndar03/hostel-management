import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const ThemeContext = createContext();
const app_url = import.meta.env.VITE_API_URL;

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark" || storedTheme === "light") {
            setTheme(storedTheme);
            document.documentElement.classList.add(storedTheme);
        } else {
            setTheme("light");
            document.documentElement.classList.add("light");
        }
    }, []);

    const handleTheme = async () => {
        const result = await api.post(`${app_url}/user/setTheme`);
    }

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, handleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
