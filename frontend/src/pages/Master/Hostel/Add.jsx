import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from "react-select";
import api from '../../../api';
import { ThemeContext } from '../../../context/ThemeContext';


// Controller tells react-hook-form how to manage the value of react-select.

const Add = () => {
    const { theme } = useContext(ThemeContext);
    const [isDark, setIsDark] = useState(theme === "dark");

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        getValues,
        control,
        formState: { errors, isSubmitting },
    } = useForm();

    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;

    const onSubmit = async (data) => {
        try {
            const res = await api.post(`${api_url}/master/hostel/add`, data);
            toast.success(res.data.message);
            navigate('/master/hostel/list');
        } catch (err) {
            if (err.response && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                console.error(err);
                toast.error("Something went wrong while saving");
            }
        }
    };

    const handleReset = () => {
        reset();
    };

    const getallLocation = async () => {
        try {
            const res = await api.get(`${api_url}/master/location/list`);
            setLocations(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getallLocation();
        setIsDark(theme);
    }, [theme]);

    const getSelectStyles = (isDark) => ({
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
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#a78bfa"
                : state.isFocused
                    ? isDark
                        ? "#374151"
                        : "#ede9fe"
                    : "transparent",
            color: state.isSelected ? "white" : isDark ? "#f9fafb" : "#111827",
            cursor: "pointer",
        }),
    });

    const selectStyles = useMemo(() => getSelectStyles(isDark), []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#101828] mt-5">
            <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className=" shadow rounded-lg p-6"
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-white">Hostel</h2>
                    <button
                        type="button"
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        onClick={() => navigate('/master/building/list')}
                    >
                        Back
                    </button>
                </div>


                <div className="flex gap-6">
                    {/* Input */}
                    <div className="mb-4 flex-1">
                        <label
                            htmlFor="location"
                            className="block mb-2 text-gray-700 dark:text-white font-semibold"
                        >
                            Location <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="location_id"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "Location is required" }}
                            render={({ field }) => (
                                <Select
                                    options={locations.map((loc) => ({ value: loc.id, label: loc.name }))}
                                    placeholder="Select Location"
                                    value={
                                        locations
                                            .map((loc) => ({ value: loc.id, label: loc.name }))
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
                        {errors.location_id && (
                            <p className="text-red-500 text-sm mt-1 font-bold">
                                {errors.location_id.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4 flex-1">
                        <label
                            htmlFor="hostel"
                            className="block mb-2 text-gray-700 dark:text-white font-semibold"
                        >
                            Hostel <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Hostel Name"
                            className="w-75 md:w-100 input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
                            {...register('hostel', {
                                required: 'Hostel is required',
                                validate: async (value) => {
                                    const location_id = getValues("location_id");
                                    if (!location_id) return "Please select a location first";
                                    try {
                                        const res = await api.post(
                                            `${api_url}/master/hostel/uniqueCheck`,
                                            {
                                                hostel_name: value,
                                                location_id
                                            }
                                        );
                                        if (res.data.message === 'Available') {
                                            return true;
                                        }
                                        return res.data.message;
                                    } catch (err) {
                                        return 'Validation failed, please try again';
                                    }
                                },
                            })}
                        />
                        {errors.hostel && (
                            <p className="text-red-500 text-sm mt-1 font-bold">
                                {errors.hostel.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                    <button
                        type="reset"
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        disabled={isSubmitting}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Add;
