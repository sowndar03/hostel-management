import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoEye } from "react-icons/io5";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { getStatus } from "../../../utils/helper";
import Swal from "sweetalert2";
import Select from "react-select";
import { useForm } from "react-hook-form";
import api from "../../../api";

const List = () => {
    const statusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
    ];

    const navigate = useNavigate();
    const [filterToggle, setFilterToggle] = useState(false);
    const [lists, setList] = useState([]);
    const [originalList, setOriginalList] = useState([]);
    const api_url = import.meta.env.VITE_API_URL;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();

    const handleReset = () => {
        reset();
        setList(originalList);
    };

    const getallLocation = async () => {
        try {
            const res = await api.get(`${api_url}/master/location/list`);
            setList(res.data.data);
            setOriginalList(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleView = (id) => {
        navigate(`/master/location/view/${id}`);
    };
    const handleEdit = (id) => {
        navigate(`/master/location/edit/${id}`);
    };

    const handleActiveStatus = async (id, status) => {
        let text = "";
        let button = "";

        if (status === 1) {
            text = "Do you want to Inactivate the Location?";
            button = "Yes, Inactivate!";
        } else {
            text = "Do you want to Activate the Location?";
            button = "Yes, Activate!";
        }
        Swal.fire({
            title: "Are you sure?",
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: button,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.post(`${api_url}/master/location/statusChange`, {
                        id,
                        status,
                    });
                    setList((prevList) =>
                        prevList.map((item) =>
                            item.id === id
                                ? { ...item, status: item.status === 1 ? 0 : 1 }
                                : item
                        )
                    );
                    Swal.fire(
                        "Updated!",
                        status === 1
                            ? "Location has been inactivated."
                            : "Location has been activated.",
                        "success"
                    );
                } catch (err) {
                    Swal.fire("Oops...", "Something went wrong!", "error");
                }
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Delete the Location?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.post(`${api_url}/master/location/delete`, { id });
                    setList((prevList) => prevList.filter((item) => item.id !== id));
                    Swal.fire(
                        "Updated!",
                        "Location has been Deleted Successfully",
                        "success"
                    );
                } catch (err) {
                    Swal.fire("Oops...", "Something went wrong!", "error");
                }
            }
        });
    };

    const handleSearch = (data) => {
        const location = data.location?.toLowerCase() || "";
        const status = data.status || "";

        let filtered = [...originalList];

        if (location) {
            filtered = filtered.filter((item) =>
                item.name?.toLowerCase().includes(location)
            );
        }

        if (status !== "") {
            filtered = filtered.filter(
                (item) => String(item.status) === String(status)
            );
        }

        setList(filtered);
    };

    const handleSort = (value) => {
        let sorted = [...originalList];
        if (value == "name") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } if (value == "status") {
            sorted.sort((a, b) => a.status - b.status);
        }
        setList(sorted);
    }

    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        getallLocation();
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        //Mutation observer is an api that lets you watch for a changed in the dom. 
        //it tells to us when element is added or removed..
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        setIsDark(document.documentElement.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#101828]">
            <div className="border-b">
                <div className="flex justify-between items-center pb-3">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-white">
                        Location List
                    </h2>
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
                            onClick={() => navigate("/master/location/add")}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(handleSearch)}>
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
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <label
                                            htmlFor="location"
                                            className="block mb-2 text-gray-700 dark:text-white font-semibold"
                                        >
                                            Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Location Name"
                                            {...register("location")}
                                            className="w-full input-style border rounded px-3 py-2 
                                                focus:outline-none focus:ring-2 focus:ring-purple-200 
                                                dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label
                                            htmlFor="status"
                                            className="block mb-2 text-gray-700 dark:text-white font-semibold"
                                        >
                                            Status
                                        </label>
                                        <Select
                                            options={statusOptions}
                                            placeholder="Select Status"
                                            className="w-full"
                                            onChange={(option) => setValue("status", option.value)}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: isDark ? "#1f2937" : "#fff",
                                                    borderColor: state.isFocused
                                                        ? "#a78bfa"
                                                        : isDark
                                                            ? "#374151"
                                                            : "#d1d5db",
                                                    boxShadow: state.isFocused
                                                        ? "0 0 0 2px rgba(167, 139, 250, 0.5)"
                                                        : "none",
                                                    "&:hover": { borderColor: "#a78bfa" },
                                                    color: isDark ? "#f9fafb" : "#111827",
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: isDark ? "#f9fafb" : "#111827",
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: isDark ? "#111827" : "white",
                                                    color: isDark ? "#f9fafb" : "black",
                                                    zIndex: 20,
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
                                                    color: state.isSelected
                                                        ? "white"
                                                        : isDark
                                                            ? "#f9fafb"
                                                            : "#111827",
                                                    cursor: "pointer",
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="reset"
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition m-2"
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                                >
                                    Search
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Locations</h3>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            Sort by:
                        </label>
                        <select
                            onChange={(e) => handleSort(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 
                           bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white"
                        >
                            <option value="">Sort By</option>
                            <option value="name">Location Name</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
                </div>

                <table className="w-full border border-gray-300 dark:border-gray-700 text-center">
                    <thead className="bg-gray-200 dark:bg-gray-800">
                        <tr>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                S.NO
                            </th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                Location Name
                            </th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                Status
                            </th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                Created By
                            </th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(lists) && lists.length > 0 ? (
                            lists.map((list, index) => (
                                <tr
                                    key={list.id}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {list.name}
                                    </td>
                                    <td
                                        className="border border-gray-300 dark:border-gray-700 px-4 py-2 cursor-pointer"
                                        onClick={() => handleActiveStatus(list.id, list.status)}
                                    >
                                        {getStatus(list.status)}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {list.created_by}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                                        <div className="flex justify-center gap-2">
                                            <IoEye
                                                onClick={() => handleView(list.id)}
                                                size={20}
                                                className="text-green-600 dark:text-white hover:text-green-800 cursor-pointer"
                                            />
                                            <BiSolidEdit
                                                size={20}
                                                onClick={() => handleEdit(list.id)}
                                                className="text-blue-600 dark:text-white hover:text-blue-800 cursor-pointer"
                                            />
                                            <AiTwotoneDelete
                                                size={20}
                                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                                onClick={() => handleDelete(list.id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center border border-gray-300 dark:border-gray-700 px-4 py-2"
                                >
                                    No locations found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default List;
