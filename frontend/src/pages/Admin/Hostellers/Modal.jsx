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
    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [availableSeats, setAvailableSeats] = useState([]);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(theme === "dark");

    const {
        setValue,
        control,
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

    const getBuildings = async (location_id, hostel_id) => {
        try {
            const res = await api.get(
                `${api_url}/master/building/getBuilding/${location_id}/${hostel_id}`
            );
            setBuildings(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getRooms = async (location_id, hostel_id, building_id) => {
        try {
            const res = await api.get(
                `${api_url}/master/rooms/getRooms/${location_id}/${hostel_id}/${building_id}`
            );
            setRooms(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getAvailableSeats = async (room_id) => {
        try {
            const res = await api.get(
                `${api_url}/master/rooms/availableSeats/${room_id}`
            );
            setAvailableSeats(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAvailableRooms = async () => {
        try {
            const res = await api.get(
                `${api_url}/admin/master/hostellers/getHosteller/${hostellerId}`
            );
            getBuildings(
                res.data.data.location_id._id,
                res.data.data.hostel_id._id
            );
            setHostelData(res.data.data);
        } catch (err) {
            console.error("Error fetching rooms", err);
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await api.post(`${api_url}/admin/master/hostellers/statusUpdate`, data);
            if (setShowModal) setShowModal(false);
            toast.success('Hosteller Activated Successfully');
            getAllHostellers();
            navigate("/admin/master/hostellers/list");
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
            >
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b pb-3">
                    Select Room & Seat
                </h2>

                <input type="hidden" {...register("id")} value={hostellerId} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Location
                        </label>
                        <p className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg">
                            {hostelData.location_id?.location_name}
                        </p>
                    </div>

                    {/* Hostel */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Hostel
                        </label>
                        <p className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg">
                            {hostelData.hostel_id?.hostel_name}
                        </p>
                    </div>

                    {/* Building */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Building <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="building_id"
                            control={control}
                            rules={{ required: "Building is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={buildings.map((b) => ({
                                        value: b._id,
                                        label: b.building_name,
                                    }))}
                                    onChange={(option) => {
                                        field.onChange(option);
                                        setValue("room_id", null); // reset rooms
                                        setValue("seat_no", null); // reset seats
                                        getRooms(
                                            hostelData.location_id._id,
                                            hostelData.hostel_id._id,
                                            option.value
                                        );
                                    }}
                                    placeholder="Select Building"
                                />
                            )}
                        />
                        {errors.building_id && (
                            <p className="text-red-500 text-sm">
                                {errors.building_id.message}
                            </p>
                        )}
                    </div>

                    {/* Room */}
                    <div className="">
                        <label htmlFor="room_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Room No. <span className='text-red-500'>*</span></label>
                        <Controller
                            name='room_id'
                            defaultValue={null}
                            control={control}
                            rules={{ required: "Room No is required" }}
                            render={({ field }) => (
                                <Select
                                    options={rooms.map((room) => ({
                                        value: room._id,
                                        label: room.room_no
                                    }))}
                                    placeholder="Select Room"
                                    value={
                                        rooms
                                            .map((room) => ({ value: room._id, label: room.room_no }))
                                            .find((option) => option.value === field.value) || null
                                    }
                                    onChange={(option) => {
                                        field.onChange(option?.value || "");
                                        if (option?.value) {
                                            getAvailableSeats(option.value);
                                        }
                                    }}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: isDark ? "#1f2937" : "#fff",
                                            borderColor: isDark ? "#374151" : "#d1d5db",
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: isDark ? "#f9fafb" : "#111827",
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: isDark ? "#111827" : "#fff",
                                            color: isDark ? "#f9fafb" : "#111827",
                                        }),
                                        option: (base, { isFocused, isSelected }) => ({
                                            ...base,
                                            backgroundColor: isFocused
                                                ? (isDark ? "#374151" : "#e5e7eb")
                                                : isSelected
                                                    ? (isDark ? "#4b5563" : "#d1d5db")
                                                    : "transparent",
                                            color: isDark ? '#fff' : '#1f2937',
                                            cursor: "pointer",
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.room_id && (
                            <p className="text-red-500 text-sm mt-1 font-bold">
                                {errors.room_id.message}
                            </p>
                        )}
                    </div>

                    <div className="">
                        <label htmlFor="seat_no" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Select Seat<span className='text-red-500'>*</span></label>
                        <Controller
                            name='seat_no'
                            defaultValue={null}
                            control={control}
                            rules={{ required: "Seta No. is required" }}
                            render={({ field }) => (
                                <Select
                                    options={availableSeats.map((availablSeat) => ({
                                        value: availablSeat._id,
                                        label: availablSeat.seat_no
                                    }))}
                                    placeholder="Select Seat No."
                                    value={
                                        availableSeats
                                            .map((availablSeat) => ({ value: availablSeat._id, label: availablSeat.seat_no }))
                                            .find((option) => option.value === field.value) || null
                                    }
                                    onChange={(option) => field.onChange(option?.value || "")}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: isDark ? "#1f2937" : "#fff",
                                            borderColor: isDark ? "#374151" : "#d1d5db",
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: isDark ? "#f9fafb" : "#111827",
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: isDark ? "#111827" : "#fff",
                                            color: isDark ? "#f9fafb" : "#111827",
                                        }),
                                        option: (base, { isFocused, isSelected }) => ({
                                            ...base,
                                            backgroundColor: isFocused
                                                ? (isDark ? "#374151" : "#e5e7eb")
                                                : isSelected
                                                    ? (isDark ? "#4b5563" : "#d1d5db")
                                                    : "transparent",
                                            color: isDark ? '#fff' : '#1f2937',
                                            cursor: "pointer",
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.seat_no && (
                            <p className="text-red-500 text-sm mt-1 font-bold">
                                {errors.seat_no.message}
                            </p>
                        )}
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
