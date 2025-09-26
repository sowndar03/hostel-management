import React, { useContext, useEffect, useState } from 'react'
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Add = () => {
  const [hosteller, setHosteller] = useState(null);
  const { user } = useContext(AuthContext);
  const api_url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { register, handleSubmit, setError, setValue, clearErrors, formState: { isSubmitting, errors } } = useForm();
  const [issues, setIssues] = useState([]);

  const getUserDetails = async () => {
    const id = user._id;
    try {
      const res = await api.get(`${api_url}/admin/master/hostellers/userId/${id}`);
      setHosteller(res.data.data);
      setValue("id", id);
      setValue("hosteller_id", res.data.data._id);

    } catch (err) {
      console.log(err.message);
    }
  }

  const handleIssue = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      file: file,
      url: URL.createObjectURL(file),
    }))
    setIssues(prev => [...prev, ...newPreviews]);
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  const onsubmit = async (data) => {
    if (issues.length === 0) {
      setError("issue", { type: "manual", message: "Please add at least one image" });
      return;
    } else {
      try {
        const formData = new FormData();
        formData.append("concern", data.concern);
        formData.append("id", data.id);
        formData.append("hosteller_id", data.hosteller_id);

        issues.forEach((img) => {
          formData.append("issue", img.file);
        });

        const res = await api.post(
          `${api_url}/ticketing/add/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.success(res.data.message);
        navigate("/ticketing/list");
      } catch (err) {
        console.log(err.message);
      }
    }

  }

  const handleReset = () => {

  }

  const removeIssue = (index) => {
    setIssues(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="min-h-screen dark:bg-[#101828] p-6">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-lg font-bold text-black dark:text-white">Raise a Ticket</h2>
        <button
          type="button"
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => navigate("/ticketing/list")}
        >
          Back
        </button>
      </div>

      <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">Name</label>
            <p className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {hosteller?.name || "Loading..."}
            </p>
          </div>
        </div>
        <input
          type="hidden"
          {...register("id")}
          placeholder="ID"
        />
        <input
          type="hidden"
          {...register("hosteller_id")}
          placeholder="Hosteller ID"
        />
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-4 p-2">
            <label
              htmlFor="concern"
              className="block mb-2 text-black dark:text-white font-semibold"
            >
              Raise a Concern <span className='text-red-500'>*</span>
            </label>
            <textarea
              id="concern"
              {...register("concern", {
                required: "Concern is required", minLength: {
                  value: 5, message: "Concern must be atleast 5 Characters"
                }
              })}
              rows="4"
              placeholder="Describe your issue or request..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 
               rounded 
               text-gray-700 dark:text-gray-200 
               focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {
              errors.concern && (
                <p className="text-red-500 text-sm mt-1 font-bold">{errors.concern.message}</p>
              )
            }
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-white font-semibold">
              Issue <span className="text-red-500">*</span>
            </label>

            {/* Hidden input for upload */}
            <input
              type="file"
              accept="image/*"
              id="issue"
              multiple
              className="hidden"
              onChange={handleIssue}
            />
            <div className="flex flex-wrap gap- mb-4">
              {issues && issues.map((img, index) => (
                <div
                  key={index}
                  className="relative w-28 h-28 border rounded-md overflow-hidden m-2"
                >
                  <img
                    src={img.url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeIssue(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Plus Icon */}
              <label
                htmlFor="issue"
                className="flex items-center justify-center w-28 h-28 border-2 border-dashed border-gray-400 
               rounded-md cursor-pointer hover:border-indigo-500 m-2"
              >
                <AiOutlinePlus className="w-6 h-6 text-gray-500" />
              </label>
            </div>
            {
              errors.issue && (
                <p className="text-red-500 text-sm mt-1 font-bold">{errors.issue.message}</p>
              )
            }
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
    </div>
  )
}

export default Add
