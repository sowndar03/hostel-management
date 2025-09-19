import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ThemeContext } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import DataTable from 'react-data-table-component';
import { getStatus } from "../../../utils/helper";
import { IoEye } from 'react-icons/io5';
import { BiSolidEdit } from 'react-icons/bi';
import { AiTwotoneDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import Modal from './Modal';


const List = () => {
  const [filterToggle, setFilterToggle] = useState(false);
  const { handleSubmit, control, register, getValues, setValue, reset, formState: { errors, isSubmitting } } = useForm();
  const [locations, setLocations] = useState([]);
  const [hostels, setHostel] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHosteller, setSelectedHosteller] = useState(null);
  const [list, setList] = useState([]);
  const [hosteller, setHosteller] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const api_url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSearch = async (data) => {
    try {
      const result = await api.post(`${api_url}/admin/master/hostellers/searchValues`, data);
      setList(result.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleReset = () => {
    reset({
      location_id: "",
      hostel_id: "",
      building_id: "",
      room_id: "",
      hosteller: "",
    });
    setHostel([]);
    setBuildings([]);
    setRooms([]);
    setAvailableSeats([]);
    setHosteller([]);
    getAllHostellers();

  }

  const openSeatSelectionModal = (hostellerId) => {
    setSelectedHosteller(hostellerId);
    setShowModal(true);
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

  const getRooms = async (location_id, hostel_id, building_id) => {
    try {
      const res = await api.get(`${api_url}/master/rooms/getRooms/${location_id}/${hostel_id}/${building_id}`);
      setRooms(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAvailableSeats = async (room_id) => {
    try {
      const result = await api.get(
        `${api_url}/admin/master/rooms/getHostellers/${room_id}`
      );
      setAvailableSeats(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getHostellerBasedRoom = async (location_id, hostel_id, building_id, room_id) => {
    try {
      const result = await api.get(
        `${api_url}/admin/master/rooms/getHostellers/${location_id}/${hostel_id}/${building_id}/${room_id}`
      );
      setHosteller(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };


  const getAllHostellers = async () => {
    try {
      const res = await api.get(`${api_url}/admin/master/hostellers/list`);
      setList(res.data.data);
      setHosteller(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleView = (id) => {
    navigate(`/admin/master/hostellers/view/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/admin/master/hostellers/edit/${id}`);
  };

  const handleStatusClick = async (id, status) => {
    let text = "";
    let button = "";

    if (status === 1) {
      text = "Do you want to Inactivate the Hostellers?";
      button = "Yes, Inactivate!";
    } else {
      text = "Do you want to Activate the Hostellers?";
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
          const res = await api.post(`${api_url}/admin/master/hostellers/statusChange`, {
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
              ? "Hosteller has been inactivated."
              : "Hosteller has been activated.",
            "success"
          );
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Something went wrong!";

          if (errorMsg === "Seat is already occupied") {
            Swal.fire({
              title: "Seat Occupied",
              text: "Seats are already occupied. Please select new seats.",
              icon: "warning",
              confirmButtonText: "OK"
            }).then((result) => {
              if (result.isConfirmed) {
                openSeatSelectionModal(
                  id,
                );
              }
            });
          } else {
            Swal.fire("Oops...", errorMsg, "error");
          }
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Delete the Hosteller?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`${api_url}/admin/master/hostellers/delete`, { id });
          setList((prevList) => prevList.filter((item) => item._id !== id));
          Swal.fire(
            "Updated!",
            "Hosteller has been Deleted Successfully",
            "success"
          );
        } catch (err) {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      }
    });
  };


  const columns = [
    {
      name: "SNO", selector: (row, index) => (index + 1)
    },
    {
      name: "Name",
      selector: (row) => row.name || "-",
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no || "-",
      sortable: true,
    },
    {
      name: "Hostel",
      selector: (row) => row.hostel_id?.hostel_name || "-",
      sortable: true,
    },
    {
      name: "Room Number", selector: (row) => row.room_id?.room_no, sortable: true,
    },
    {
      name: "Seat Number", selector: (row) => row.seat_no?.seat_no, sortable: true,
    },
    {
      name: "Pending Advance", selector: (row) => row.total_advance_amount - row.advance_amount, sortable: true,
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

  const selectStyles = (isDark) => ({
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
        ? isDark
          ? "#374151"
          : "#e5e7eb"
        : isSelected
          ? isDark
            ? "#4b5563"
            : "#d1d5db"
          : "transparent",
      color: isDark ? "#fff" : "#1f2937",
      cursor: "pointer",
    }),
  });


  const arrowColor = isDark ? "#ffffff" : "#111827";
  useEffect(() => {
    getallLocation();
    getAllHostellers();
    setIsDark(theme == "dark");
  }, [theme]);

  return (
    <div className='min-h-screen p-6  '>
      <div className="border-b pb-3 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Hostellers List</h2>
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
              onClick={() => navigate("/admin/master/hostellers/add")}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="location_id"
                      className="block mb-2 text-gray-700 dark:text-white font-semibold"
                    >
                      Location
                    </label>
                    <Controller
                      name="location_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          options={locations.map((loc) => ({
                            value: loc.id,
                            label: loc.name,
                          }))}
                          placeholder="Select Location"
                          value={
                            locations
                              .map((loc) => ({ value: loc.id, label: loc.name }))
                              .find((opt) => opt.value === field.value) || null
                          }
                          onChange={(opt) => {
                            field.onChange(opt ? opt.value : "");
                            if (opt?.value) getAllHostels(opt.value);
                          }}
                          styles={selectStyles(isDark)}
                        />
                      )}
                    />
                  </div>

                  {/* Hostel */}
                  <div>
                    <label
                      htmlFor="hostel_id"
                      className="block mb-2 text-gray-700 dark:text-white font-semibold"
                    >
                      Hostel
                    </label>
                    <Controller
                      name="hostel_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          options={hostels.map((h) => ({
                            value: h.id,
                            label: h.hostel_name,
                          }))}
                          placeholder="Select Hostel"
                          value={
                            hostels
                              .map((h) => ({ value: h.id, label: h.hostel_name }))
                              .find((opt) => opt.value === field.value) || null
                          }
                          onChange={(opt) => {
                            field.onChange(opt ? opt.value : "");
                            const location_id = getValues("location_id");
                            if (opt?.value) getBuildings(location_id, opt.value);
                          }}
                          styles={selectStyles(isDark)}
                        />
                      )}
                    />
                  </div>

                  {/* Building */}
                  <div>
                    <label
                      htmlFor="building_id"
                      className="block mb-2 text-gray-700 dark:text-white font-semibold"
                    >
                      Building
                    </label>
                    <Controller
                      name="building_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          options={buildings.map((b) => ({
                            value: b._id,
                            label: b.building_name,
                          }))}
                          placeholder="Select Building"
                          value={
                            buildings
                              .map((b) => ({ value: b._id, label: b.building_name }))
                              .find((opt) => opt.value === field.value) || null
                          }
                          onChange={(opt) => {
                            field.onChange(opt ? opt.value : "");
                            const location_id = getValues("location_id");
                            const hostel_id = getValues("hostel_id");
                            if (opt?.value) getRooms(location_id, hostel_id, opt.value);
                          }}
                          styles={selectStyles(isDark)}
                        />
                      )}
                    />
                  </div>

                  {/* Room */}
                  <div>
                    <label
                      htmlFor="room_id"
                      className="block mb-2 text-gray-700 dark:text-white font-semibold"
                    >
                      Room No.
                    </label>
                    <Controller
                      name="room_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          options={rooms.map((r) => ({
                            value: r._id,
                            label: r.room_no,
                          }))}
                          placeholder="Select Room"
                          value={
                            rooms
                              .map((r) => ({ value: r._id, label: r.room_no }))
                              .find((opt) => opt.value === field.value) || null
                          }
                          onChange={(opt) => {
                            field.onChange(opt ? opt.value : "");
                            const location_id = getValues("location_id");
                            const hostel_id = getValues("hostel_id");
                            const building_id = getValues("building_id");
                            if (opt?.value) {
                              getAvailableSeats(opt.value);
                              getHostellerBasedRoom(location_id, hostel_id, building_id, opt.value);
                            }
                          }}
                          styles={selectStyles(isDark)}
                        />
                      )}
                    />
                  </div>

                  {/* Hosteller */}
                  <div>
                    <label
                      htmlFor="hosteller"
                      className="block mb-2 text-gray-700 dark:text-white font-semibold"
                    >
                      Hosteller
                    </label>
                    <Controller
                      name="hosteller"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          options={hosteller.map((h) => ({
                            value: h._id,
                            label: h.name,
                          }))}
                          placeholder="Select Hosteller"
                          value={
                            hosteller
                              .map((h) => ({ value: h._id, label: h.name }))
                              .find((opt) => opt.value === field.value) || null
                          }
                          onChange={(opt) => field.onChange(opt ? opt.value : "")}
                          styles={selectStyles(isDark)}
                        />
                      )}
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hostellerId={selectedHosteller}
        getAllHostellers={getAllHostellers}
        setShowModal={setShowModal}
      />

    </div>
  )
}

export default List
