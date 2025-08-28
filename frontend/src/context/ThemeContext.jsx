import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

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

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
