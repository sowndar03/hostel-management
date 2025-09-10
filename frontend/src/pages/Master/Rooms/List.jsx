import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import api from '../../../api';
import DataTable from 'react-data-table-component';
import { getStatus } from '../../../utils/helper';
import { IoEye } from 'react-icons/io5';
import { BiSolidEdit } from 'react-icons/bi';
import { AiTwotoneDelete } from 'react-icons/ai';
import { ThemeContext } from '../../../context/ThemeContext';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

const list = () => {
  const [filterToggle, setFilterToggle] = useState(false);
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const api_url = import.meta.env.VITE_API_URL;
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme == "dark");
  const [locations, setLocations] = useState([]);
  const [hostels, setHostel] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const getAllRooms = async () => {
    try {
      const res = await api.get(`${api_url}/master/rooms/list`);
      setList(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReset = () => {
    reset();
    getAllRooms();
  }

  const handleSearch = async (data) => {
    try {
      const result = await api.post(`${api_url}/master/rooms/searchValues`, data);
      setList(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusClick = async (id, status) => {
    let text = "";
    let button = "";

    if (status === 1) {
      text = "Do you want to Inactivate the Rooms?";
      button = "Yes, Inactivate!";
    } else {
      text = "Do you want to Activate the Rooms?";
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
          const result = await api.post(`${api_url}/master/rooms/statusChange`, {
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
              ? "Rooms has been inactivated."
              : "Rooms has been activated.",
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
      text: "Do you want to Delete the Room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`${api_url}/master/rooms/delete`, { id });
          setList((prevList) => prevList.filter((item) => item._id !== id));
          Swal.fire(
            "Updated!",
            "Room has been Deleted Successfully",
            "success"
          );
        } catch (err) {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      }
    });
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

  const getBuildings = async (location_id, hostel_id) => {
    try {
      const res = await api.get(`${api_url}/master/building/getBuilding/${location_id}/${hostel_id}`);
      setBuildings(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleView = (id) => {
    navigate(`/master/room/view/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/master/room/edit/${id}`);
  };

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
      name: "Building", selector: (row) => row.building_id?.building_name, sortable: true,
    },
    {
      name: "Room Number", selector: (row) => row.room_no, sortable: true,
    },
    {
      name: "Count", selector: (row) => row.room_count, sortable: true,
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
  useEffect(() => {
    getAllRooms();
    getallLocation();
    setIsDark(theme == "dark");
  }, [theme]);

  return (
    <div className='min-h-screen bg-white dark:bg-[#101828] p-6'>
      <div className="border-b pb-3 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Rooms List</h2>
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
              onClick={() => navigate("/master/room/add")}
            >
              Add
            </button>
            <button
              type="button"
              className="px-3 py-1 m-2 bg-green-600 text-white rounded hover:bg-green-800 transition"
              onClick={() => navigate("/master/room/import")}
            >
              Import
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
                  <div className="">
                    <label htmlFor="hostel_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Hostel </label>
                    <Controller
                      name='hostel_id'
                      defaultValue={null}
                      control={control}
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
                          onChange={(option) => {
                            field.onChange(option?.value || "");
                            const location_id = getValues('location_id');
                            if (option?.value) {
                              getBuildings(location_id, option.value);
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
                    {errors.hostel_id && (
                      <p className="text-red-500 text-sm mt-1 font-bold">
                        {errors.hostel_id.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label htmlFor="hostel_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Building </label>
                    <Controller
                      name='building_id'
                      defaultValue={null}
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={buildings.map((building) => ({
                            value: building._id,
                            label: building.building_name
                          }))}
                          placeholder="Select Building"
                          value={
                            buildings
                              .map((building) => ({ value: building._id, label: building.building_name }))
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
                    {errors.building_id && (
                      <p className="text-red-500 text-sm mt-1 font-bold">
                        {errors.building_id.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label htmlFor="building" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Room <span className='text-red-500'>*</span></label>
                    <input
                      type="text"
                      placeholder='Enter Room Number'
                      className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                      ...register('room_no')
                      } />
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
