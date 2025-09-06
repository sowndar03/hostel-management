import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { ThemeContext } from "../../../context/ThemeContext";
import DataTable from "react-data-table-component";
import { getStatus } from "../../../utils/helper";


const List = () => {
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
    
  const api_url = import.meta.env.VITE_API_URL;

  const [lists, setList] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filterToggle, setFilterToggle] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const getAllHostels = async () => {
    try {
      const res = await api.get(`${api_url}/master/hostel/list`);
      setList(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllLocations = async () => {
    try {
      const res = await api.get(`${api_url}/master/location/list`);
      setLocations(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllHostels();
    getAllLocations();
  }, []);

  // Handle search/filter
  const handleSearch = (data) => {
    const location = data.location || "";
    const hostelName = data.hostel?.toLowerCase() || "";
    const status = data.status || "";

    let filtered = [...originalList];

    if (location) {
      filtered = filtered.filter((item) => item.location_id === location);
    }

    if (hostelName) {
      filtered = filtered.filter((item) =>
        item.hostel_name.toLowerCase().includes(hostelName)
      );
    }

    if (status !== "") {
      filtered = filtered.filter(
        (item) => String(item.status) === String(status)
      );
    }

    setList(filtered);
  };

  const handleReset = () => {
    reset();
    setList(originalList);
  };

  const columns = [
    {
      name: "SNO",
      selector: (row, index) => (index + 1),
      sortable: false,
    },
    {
      name: "Location",
      selector: (row) => row.location_name,
      sortable: true,
    },
    {
      name: "Hostel",
      selector: (row) => row.hostel_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => getStatus(row.status),
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => (row.created_by),
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#101828] p-4">
      <div className="border-b pb-3 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">
            Hostel List
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
              onClick={() => navigate("/master/hostel/add")}
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
                    <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
                      Location
                    </label>
                    <Select
                      options={locations.map((loc) => ({
                        value: loc.id,
                        label: loc.name,
                      }))}
                      placeholder="Select Location"
                      onChange={(option) => setValue("location", option.value)}
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
                      }}
                    />
                  </div>

                  {/* Hostel Name */}
                  <div className="flex-1">
                    <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
                      Hostel
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Hostel Name"
                      {...register("hostel")}
                      className="w-full input-style border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex-1">
                    <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
                      Status
                    </label>
                    <Select
                      options={statusOptions}
                      placeholder="Select Status"
                      onChange={(option) => setValue("status", option.value)}
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
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="reset"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition mr-2"
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={lists}
          pagination
          highlightOnHover
          striped
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: isDark ? "#1f2937" : "#f9fafb",
                color: isDark ? "#f9fafb" : "#111827",
              },
            },
            rows: {
              style: {
                backgroundColor: isDark ? "#111827" : "#fff",
                color: isDark ? "#f9fafb" : "#111827",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
