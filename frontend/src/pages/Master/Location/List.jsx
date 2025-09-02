import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const List = () => {
    const navigate = useNavigate();
    const [filterToggle, setFilterToggle] = useState(false);

    return (
        <div>
            <div className="border-b">
                <div className="flex justify-between items-center pb-3">
                    <h2 className="text-lg font-bold text-gray-700">Location List</h2>
                    <div>
                        <button
                            type="button"
                            className="px-3 m-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                            onClick={() => setFilterToggle(!filterToggle)}
                        >
                            Filter
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-700 transition"
                            onClick={() => navigate('/master/location/add')}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {filterToggle && (
                        <motion.div
                            key="filter"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="pb-3 mb-4"
                        >
                            <label
                                htmlFor="location"
                                className="block mb-2 text-gray-700 font-semibold"
                            >
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Location Name"
                                className="w-75 md:w-100 input-style focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default List;
