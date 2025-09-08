import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../api';

const Edit = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();

    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;
    const { id } = useParams(); // id from route param
    const [editId, setEditId] = useState("");

    const onSubmit = async (data) => {
        try {
            const res = await api.post(`${api_url}/master/location/edit/submit`, data);
            toast.success(res.data.message);
            navigate('/master/location/list');
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

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await api.get(`${api_url}/master/location/view/${id}`);
                const loc = res.data.data;
                setValue('location', loc.location_name);
                setValue('id', loc._id);
                setEditId(loc._id);
            } catch (err) {
                console.error("Error fetching location:", err);
            }
        };

        fetchLocation();
    }, [id, setValue]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#101828]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className=" shadow rounded-lg p-6"
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-white">Edit Location</h2>
                    <button
                        type="button"
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        onClick={() => navigate('/master/location/list')}
                    >
                        Back
                    </button>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="location"
                        className="block mb-2 text-gray-700 font-semibold dark:text-white"
                    >
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Location Name"
                        className="w-75 md:w-100 input-style focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
                        {...register('location', {
                            required: 'Location is required',
                            validate: async (value) => {
                                try {
                                    const res = await api.post(
                                        `${api_url}/master/location/uniqueCheck`,
                                        {
                                            location: value,
                                            id: editId, 
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
                    {/* hidden input to include id in form submit */}
                    <input type="hidden" {...register('id')} />
                    {errors.location && (
                        <p className="text-red-500 text-sm mt-1 font-bold">
                            {errors.location.message}
                        </p>
                    )}
                </div>

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

export default Edit;
