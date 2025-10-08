import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    <svg
                        className="mx-auto h-16 w-16 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Unauthorized
                </h1>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    You do not have permission to access this page. If you believe this is an error, please contact the system administrator or sign in with an account that has the required access.
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                    >
                        Go Back
                    </button>
                </div>

                <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                    <p>Need help? Contact <a href="mailto:support@example.com" className="underline">support@example.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
