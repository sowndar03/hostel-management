import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from 'react-hook-form';
import api from '../../../api';
import Select from 'react-select';
import { ThemeContext } from '../../../context/ThemeContext';
import DataTable from 'react-data-table-component';
import { IoEye } from 'react-icons/io5';
import { BiSolidEdit } from 'react-icons/bi';
import { AiTwotoneDelete } from 'react-icons/ai';
import { getStatus } from '../../../utils/helper';
import Swal from 'sweetalert2';

const List = () => {
  const [list, setList] = useState();
  const [filterToggle, setFilterToggle] = useState(false);
  const [locations, setLocations] = useState([]);
  const [hostels, setHostel] = useState([]);
  const navigate = useNavigate();
  const { handleSubmit, reset, control, register } = useForm();
  const api_url = import.meta.env.VITE_API_URL;
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const getAllBuildings = async () => {
    try {
      const res = await api.get(`${api_url}/master/building/list`);
      setList(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getallLocation = async () => {
    try {
      const res = await api.get(`${api_url}/master/location/list`);
      setLocations(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllHostels = async (location_id) => {
    try {
      const res = await api.get(`${api_url}/master/hostel/getHostel/${location_id}`);
      setHostel(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (data) => {
    try {
      const result = await api.post(`${api_url}/master/building/searchValues`, data);
      setList(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReset = () => {
    reset();
  }

  const columns = [
    {
      name: "SNO", selector: (row, index) => (index + 1)
    },
    {
      name: "Location",
      selector: (row) => row.location_id?.location_name || "-",
      sortable: true,
    },
    {
      name: "Hostel",
      selector: (row) => row.hostel_id?.hostel_name || "-",
      sortable: true,
    },
    {
      name: "Building", selector: (row) => row.building_name, sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          onClick={() => handleStatusClick(row._id, row.status)}
          className="cursor-pointer text-blue-600 focus:outline-none active:outline-none"
        >
          {getStatus(row.status)}
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
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <IoEye
            onClick={() => handleView(row._id)}
            size={20}
            className="text-green-600  hover:text-green-800 cursor-pointer"
          />
          <BiSolidEdit
            size={20}
            onClick={() => handleEdit(row._id)}
            className="text-blue-600  hover:text-blue-800 cursor-pointer"
          />
          <AiTwotoneDelete
            size={20}
            className="text-red-600 hover:text-red-800 cursor-pointer"
            onClick={() => handleDelete(row._id)}
          />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const arrowColor = isDark ? "#ffffff" : "#111827";

  const handleStatusClick = async (id, status) => {
    let text = "";
    let button = "";

    if (status === 1) {
      text = "Do you want to Inactivate the Building?";
      button = "Yes, Inactivate!";
    } else {
      text = "Do you want to Activate the Building?";
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
          const result = await api.post(`${api_url}/master/building/statusChange`, {
            id,
            status,
          });
          setList((prevList) =>
            prevList.map((item) =>
              item._id === id
                ? { ...item, status: item.status === 1 ? 0 : 1 }
                : item
            )
          );
          Swal.fire(
            "Updated!",
            status === 1
              ? "Building has been inactivated."
              : "Building has been activated.",
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
      text: "Do you want to Delete the Building?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`${api_url}/master/building/delete`, { id });
          setList((prevList) => prevList.filter((item) => item._id !== id));
          Swal.fire(
            "Updated!",
            "Building has been Deleted Successfully",
            "success"
          );
        } catch (err) {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      }
    });
  };
  const handleView = (id) => {
    navigate(`/master/building/view/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/master/building/edit/${id}`);
  };

  useEffect(() => {
    getAllBuildings();
    getallLocation();
    setIsDark(theme === "dark");
  }, [theme]);
  return (
    <div className='min-h-screen bg-white dark:bg-[#101828] p-4'>
      <div className="border-b pb-3 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Building List</h2>
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
              onClick={() => navigate("/master/building/add")}
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
                    <label className="block mb-2 text-gray-700 dark:text-white font-semibold">Location</label>
                    <Controller
                      name='location_id'
                      defaultValue={null}
                      control={control}
                      rules={{ required: "Location is required" }}
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
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-gray-700 dark:text-white font-semibold">Hostel</label>
                    <Controller
                      name='hostel_id'
                      defaultValue={null}
                      control={control}
                      rules={{ required: "Hostel is required" }}
                      render={({ field }) => (
                        <Select
                          options={hostels.map((hostel) => ({
                            value: hostel.id,
                            label: hostel.hostel_name
                          }))}
                          placeholder="Select Hostel"
                          value={
                            hostels
                              .map((hostel) => ({ value: hostel.id, label: hostel.hostel_name }))
                              .find((option) => option.value === field.value) || null
                          }
                          onChange={(option) => field.onChange(option?.value || "")}
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
                  </div>

                  <div className="flex-1">
                    <label className="block mb-2 text-gray-700 dark:text-white font-semibold">Building</label>
                    <input
                      type="text"
                      placeholder="Enter Building Name"
                      {...register("building")}
                      className="w-full input-style border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block mb-2 text-gray-700 dark:text-white font-semibold">Status</label>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          options={statusOptions}
                          placeholder="Select Status"
                          className="w-full"
                          value={statusOptions.find((opt) => opt.value === field.value) || null} // ✅ bind value
                          onChange={(option) => field.onChange(option ? option.value : "")} // ✅ connect to field
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
                      )}
                    />

                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="button"
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

      <DataTable
        columns={columns}
        data={list}
        striped
        highlightOnHover
        pagination
        fixedHeader
        fixedHeaderScrollHeight="500px"
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
  )
}

export default List
