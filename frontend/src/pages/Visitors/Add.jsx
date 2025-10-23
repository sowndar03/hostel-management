import React, { useState, useEffect, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { checkUserRole } from '../../utils/helper';
import { CONSTANTS } from '../../utils/CONSTANTS';

const Add = () => {
  const api_url = import.meta.env.VITE_API_URL;
  const { handleSubmit, register, reset, control, formState: { errors, isSubmitting } } = useForm();
  const [hosteller, setHosteller] = useState([]);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const [startDate, setStartDate] = useState("");
  const hasAdmin = checkUserRole(CONSTANTS.ROLE_ADMIN);

  const onSubmit = async (data) => {
    try {
      const result = await api.post(`${api_url}/admin/check-in-out/store`, data);
      toast.success('In/Out Entry Added Successfully');
    } catch (err) {
      console.log(err.message);
    }
    navigate('/check-in-out/list');
  };

  const handleReset = () => {
    reset();
  };

  const getAllHosteller = async () => {
    try {
      const result = await api.get(`${api_url}/admin/check-in-out/hosteller/list`, {
        params: { hasAdmin },
      });

      setHosteller(result.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAllHosteller();
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <div className='min-h-screen mt-5 px-4 md:px-10'>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="shadow rounded-lg p-6 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Hosteller In/Out Management</h2>
          <button
            type="button"
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={() => navigate('/check-in-out/list')}
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Select Date <span className="text-red-500">*</span>
            </label>
            <Controller
              name="date"
              control={control}
              defaultValue={new Date()}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="dd-MM-yyyy"
                  minDate={new Date()}
                  maxDate={new Date(new Date().setDate(new Date().getDate() + 2))}
                  placeholderText="Select a date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1 font-bold">{errors.date.message}</p>
            )}
          </div>


          <div className="mb-4">
            <label htmlFor="hosteller_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>
              Select Hostellers Going Out <span className='text-red-500'>*</span>
            </label>
            <Controller
              name="hosteller_id"
              control={control}
              defaultValue={[]}
              rules={{ required: "Please select at least one hosteller" }}
              render={({ field }) => {
                const options = hosteller.map(h => ({ value: h._id, label: h.name }));
                const selectedOptions = options.filter(opt => field.value.includes(opt.value));
                return (
                  <Select
                    options={options}
                    value={selectedOptions}
                    onChange={(selected) => {
                      const values = selected ? selected.map(opt => opt.value) : [];
                      field.onChange(values);
                    }}
                    placeholder="Select Hostellers"
                    isMulti
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                        color: isDark ? '#f9fafb' : '#111827',
                        '&:hover': {
                          borderColor: isDark ? '#4b5563' : '#9ca3af'
                        },
                        '&:focus': {
                          borderColor: isDark ? '#6366f1' : '#3b82f6',
                          boxShadow: isDark ? '0 0 0 1px #6366f1' : '0 0 0 1px #3b82f6'
                        }
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                        boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected 
                          ? (isDark ? '#6366f1' : '#3b82f6')
                          : state.isFocused 
                          ? (isDark ? '#334155' : '#f3f4f6')
                          : isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#f9fafb' : '#111827',
                        '&:hover': {
                          backgroundColor: isDark ? '#334155' : '#f3f4f6'
                        }
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: isDark ? '#374151' : '#e5e7eb'
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: isDark ? '#f9fafb' : '#111827'
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        color: isDark ? '#f9fafb' : '#111827',
                        '&:hover': {
                          backgroundColor: isDark ? '#ef4444' : '#dc2626',
                          color: '#ffffff'
                        }
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: isDark ? '#f9fafb' : '#111827'
                      }),
                      input: (provided) => ({
                        ...provided,
                        color: isDark ? '#f9fafb' : '#111827'
                      })
                    }}
                  />
                );
              }}
            />
            {errors.hosteller_id && (
              <p className="text-red-500 text-sm mt-1 font-bold">{errors.hosteller_id.message}</p>
            )}
          </div>

          <div className="mb-4 col-span-full">
            <label htmlFor="purpose_of_visit" className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Purpose Of Visit <span className='text-red-500'>*</span>
            </label>
            <textarea
              id="purpose_of_visit"
              {...register("purpose_of_visit", {
                required: "Purpose of Visit is required",
                minLength: { value: 5, message: "Purpose of Visit must be at least 5 characters" }
              })}
              rows="4"
              placeholder="Enter the Purpose of visit..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.purpose_of_visit && (
              <p className="text-red-500 text-sm mt-1 font-bold">{errors.purpose_of_visit.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="check_out" className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Mark it as Check Out <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                id="check_out"
                type="checkbox"
                {...register("check_out", { required: "Check Out is required" })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="check_out" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Check Out
              </label>
            </div>
            {errors.check_out && (
              <p className="text-red-500 text-sm mt-1 font-bold">{errors.check_out.message}</p>
            )}
          </div>

        </div>

        <div className="flex space-x-3 mt-4">
          <button
            type="button"
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

export default Add;
