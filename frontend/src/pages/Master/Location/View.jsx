import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { ThemeContext } from "../../../context/ThemeContext";
const api_url = import.meta.env.VITE_API_URL;

const View = () => {
    const { theme } = useContext(ThemeContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(theme === "dark");

    const [location, setLocation] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await api.get(`${api_url}/master/location/view/${id}`);
                setLocation(res.data.data);
            } catch (err) {
                console.error("Error fetching location:", err);
            }
        };

        fetchLocation();
        setIsDark(theme == "dark");
    }, [id, theme]);

    return (
        <div className="min-h-screen dark:bg-[#101828] p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-bold  text-black dark:text-white">Location View</h2>
                <button
                    type="button"
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    onClick={() => navigate("/master/location/list")}
                >
                    Back
                </button>
            </div>
            <div className="mb-4 dark:bg-[#101828] bg-white">
                <label className="block mb-2  text-black dark:text-white font-semibold">
                    Location
                </label>
                <p className="w-75 md:w-100 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
                    {location?.location_name}
                </p>
            </div>
        </div>
    );
};

export default View;
