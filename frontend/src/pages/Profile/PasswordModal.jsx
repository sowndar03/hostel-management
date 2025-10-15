import React, { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import api from '../../api';
import { toast } from 'react-toastify';

const PasswordModal = ({ close }) => {
    const modalRef = useRef();
    const { handleSubmit, register, watch, getValues, formState: { errors, isSubmitting } } = useForm();
    const [checkingPassword, setCheckingPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const api_url = import.meta.env.VITE_API_URL;

    const onSubmit = (data) => {
        try {
            const result = api.post(`${api_url}/login/password/change`, data);
            toast.success("Password changed successfully");
            close();
        } catch (err) {
            console.log(err);
        }
    };

    const newPassword = watch("new_password");

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-white">Change Password</h5>
                    <button onClick={close} className="text-gray-500 hover:text-red-500">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4 text-left">
                    
                    <div className="mb-4">
                        <label htmlFor="old_password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Old Password
                        </label>
                        <input
                            type="password"
                            id="old_password"
                            {...register('old_password', {
                                required: "Old password is required",
                                validate: async (value) => {
                                    try {
                                        const res = await api.post(`${api_url}/login/password/check`, { password: value });
                                        console.log(res);
                                        if (res.data.data) {
                                            return true;
                                        }
                                        return res.data.message;
                                    } catch (err) {
                                        if (err.response?.status === 401 || err.response?.status === 404) {
                                            return err.response?.data?.message || "Old password is incorrect";
                                        }
                                        return "Something went wrong";
                                    }
                                }

                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.old_password && <p className="text-red-500 text-sm mt-1">{errors.old_password.message}</p>}
                        {checkingPassword && !errors.old_password && <p className="text-blue-500 text-sm mt-1">Verifying password...</p>}
                    </div>

                   
                    <div className="mb-4 relative">
                        <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </label>
                        <div className='flex justify-center items-center'>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="new_password"
                                {...register('new_password', { required: "New password is required" })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3  text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                        {errors.new_password && <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>}
                    </div>

                    
                    <div className="mb-4 relative">
                        <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <div className="flex justify-center items-center">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm_password"
                                {...register('confirm_password', {
                                    required: "Please confirm your password",
                                    validate: value => value === newPassword || "Passwords do not match"
                                })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                        {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
                    </div>

                    
                    <div className="flex justify-end gap-2 border-t border-gray-200 pt-3">
                        <button
                            type="button"
                            onClick={close}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                            disabled={checkingPassword || isSubmitting}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
