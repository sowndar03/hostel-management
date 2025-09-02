import React, { useState, useEffect } from "react";
import LeftMenu from "../components/LeftMenu";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/Header";

const MainLayout = () => {
    const [sidebarWidth, setSidebarWidth] = useState(250);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarWidth(80); 
            } else {
                setSidebarWidth(250); 
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
            <AppHeader />

            <div className="flex">
                <LeftMenu />

                <main
                    className="flex-1 pt-[60px] p-6 bg-white dark:bg-gray-900 text-black dark:text-white transition-all duration-300"
                    style={{ marginLeft: sidebarWidth }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
