import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-600" />
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;


