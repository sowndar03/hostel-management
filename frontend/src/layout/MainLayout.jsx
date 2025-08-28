import React, { useState } from "react";
import LeftMenu from "../components/LeftMenu";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/Header";

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarWidth = collapsed ? 80 : 250;

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
            <AppHeader />

            <div className="flex">
                <LeftMenu collapsed={collapsed} setCollapsed={setCollapsed} />

                <main
                    className="flex-1 pt-[60px] p-6 bg-white dark:bg-gray-900 text-black dark:text-white"
                    style={{ marginLeft: sidebarWidth }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
