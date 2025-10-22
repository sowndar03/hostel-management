import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import api from '../../api';
import DataTable from 'react-data-table-component';
import { checkUserRole, displayDateformat, getEntryStatus, getStatus } from '../../utils/helper';
import { ThemeContext } from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { CONSTANTS } from '../../utils/CONSTANTS';

const list = () => {
    const [filterToggle, setFilterToggle] = useState(false);
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const api_url = import.meta.env.VITE_API_URL;
    const { theme } = useContext(ThemeContext);
    const [isDark, setIsDark] = useState(theme == "dark");
    const [locations, setLocations] = useState([]);
    const hasAdmin = checkUserRole(CONSTANTS.ROLE_ADMIN);

    const statusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
    ];

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm();

    const getAllVisitors = async () => {
        try {
            const res = await api.get(`${api_url}/admin/check-in-out/list`, {
                params: {
                    hasAdmin
                }
            });
            setList(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleReset = () => {
        reset();
        getAllVisitors();
    }

    const handleSearch = async (data) => {
        try {
            const result = await api.post(`${api_url}/admin/check-in-out/searchValues`, data);
            setList(result.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCheckIn = async (data) => {
        const text = "Do you want to check-In the Hosteller?";
        const button = "Yes, Check-In!";

        const id = data._id;
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
                    await api.post(`${api_url}/admin/check-in-out/changeStatus`, data);
                    await getAllVisitors();
                    Swal.fire(
                        "Updated!",
                        "Check In Status Updated",
                        "success"
                    );
                } catch (err) {
                    Swal.fire("Oops...", "Something went wrong!", "error");
                }
            }
        });
    }

    const columns = [
        {
            name: "SNO", selector: (row, index) => (index + 1)
        },
        {
            name: "Location",
            selector: (row) => row.hosteller_id?.location_id?.location_name || "-",
            sortable: true,
        },
        {
            name: "Hostel Name",
            selector: (row) => row.hosteller_id?.hostel_id?.hostel_name || "-",
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.hosteller_id?.name || "-",
            sortable: true,
        },
        {
            name: "Date",
            selector: (row) => displayDateformat(row.date?.date) || "-",
            sortable: true,
        },
        {
            name: "Purpose Of Visit",
            selector: (row) => row.purpose_of_visit || "-",
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => (
                <span

                    className="cursor-pointer text-blue-600 focus:outline-none active:outline-none"
                >
                    {getEntryStatus(row.check_in_out_status)}
                </span>
            ),
            sortable: true,
            ignoreRowClick: true,
        },
        {
            name: "Created By",
            selector: (row) => row.created_by?.name || "-",
            sortable: true,
        },
    ];

    if (hasAdmin) {
        columns.push({
            name: "Action",
            cell: (row) => (
                row.check_in_out_status === CONSTANTS.CHECK_OUT ? (
                    <button
                        className="cursor-pointer px-3 py-1 m-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none active:outline-none"
                        onClick={() => handleCheckIn(row)}
                    >
                        Mark it as Check-In
                    </button>
                ) : (
                    <span className="text-green-700 font-bold">
                        CAME TO THE HOSTEL
                    </span>
                )
            ),
            sortable: false,
            ignoreRowClick: true,
        });
    }

    const arrowColor = isDark ? "#ffffff" : "#111827";
    useEffect(() => {
        getAllVisitors();
        setIsDark(theme == "dark");
    }, [theme]);

    return (
        <div className='min-h-screen bg-white dark:bg-[#101828] p-6'>
            <div className="border-b pb-3 mb-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-white">Hosteller In/Out Management List</h2>
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
                            onClick={() => navigate("/check-in-out/add")}
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="">
                                        <label htmlFor="location_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Location </label>
                                        <Controller
                                            name='location_id'
                                            defaultValue={null}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    options={locations.map((location) => ({
                                                        value: location.id,
                                                        label: location.name
                                                    }))}
                                                    placeholder="Select Location"
                                                    value={
                                                        locations
                                                            .map((loc) => ({ value: loc.id, label: loc.name }))
                                                            .find((option) => option.value === field.value) || null
                                                    }
                                                    onChange={(option) => {
                                                        field.onChange(option?.value || "");
                                                        if (option?.value) {
                                                            getAllHostels(option.value);
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
                                        {errors.location_id && (
                                            <p className="text-red-500 text-sm mt-1 font-bold">
                                                {errors.location_id.message}
                                            </p>
                                        )}
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
            <div>
                <DataTable
                    columns={columns}
                    data={list}
                    striped
                    highlightOnHover
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="500px"
                    noDataComponent={
                        <div
                            className={`p-4 text-center ${isDark ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"
                                }`}
                            style={{ width: "100%" }}
                        >
                            No records to display
                        </div>
                    }
                    paginationIconPrevious={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>&lt;</span>}
                    paginationIconNext={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>&gt;</span>}
                    paginationIconFirstPage={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>«</span>}
                    paginationIconLastPage={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>»</span>}
                    customStyles={{
                        table: { style: { backgroundColor: isDark ? "#0f172a" : "#fff", zIndex: 0 } },
                        head: {
                            style: {
                                backgroundColor: isDark ? "#1e293b" : "#f3f4f6",
                                top: "0",
                                position: "sticky",
                                zIndex: 1
                            }
                        },
                        headCells: {
                            style: {
                                fontWeight: "bold",
                                fontSize: "14px",
                                backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                                color: isDark ? "#e2e8f0" : "#111827"
                            }
                        },
                        rows: {
                            style: { backgroundColor: isDark ? "#111827" : "#fff", color: isDark ? "#f9fafb" : "#111827" },
                            stripedStyle: { backgroundColor: isDark ? "#1f2937" : "#f3f4f6", color: isDark ? "#f9fafb" : "#111827" },
                            highlightOnHoverStyle: { backgroundColor: isDark ? "#334155" : "#e5e7eb", color: isDark ? "#f9fafb" : "#111827", cursor: "pointer" },
                        },
                        pagination: {
                            style: { backgroundColor: isDark ? "#1e293b" : "#fff", color: isDark ? "#e2e8f0" : "#111827", borderTop: `1px solid ${isDark ? "#374151" : "#d1d5db"}` },
                            pageButtonsStyle: { borderRadius: "6px", margin: "0 4px", padding: "6px 12px", cursor: "pointer", transition: "all 0.2s", backgroundColor: isDark ? "#111827" : "#f9fafb", color: isDark ? "#e2e8f0" : "#111827" },
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default list
