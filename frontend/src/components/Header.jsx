import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";

const AppHeader = () => {
    const { theme, setTheme, handleTheme } = useContext(ThemeContext);
    const { logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);


    return (
        <header className="fixed top-0 w-full flex items-center justify-end gap-5 px-6 py-3 border-b border-[#d1cfff] bg-white dark:bg-gray-800 text-black dark:text-white">
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

            <button className="mr-4 relative">
                <FiBell size={20} className="text-[#6b63c7] dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                </span>
            </button>

            <div className="relative">
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
                    <span>Sowndar</span>
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
