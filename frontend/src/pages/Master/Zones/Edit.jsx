import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import Select from 'react-select';
import { ThemeContext } from '../../../context/ThemeContext';
import { toast } from "react-toastify";
import MapRadiusSelector from './MapRadiusSelector';

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleSubmit, register, setValue, getValues, reset, control, formState: { errors, isSubmitting } } = useForm();
  const api_url = import.meta.env.VITE_API_URL;

  const [locations, setLocations] = useState([]);
  const [hostels, setHostel] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const [loading, setLoading] = useState(true);

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

  const getAllLocations = async () => {
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

  const fetchZone = async () => {
    try {
      const res = await api.get(`${api_url}/master/zone/view/${id}`);
      const zone = res.data.data;

      reset({
        id: zone._id,
        location_id: zone.location_id._id,
        hostel_id: zone.hostel_id._id,
        zone_lat: zone.zone_lat,
        zone_lng: zone.zone_lng,
      });


      getAllHostels(zone.location_id._id);
    } catch (err) {
      toast.error("Failed to fetch zone data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post(`${api_url}/master/zone/edit/submit`, data);
      toast.success(res.data.message);
      navigate("/master/zone/list");
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
      zone_lat: "",
      zone_lng: "",
    });
  };

  useEffect(() => {
    getAllLocations();
    fetchZone();
    setIsDark(theme === "dark");
  }, [theme]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#101828] p-6">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="shadow rounded-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Edit Zone</h2>
          <button
            type="button"
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={() => navigate("/master/zone/list")}
          >
            Back
          </button>
        </div>

        <input type="hidden" {...register('id')} value={getValues('id') || id} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Location <span className='text-red-500'>*</span>
            </label>
            <Controller
              name="location_id"
              control={control}
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <Select
                  options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                  value={locations.map(loc => ({ value: loc.id, label: loc.name })).find(opt => opt.value === field.value) || null}
                  onChange={option => {
                    field.onChange(option?.value || "");
                    if (option?.value) getAllHostels(option.value);
                  }}
                  placeholder="Select Location"
                  styles={customSelectStyles}
                />
              )}
            />
            {errors.location_id && <p className="text-red-500 text-sm mt-1 font-bold">{errors.location_id.message}</p>}
          </div>

          {/* Hostel */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Hostel <span className='text-red-500'>*</span>
            </label>
            <Controller
              name="hostel_id"
              control={control}
              rules={{
                required: "Hostel is required",
                validate: async (value) => {
                  const location_id = getValues('location_id');
                  const id = getValues('id');
                  try {
                    const res = await api.post(`${api_url}/master/zone/uniqueCheck`, { hostel_id: value, location_id, id });
                    return res.data.message === 'Available' ? true : res.data.message || "This hostel already exists";
                  } catch {
                    return "Validation failed, please try again";
                  }
                }
              }}
              render={({ field }) => (
                <Select
                  options={hostels.map(hostel => ({ value: hostel.id, label: hostel.hostel_name }))}
                  placeholder="Select Hostel"
                  menuPortalTarget={document.body}
                  value={hostels.map(hostel => ({ value: hostel.id, label: hostel.hostel_name })).find(opt => opt.value === field.value) || null}
                  onChange={option => field.onChange(option?.value || "")}
                  styles={{
                    control: (base) => ({ ...base, backgroundColor: isDark ? "#1f2937" : "#fff", borderColor: isDark ? "#374151" : "#d1d5db" }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    singleValue: (base) => ({ ...base, color: isDark ? "#f9fafb" : "#111827" }),
                    menu: (base) => ({ ...base, backgroundColor: isDark ? "#111827" : "#fff", color: isDark ? "#f9fafb" : "#111827" }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isFocused ? (isDark ? "#374151" : "#e5e7eb") : isSelected ? (isDark ? "#4b5563" : "#d1d5db") : "transparent",
                      color: isDark ? "#fff" : "#1f2937",
                      cursor: "pointer",
                    }),
                  }}
                />
              )}
            />
            {errors.hostel_id && <p className="text-red-500 text-sm mt-1 font-bold">{errors.hostel_id.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Latitude <span className='text-red-500'>*</span>
            </label>
            <input
              readOnly
              type="text"
              placeholder="Enter Latitude"
              className="w-full input-style"
              {...register('zone_lat', { required: "Latitude is required" })}
            />
            {errors.zone_lat && <p className="text-red-500 text-sm mt-1 font-bold">{errors.zone_lat.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Longitude <span className='text-red-500'>*</span>
            </label>
            <input
              readOnly
              type="text"
              placeholder="Enter Longitude"
              className="w-full input-style"
              {...register('zone_lng', { required: "Longitude is required" })}
            />
            {errors.zone_lng && <p className="text-red-500 text-sm mt-1 font-bold">{errors.zone_lng.message}</p>}
          </div>
        </div>

        <div className="col-span-1 md:col-span-3 mb-3">
          <MapRadiusSelector
            lat={getValues("zone_lat")}
            lng={getValues("zone_lng")}
            radius={300}
            readOnly={false}
            onChange={({ lat, lng }) => {
              setValue("zone_lat", lat);
              setValue("zone_lng", lng);
            }}
          />
        </div>

        <div className="flex space-x-3">
          <button type="reset" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition" disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
