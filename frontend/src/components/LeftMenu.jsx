import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FiHome, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const LeftMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { theme } = useContext(ThemeContext);
    const app_name = import.meta.env.VITE_APP_NAME;

    const colors = theme === "dark"
        ? {
            sidebarBg: "#1f2937", 
            text: "#e5e7eb", 
            hoverBg: "#374151",
            activeBg: "#4b3fb3",
        }
        : {
            sidebarBg: "#f1f0ff",
            text: "#444",
            hoverBg: "#e8e6ff",
            activeBg: "#9c9ca5ff",
        };

    return (
        <div className="h-screen flex">
            <Sidebar
                collapsed={collapsed}
                backgroundColor={colors.sidebarBg}
                rootStyles={{
                    borderRight: "1px solid #d1cfff",
                    color: colors.text,
                }}
            >
                <div className="flex items-center justify-between px-4 py-3 text-[#6b63c7] dark:text-white"> 
                    {!collapsed && (
                        <span className="font-bold text-lg ps-5 font-serif">{app_name}</span>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <FiMenu size={22} /> : <FiX size={22} />}
                    </button>
                </div>

                <Menu
                    menuItemStyles={{
                        button: {
                            "&:hover": {
                                backgroundColor: colors.hoverBg,
                                color: colors.text,
                            },
                            "&.active": {
                                backgroundColor: colors.activeBg,
                                color: "#fff",
                                fontWeight: "600",
                            },
                        },
                        subMenuContent: {
                            backgroundColor: colors.sidebarBg,
                        },
                    }}
                >
                    <MenuItem icon={<FiHome />} component={<NavLink to="/" />}>
                        Dashboard
                    </MenuItem>

                    <SubMenu icon={<FiUser />} label="Master">
                        <MenuItem component={<NavLink to="/master/location/list" />}>
                            Location
                        </MenuItem>
                        <MenuItem component={<NavLink to="/master/hostel" />}>Hostel</MenuItem>
                        <MenuItem component={<NavLink to="/master/building" />}>
                            Building
                        </MenuItem>
                        <MenuItem component={<NavLink to="/master/rooms" />}>Rooms</MenuItem>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
};

export default LeftMenu;
