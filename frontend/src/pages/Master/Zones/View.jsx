import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { ThemeContext } from "../../../context/ThemeContext";
import MapRadiusSelector from "./MapRadiusSelector";

const api_url = import.meta.env.VITE_API_URL;

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");

  const [zone, setZone] = useState(null);

  const fetchZone = async () => {
    try {
      const res = await api.get(`${api_url}/master/zone/view/${id}`);
      setZone(res.data.data);
    } catch (err) {
      console.error("Error fetching zone:", err);
    }
  };

  useEffect(() => {
    fetchZone();
    setIsDark(theme === "dark");
  }, [id, theme]);

  if (!zone) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading zone details...
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#101828] p-6">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-lg font-bold text-black dark:text-white">
          Zone View
        </h2>
        <button
          type="button"
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => navigate("/master/zone/list")}
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-2 text-black dark:text-white font-semibold">
            Location
          </label>
          <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
            {zone.location_id?.location_name || "-"}
          </p>
        </div>

        <div>
          <label className="block mb-2 text-black dark:text-white font-semibold">
            Hostel
          </label>
          <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
            {zone.hostel_id?.hostel_name || "-"}
          </p>
        </div>

        <div>
          <label className="block mb-2 text-black dark:text-white font-semibold">
            Latitude
          </label>
          <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
            {zone.zone_lat || "-"}
          </p>
        </div>

        <div>
          <label className="block mb-2 text-black dark:text-white font-semibold">
            Longitude
          </label>
          <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
            {zone.zone_lng || "-"}
          </p>
        </div>
      </div>

      <div className="col-span-1 md:col-span-3 mb-3 mt-4">
        <MapRadiusSelector
          lat={zone.zone_lat}
          lng={zone.zone_lng}
          radius={zone.zone_radius || 300} 
          area={zone.location_id?.location_name}
          readOnly
        />
      </div>
    </div>
  );
};

export default View;
