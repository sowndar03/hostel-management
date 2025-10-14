import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';

const PasswordModal = ({ close }) => {
    const modalRef = useRef();
    const { handleSubmit, setValue, getValues, register, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [close]);

    const onSubmit = () => {

    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96 text-center relative"
            >

                <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Change Password
                    </h1>
                    <button
                        onClick={close}
                        className="p-1 hover:text-red-500"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
