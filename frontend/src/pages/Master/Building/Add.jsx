import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import api from '../../../api';
import Select from 'react-select';
import { ThemeContext } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Add = () => {
  const { setValue, getValues, register, reset, handleSubmit, control, formState: { errors, isSubmitting } } = useForm();
  const [locations, setLocations] = useState([]);
  const [hostels, setHostel] = useState([]);
  const api_url = import.meta.env.VITE_API_URL;
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post(`${api_url}/master/building/add`, data);
      toast.success(res.data.message);
      navigate('/master/building/list');
    } catch (err) {
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        console.error(err);
        toast.error("Something went wrong while saving");
      }
    }
  }

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

  const handleReset = () => {
    reset();
  }

  useEffect(() => {
    getallLocation();
    setIsDark(theme === "dark");
  }, [theme])
  return (
    <div className='min-h-screen bg-white dark:bg-[#101828] p-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='rounded shadow-lg p-6'>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Hostel</h2>
          <button
            type="button"
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={() => navigate('/master/building/list')}
          >
            Back
          </button>
        </div>
        <div className="flex gap-6 mb-4">
          <div className="flex-1">
            <label htmlFor="location_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Location <span className='text-red-500'>*</span></label>
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
            {errors.location_id && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.location_id.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="hostel_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Hostel <span className='text-red-500'>*</span></label>
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
            {errors.hostel_id && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.hostel_id.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="building" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Building <span className='text-red-500'>*</span></label>
            <input
              type="text"
              placeholder='Enter Building Name'
              className='w-75 md:w-100 input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
              ...register('building', {
                required: "Building Name is Required",
                validate: async (value) => {
                  const location_id = getValues("location_id");
                  const hostel_id = getValues("hostel_id");
                  if (!location_id || !hostel_id) return "Please select a location and Hostel";
                  try {
                    const res = await api.post(
                      `${api_url}/master/building/uniqueCheck`,
                      {
                        building: value,
                        location_id,
                        hostel_id
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
              errors.building && <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.building.message}
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
  )
}

export default Add
