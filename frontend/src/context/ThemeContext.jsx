import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const ThemeContext = createContext();
const app_url = import.meta.env.VITE_API_URL;

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const handleTheme = async () => {
    const result = await api.post(`${app_url}/user/setTheme`);
    setTheme(result.data.theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(result.data.theme);
  };

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    if (!token) return;
    const fetchTheme = async () => {
      const result = await api.post(`${app_url}/user/getTheme`);
      setTheme(result.data.theme);

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(result.data.theme);
    };

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, handleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
