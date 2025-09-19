import { useEffect, useState, useContext } from "react";
import api from "../../../api";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { ThemeContext } from "../../../context/ThemeContext";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, hostellerId, getAllHostellers, setShowModal }) => {
    const [hostelData, setHostelData] = useState([]);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(theme === "dark");

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const api_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (isOpen) {
            fetchAvailableRooms();
        }
    }, [isOpen]);

    const fetchAvailableRooms = async () => {
        try {
            const res = await api.get(
                `${api_url}/admin/master/hostellers/getHosteller/${hostellerId}`
            );
            setHostelData(res.data.data);
        } catch (err) {
            console.error("Error fetching rooms", err);
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await api.post(`${api_url}/admin/rent-management/hostellers/rentPaidStatus`,data,
            );
            if (setShowModal) setShowModal(false);
            toast.success('Rent Status Updated Successfully');
            getAllHostellers();
            navigate("/rent-management/hostellers/list");
        } catch (err) {
            Swal.fire("Oops...", "Something went wrong!", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
                autoComplete="off"
            >
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b pb-3">
                    Select Room & Seat
                </h2>

                <input type="hidden" {...register("id")} value={hostellerId} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Hosteller Rent
                        </label>
                        <p className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg">
                            {hostelData.rent}
                        </p>
                    </div>
                    <div className="">
                        <label htmlFor="rent" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Enter the Rent<span className='text-red-500'>*</span></label>
                        <input
                            type="text"
                            placeholder='Enter Rent'
                            className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                            ...register('rent', {
                                required: "Rent is Required",
                            })

                            } />
                        {
                            errors.rent && <p className="text-red-500 text-sm mt-1 font-bold">
                                {errors.rent.message}
                            </p>
                        }
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        type="button"
                        className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Modal;
