import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import Select from "react-select";
import { ThemeContext } from "../../../context/ThemeContext";

const Edit = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [locations, setLocations] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const [loading, setLoading] = useState(true);

  // Fetch all locations
  const getAllLocation = async () => {
    try {
      const res = await api.get(`${api_url}/master/location/list`);
      setLocations(res.data.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const fetchHostel = async () => {
    try {
      const res = await api.get(`${api_url}/master/hostel/view/${id}`);
      const loc = res.data.data;

      reset({
        location_id: loc.location_id,
        hostel: loc.hostel_name,
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

  useEffect(() => {
    fetchHostel();
    getAllLocation();
    setIsDark(theme === "dark");
  }, [id, theme]);

  const onSubmit = async (data) => {
    try {
      const res = await api.post(`${api_url}/master/hostel/edit/submit`, data);
      toast.success(res.data.message);
      navigate("/master/hostel/list");
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
    reset();
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#101828] p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="shadow rounded-lg p-6"
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">
            Edit Hostel
          </h2>
          <button
            type="button"
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={() => navigate("/master/hostel/list")}
          >
            Back
          </button>
        </div>

        {/* Hidden ID Field */}
        <input type="hidden" {...register("id")} />

        <div className="flex flex-col md:flex-row md:gap-3">
          <div className="mb-4 md:flex-1">
            <label
              htmlFor="location_id"
              className="block mb-2 text-gray-700 font-semibold dark:text-white"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <Controller
              name="location_id"
              control={control}
              rules={{ required: "Location is required" }}
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
                      color: isDark ? "#fff" : "#1f2937",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDark ? "#111827" : "#fff",
                      color: isDark ? "#fff" : "#1f2937",
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

          <div className="mb-4 md:flex-1">
            <label
              htmlFor="hostel"
              className="block mb-2 text-gray-700 font-semibold dark:text-white"
            >
              Hostel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Hostel Name"
              className="w-full input-style focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
              {...register("hostel", {
                required: "Hostel is required",
                validate: async (value) => {
                  try {
                    const location_id = getValues("location_id");
                    const res = await api.post(
                      `${api_url}/master/hostel/uniqueCheck`,
                      {
                        location_id: location_id,
                        hostel_name: value,
                        id: id,
                      }
                    );
                    if (res.data.message === "Available") return true;
                    return res.data.message;
                  } catch (err) {
                    return err.message;
                  }
                },
              })}
            />
            {errors.hostel && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.hostel.message}
              </p>
            )}
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
