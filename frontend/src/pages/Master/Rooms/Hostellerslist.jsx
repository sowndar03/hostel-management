import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";
import { useNavigate } from 'react-router-dom';

const Hostellerslist = () => {
    const { id } = useParams();
    const [list, setList] = useState([]);
    const api_url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const getHostellers = async () => {
        try {
            const result = await api.get(
                `${api_url}/admin/master/rooms/getHostellers/${id}`
            );
            setList(result.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getHostellers();
    }, []);

    return (
        <div className="p-6 min-h-screen shadow-lg p-6 rounded-lg">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-bold text-black dark:text-white">Hostellers - {list[0]?.room_id.room_no}</h2>
                <button
                    type="button"
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    onClick={() => navigate("/master/room/list")}
                >
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer ">
                {list.map((h, i) => (
                    <div
                        key={i}
                        className="p-5  rounded-2xl shadow-md hover:shadow-xl transition-transform bg-white dark:bg-[#101828] transform hover:-translate-y-1"
                    >
                        <span className="text-sm text-gray-700 dark:text-white font-bold">
                            Seat No: {h.seat_no}
                        </span>

                        <h2 className="text-lg font-semibold mt-2 text-gray-700 dark:text-white">
                            {h.user_id?.name || `No Person Allocated`}
                        </h2>

                        <div className="mt-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${h.seat_status === "1"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {h.seat_status === "1" ? "Available" : "Occupied"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hostellerslist;
