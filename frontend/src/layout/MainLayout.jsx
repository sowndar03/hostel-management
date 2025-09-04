import React, { useState, useEffect } from "react";
import LeftMenu from "../components/LeftMenu";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/Header";

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setCollapsed(true);
            } else {
                setIsMobile(false);
                setCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sidebarWidth = collapsed ? 80 : 250;

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
            <AppHeader />

            <div className="flex">
                <LeftMenu collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />

                <main
                    className="flex-1 pt-[60px] p-6 bg-white dark:bg-gray-900 text-black dark:text-white transition-all duration-300"
                    style={{ marginLeft: isMobile ? 70 : sidebarWidth }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
