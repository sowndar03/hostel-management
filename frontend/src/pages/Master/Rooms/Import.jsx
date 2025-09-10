import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import sampleExcel from '../../../assets/excel/sampledownload/master/Rooms.xlsx'
import { toast } from 'react-toastify';

const Import = () => {
    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file[0]);
        try {
            const res = await api.post(`${api_url}/master/rooms/import/submit`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(res.data.message);
            navigate('/master/room/list');
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while saving");
        }
    };


    const handleSampleExcel = () => {
        const link = document.createElement('a');
        link.href = sampleExcel;
        link.setAttribute('download', 'Rooms - Sample File.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className='min-h-screen bg-white dark:bg-[#101828] p-4'>
            <form onSubmit={handleSubmit(onSubmit)} className='rounded shadow-lg p-6'>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-white">Room Import</h2>
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-700 transition"
                            onClick={handleSampleExcel}
                        >
                            Sample Excel
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                            onClick={() => navigate('/master/room/list')}
                        >
                            Back
                        </button>
                    </div>
                </div>

                <div className="flex">
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-600 dark:text-gray-200">Choose file</label>
                        <input
                            type="file"
                            {...register("file", {
                                required: "Please select a file",
                                validate: {
                                    isExcel: (fileList) => {
                                        const file = fileList[0];
                                        if (!file) return "Please select a file";
                                        const allowedTypes = [
                                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                                            "application/vnd.ms-excel", // .xls
                                        ];
                                        return allowedTypes.includes(file.type) || "Only Excel files are allowed";
                                    },
                                },
                            })}
                            accept=".xlsx,.xls"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.file && <p className="text-red-500 mt-1 text-sm">{errors.file.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                    {isSubmitting ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
};

export default Import;
