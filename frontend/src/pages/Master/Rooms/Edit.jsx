import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import Select from 'react-select';
import { ThemeContext } from '../../../context/ThemeContext';
import { toast } from "react-toastify";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleSubmit, register, getValues, reset, control, formState: { errors, isSubmitting } } = useForm();
  const api_url = import.meta.env.VITE_API_URL;

  const [locations, setLocations] = useState([]);
  const [hostels, setHostel] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState([]);

  const customSelectStyles = useMemo(() => ({
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderColor: isDark ? "#374151" : "#d1d5db",
    }),
    singleValue: (base) => ({ ...base, color: isDark ? "#f9fafb" : "#111827" }),
    menu: (base) => ({ ...base, backgroundColor: isDark ? "#111827" : "#fff" }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isFocused
        ? (isDark ? "#374151" : "#e5e7eb")
        : isSelected
          ? (isDark ? "#4b5563" : "#d1d5db")
          : "transparent",
      color: isDark ? "#fff" : "#1f2937",
      cursor: "pointer",
    }),
  }), [isDark]);

  const getallLocation = async () => {
    try {
      const res = await api.get(`${api_url}/master/location/list`);
      setLocations(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllHostels = async (location_id) => {
    try {
      const res = await api.get(`${api_url}/master/hostel/getHostel/${location_id}`);
      setHostel(res.data.data || []);
    } catch (err) {
      console.error(err);
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


  const fetchHostel = async () => {
    try {
      const res = await api.get(`${api_url}/master/rooms/view/${id}`);
      const rooms = res.data.data;
      reset({
        id: rooms._id,
        location_id: rooms.location_id._id,
        hostel_id: rooms.hostel_id._id,
        building_id: rooms.building_id._id,
        room_no: rooms.room_no,
        room_count: rooms.room_count,
      });

      getAllHostels(rooms.location_id._id);
      getBuildings(rooms.location_id._id, rooms.hostel_id._id);
    } catch (err) {
      console.error("Error fetching building:", err);
      toast.error("Failed to fetch building data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post(`${api_url}/master/rooms/edit/submit`, data);
      toast.success(res.data.message);
      navigate("/master/room/list");
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        console.error(err);
        toast.error("Something went wrong while saving");
      }
    }
  };

  const handleReset = () => {
    reset({
      location_id: null,
      hostel_id: null,
      building: ""
    });
  };

  useEffect(() => {
    getallLocation();
    fetchHostel();
    setIsDark(theme === "dark");
  }, [theme]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#101828] p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="shadow rounded-lg p-6"
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">
            Edit Building
          </h2>
          <button
            type="button"
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={() => navigate("/master/room/list")}
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Location */}
          <div className="">
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Location <span className='text-red-500'>*</span>
            </label>
            <Controller
              name="location_id"
              control={control}
              defaultValue={null}
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <Select
                  options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                  value={locations
                    .map(loc => ({ value: loc.id, label: loc.name }))
                    .find(opt => opt.value === field.value) || null}
                  onChange={option => {
                    field.onChange(option?.value || "");
                    if (option?.value) getAllHostels(option.value);
                  }}
                  placeholder="Select Location"
                  styles={customSelectStyles}
                />
              )}
            />
            {errors.location_id && (
              <p className="text-red-500 text-sm mt-1 font-bold">{errors.location_id.message}</p>
            )}
          </div>

          {/* Hostel */}
          <div className="">
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Hostel <span className='text-red-500'>*</span>
            </label>
            <Controller
              name="hostel_id"
              control={control}
              defaultValue={null}
              rules={{ required: "Hostel is required" }}
              render={({ field }) => (
                <Select
                  options={hostels.map(h => ({ value: h.id, label: h.hostel_name }))}
                  value={hostels
                    .map(h => ({ value: h.id, label: h.hostel_name }))
                    .find(opt => opt.value === field.value) || null}
                  onChange={option => field.onChange(option?.value || "")}
                  placeholder="Select Hostel"
                  styles={customSelectStyles}
                />
              )}
            />
            {errors.hostel_id && (
              <p className="text-red-500 text-sm mt-1 font-bold">{errors.hostel_id.message}</p>
            )}
          </div>

          {/* Building */}
          <div className="">
            <label htmlFor="hostel_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Building <span className='text-red-500'>*</span></label>
            <Controller
              name='building_id'
              defaultValue={null}
              control={control}
              rules={{ required: "Building is required" }}
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
              ...register('room_no', {
                required: "Room Number is Required",
                validate: async (value) => {
                  const location_id = getValues("location_id");
                  const hostel_id = getValues("hostel_id");
                  const building_id = getValues("building_id");
                  if (!location_id || !hostel_id) return "Please select a location and Hostel";
                  try {
                    const res = await api.post(
                      `${api_url}/master/rooms/uniqueCheck`,
                      {
                        room_no: value,
                        building_id,
                        location_id,
                        hostel_id,
                        id
                      }
                    );
                    if (res.data.message === 'Available') {
                      return true;
                    }
                    return res.data.message;
                  } catch (err) {
                    return err.message;
                  }
                },
              })

              } />
            {
              errors.room_no && <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.room_no.message}
              </p>
            }
          </div>
          <div className="">
            <label htmlFor="building" className='block mb-2 text-gray-700 dark:text-white font-semibold'>People Count<span className='text-red-500'>*</span></label>
            <input
              type="text"
              placeholder='Enter Room Count'
              className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
              ...register('room_count', {
                required: "Room Count is Required",
              })

              } />
            {
              errors.room_count && <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.room_count.message}
              </p>
            }
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="reset"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
