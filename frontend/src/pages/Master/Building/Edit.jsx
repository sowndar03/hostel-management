import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import api from '../../../api';
import Select from 'react-select';

const Edit = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, getValue, setValue, reset, control, formState: { errors, isSubmitting } } = useForm();
  const api_url = import.meta.env.VITE_API_URL;
  const [locations, setLocations] = useState();
  const [hostels, setHostel] = useState([]);
  const {theme}  =  useCo

  const fetchHostel = async () => {
    try {
      const res = await api.get(`${api_url}/master/building/view/${id}`);
      const loc = res.data.data;

      reset({
        location_id: loc.location_id._id,
        hostel_id: loc.hostel_id._id,
        building: loc.building_name._id,
        id: loc.id,
      });

      setValue("id", loc.id);
    } catch (err) {
      console.error("Error fetching hostel:", err);
      toast.error("Failed to fetch hostel data");
    } finally {
      setLoading(false);
    }
  };
  const getallLocation = async () => {
    try {
      const res = await api.get(`${api_url}/master/location/list`);
      // setLocations(res.data.data);
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

  const onSubmit = (data) => {

  }

  useEffect(() => {
    getallLocation();
  }, [])
  return (
    <div className="min-h-screen bg-white dark:bg-[#101828] p-4">
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
            onClick={() => navigate("/master/building/list")}
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
                  // options={locations.map((location) => ({
                  //   value: location.id,
                  //   label: location.name
                  // }))}
                  placeholder="Select Location"
                  // value={
                  //   locations
                  //     .map((loc) => ({ value: loc.id, label: loc.name }))
                  //     .find((option) => option.value === field.value) || null
                  // }
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
      </form>
    </div>
  )
}

export default Edit
