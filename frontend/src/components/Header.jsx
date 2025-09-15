import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useState } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AppHeader = ({ sidebarWidth = 250 }) => {
    const api_url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNotification = async (id) => {
        try {
            console.log('Marking notification as read:', id);
            const res = await api.post(`${api_url}/notification/markasread`, { id });
            console.log('API response:', res.data);
            
            const web_link = res.data.notifications.web_link;
            const newUnreadCount = res.data.unread_count;
            
            console.log('New unread count:', newUnreadCount);
            
            // Update the unread count immediately in the context
            setUnreadCount(newUnreadCount);
            
            // Refresh notifications to get updated list
            notifications();
            navigate(`/${web_link}`)
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }

    const { theme, setTheme, handleTheme } = useContext(ThemeContext);
    const { logout, username, notification, unreadCount, setUnreadCount, notifications } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const notificationRef = useRef(null);
    const menuRef = useRef(null);

    return (
        <header className="fixed top-0 h-[60px] z-50 flex items-center justify-end gap-5 px-6 border-b border-[#d1cfff] bg-white dark:bg-gray-800 text-black dark:text-white" style={{ left: sidebarWidth, right: 0 }}>
            <button
                onClick={handleTheme}
                className="mr-4"
            >
                {theme === "dark" ? (
                    <FiSun size={20} className="text-yellow-400" />
                ) : (
                    <FiMoon size={20} className="text-[#6b63c7]" />
                )}
            </button>

            <div className="relative" ref={notificationRef}>
                <button
                    className="mr-4 relative"
                    onClick={() => setNotificationOpen(!notificationOpen)}
                >
                    <FiBell size={20} className="text-[#6b63c7] dark:text-gray-300" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">

                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {unreadCount} Unread
                                </span>
                            )}
                        </div>

                        {notification.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notification.map((n, i) => (
                                    <li key={i} onClick={() => handleNotification(n._id)}>
                                        <div
                                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            onClick={() => setNotificationOpen(false)}
                                        >
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                                {n.title}
                                            </p>

                                            <p className="text-sm text-gray-800 dark:text-gray-100">
                                                {n.message}
                                            </p>

                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {n.timeAgo}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        ) : (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                No notifications
                            </div>
                        )}
                    </div>
                )}
            </div>


            <div className="relative" ref={menuRef}>
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-user"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>{username}</span>
                </div>

                {open && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            Settings
                        </button>
                        <button onClick={logout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AppHeader;
