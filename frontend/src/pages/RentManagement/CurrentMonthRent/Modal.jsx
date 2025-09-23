import { useEffect, useState, useContext } from "react";
import api from "../../../api";
import { useForm } from "react-hook-form";
import { ThemeContext } from "../../../context/ThemeContext";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const Modal = ({ isOpen, onClose, hostellerId, getAllHostellers }) => {
    const [hostelData, setHostelData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useContext(ThemeContext);
    const [isDark, setIsDark] = useState(theme === "dark");

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm();

    const api_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (isOpen && hostellerId) {
            fetchAvailableRooms();
        }
    }, [isOpen, hostellerId]);

    // Reset form and data when modal closes
    useEffect(() => {
        if (!isOpen) {
            setHostelData({});
            reset();
            setIsLoading(false);
        }
    }, [isOpen, reset]);

    const fetchAvailableRooms = async () => {
        try {
            setIsLoading(true);
            const res = await api.get(
                `${api_url}/admin/master/hostellers/getHosteller/${hostellerId}`
            );
            setHostelData(res.data.data);
        } catch (err) {
            console.error("Error fetching hosteller data", err);
            toast.error("Failed to fetch hosteller data");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            
            // Ensure we have the hosteller ID
            if (!hostellerId) {
                toast.error("Hosteller ID is missing");
                return;
            }
            
            const res = await api.post(`${api_url}/admin/rent-management/hostellers/rentPaidStatus`, data);
            
            // Check if the response indicates success
            if (res.status === 200 && res.data.message && res.data.message.includes("successfully")) {
                toast.success('Rent updated successfully');
                // Close modal first
                onClose();
                // Then refresh the hostellers list after a delay
                setTimeout(() => {
                    getAllHostellers();
                }, 200);
            } else {
                toast.error(res.data.message || 'Failed to update rent status');
            }
        } catch (err) {
            console.error("Error updating rent status:", err);
            toast.error(err.response?.data?.message || 'Something went wrong!');
        } finally {
            setIsLoading(false);
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
                    Rent Payment
                </h2>

                <input type="hidden" {...register("id")} value={hostellerId} />

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading hosteller data...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Hosteller Name
                            </label>
                            <p className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg">
                                {hostelData.name || 'Loading...'}
                            </p>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Total Rent
                            </label>
                            <p className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg">
                                ₹{hostelData.rent || '0'}
                            </p>
                        </div>

                        {hostelData?.paid_rent ? (
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Previously Paid
                                </label>
                                <p className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg">
                                    ₹{hostelData.paid_rent}
                                </p>
                            </div>
                        ) : null}

                        <div className="md:col-span-2 lg:col-span-3">
                            <label htmlFor="rent" className='block mb-2 text-gray-700 dark:text-white font-semibold'>
                                Enter Payment Amount <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="number"
                                placeholder='Enter payment amount'
                                className='w-full input-style focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' 
                                {...register('rent', {
                                    required: "Payment amount is required",
                                    min: {
                                        value: 1,
                                        message: "Amount must be greater than 0"
                                    },
                                    max: {
                                        value: hostelData.rent || 999999,
                                        message: "Amount cannot exceed total rent"
                                    }
                                })}
                            />
                            {errors.rent && (
                                <p className="text-red-500 text-sm mt-1 font-bold">
                                    {errors.rent.message}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        type="button"
                        className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            'Save Payment'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Modal;
