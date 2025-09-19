import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { ThemeContext } from "../../../context/ThemeContext";
import { displayDateformat, getImageUrl, getWorkingProfessional } from '../../../utils/helper';

const api_url = import.meta.env.VITE_API_URL;

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const [hosteller, setHosteller] = useState(null);

  const fetchHostellers = async () => {
    try {
      const res = await api.get(`${api_url}/admin/master/hostellers/getHosteller/${id}`);
      setHosteller(res.data.data);
    } catch (err) {
      console.error("Error fetching hostel:", err);
    }
  };

  useEffect(() => {
    fetchHostellers();
    setIsDark(theme === "dark");
  }, [id, theme]);

  if (!hosteller) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen dark:bg-[#101828] p-6">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-lg font-bold text-black dark:text-white">Room View</h2>
        <button
          type="button"
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => navigate("/admin/master/hostellers/list")}
        >
          Back
        </button>
      </div>

      <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 shadow-sm">
        <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
          Hostel Details
        </h6>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Location</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.location_id?.location_name}
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Hostel</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.hostel_id?.hostel_name}
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Building</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.building_id?.building_name}
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Room No.</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.room_id?.room_no}
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Seat No</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.seat_no?.seat_no}
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Total Advance Amount</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.total_advance_amount}
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Advance Amount</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.advance_amount}
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Rent</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller.rent}
            </p>
          </div>
        </div>

        <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
          Personal Details
        </h6>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Name</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{hosteller.name}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Phone No.</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{hosteller.phone_no}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Date of Birth</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{displayDateformat(hosteller.dob)}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Parent Name</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{hosteller.parent_name}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Emergency Contact Number</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{hosteller.emergency_contact_no}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Working Professional</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{getWorkingProfessional(hosteller.working_professional)}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Working Place/College</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{hosteller.working_place}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Address</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">{hosteller.address}</p>
          </div>
        </div>

        <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
          Identity Verification
        </h6>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Photo</label>
            <a
              href={getImageUrl(hosteller.photo)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={getImageUrl(hosteller.photo)}
                alt="Hosteller Photo"
                className="w-32 h-32 object-cover rounded shadow"
              />
            </a>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">ID Proof</label>
            <a
              href={getImageUrl(hosteller.id_proof)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={getImageUrl(hosteller.id_proof)}
                alt="Hosteller ID Proof"
                className="w-32 h-32 object-cover rounded shadow"
              />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default View;
