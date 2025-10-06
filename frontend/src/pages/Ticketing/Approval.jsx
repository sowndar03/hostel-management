import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { checkUserRole, displayDateformat, getImageUrl, getTicketStatus, todayDateandTime } from "../../utils/helper";
import { AuthContext } from "../../context/AuthContext";
import { CONSTANTS } from "../../utils/CONSTANTS";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const api_url = import.meta.env.VITE_API_URL;

const View = () => {
  const hasAdminRole = checkUserRole(CONSTANTS.ROLE_ADMIN);
  const hasUserRole = checkUserRole(CONSTANTS.ROLE_USER);

  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const { username } = useContext(AuthContext);
  const { register, handleSubmit, setError, setValue, clearErrors, formState: { isSubmitting, errors } } = useForm();
  const [issues, setIssus] = useState([]);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await api.get(`${api_url}/ticketing/view/${id}`);
      const ticket_id = res.data.data._id;
      setTickets(res.data.data);
      console.log(res.data.data);
      setValue("id", res.data.data._id);
      const issues_files = await api.get(`${api_url}/ticketing/issueFiles/${id}`);
      setIssus(issues_files.data.data);
    } catch (err) {
      console.error("Error fetching hostel:", err);
    }
  };

  const handleReset = () => {

  }

  const onAcknowledgement = (data) => {
    try {
      const result = api.post(`${api_url}/ticketing/first_approval`, data);
      toast.success("Updated Successfully");
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err.message);
    }
    navigate('/ticketing/list');
    // - this is relative path
  }

  const onClose = (data) => {
    try {
      const result = api.post(`${api_url}/ticketing/close_approval`, data);
      toast.success("Updated Successfully");
    } catch (err) {
      toast.error("Something went wrong");
    }
    navigate('/ticketing/list');
  }

  const onUserClose = (data) => {
    try {
      const result = api.post(`${api_url}/ticketing/final_approval`, data);
      toast.success("Updated Successfully");
    } catch (err) {
      toast.error("Something went wrong");
    }
    navigate('/ticketing/list');
  }

  // Relative path = “Go from where I am now.”
  // Absolute path = “Go from the homepage root(/).”

  useEffect(() => {
    fetchTickets();
    setIsDark(theme === "dark");
  }, [id, theme]);

  return (
    <div className="min-h-screen dark:bg-[#101828] p-6">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-lg font-bold text-black dark:text-white">Ticket Details</h2>
        <button
          type="button"
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => navigate("/ticketing/list")}
        >
          Back
        </button>
      </div>

      <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 shadow-sm">
        <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
          Ticket Details
        </h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">
              Name
            </label>
            <p className="w-full  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {tickets.hosteller_id?.name}
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">
              Hostel
            </label>
            <p className="w-full  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {tickets.hosteller_id?.hostel_id?.hostel_name}
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">
              Room No.
            </label>
            <p className="w-full  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
              {tickets.hosteller_id?.room_id.room_no}
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">
              Concern
            </label>
            <textarea
              className="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 rounded"
              value={tickets?.concern || ''}
              readOnly
            />
          </div>
          <div className="mb-4 mt-2 col-span-2">
            <label className="block mb-1 text-black dark:text-white font-semibold">
              Status
            </label>
            {getTicketStatus(tickets.ticket_status)}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black dark:text-white font-semibold">
              Image
            </label>
            <div className="flex flex-wrap gap-2">
              {issues.map((issue, index) => (
                <a
                  key={index}
                  href={getImageUrl(issue.file_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={getImageUrl(issue.file_path)}
                    alt={issue.description || `Issue image ${index + 1}`}
                    className="w-32 h-32 object-cover rounded cursor-pointer"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {
          tickets.acknowledged_by && (
            <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
              Acknowledgment Details
            </h6>
          )}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {tickets.acknowledged_by && (
            <div className="mb-4 ps-2 col-span-1">
              <label className="block text-black dark:text-white font-semibold">
                Acknowledged By
              </label>
              <p className="w-full  text-gray-700 dark:text-gray-200 py-2 rounded">
                {tickets.acknowledged_by?.name}
              </p>
            </div>
          )
          }
          {tickets.acknowledged_at && (
            <div className="mb-4 ps-2 col-span-2">
              <label className="block text-black dark:text-white font-semibold">
                Acknowledged At
              </label>
              <p className="w-full  text-gray-700 dark:text-gray-200 py-2 rounded">
                {displayDateformat(tickets.acknowledged_at)}
              </p>
            </div>
          )
          }
          {tickets.acknowledgment_remarks && (
            <div className="mb-4 ps-2">
              <label className="block text-black dark:text-white font-semibold">
                Remarks
              </label>
              <p className="w-full  text-gray-700 dark:text-gray-200 py-2 rounded">
                {tickets.acknowledgment_remarks}
              </p>
            </div>
          )
          }
        </div>

        {tickets.closed_by && (
          <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
            Closed Details
          </h6>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {tickets.closed_by && (
            <div className="mb-4 ps-2 col-span-1">
              <label className="block text-black dark:text-white font-semibold">
                Closed By
              </label>
              <p className="w-full  text-gray-700 dark:text-gray-200 py-2 rounded">
                {tickets.closed_by?.name}
              </p>
            </div>
          )
          }
          {tickets.closed_at && (
            <div className="mb-4 ps-2 col-span-2">
              <label className="block text-black dark:text-white font-semibold">
                Closed At
              </label>
              <p className="w-full  text-gray-700 dark:text-gray-200 py-2 rounded">
                {displayDateformat(tickets.closed_at)}
              </p>
            </div>
          )
          }
          {tickets.closed_remarks && (
            <div className="mb-4 ps-2">
              <label className="block text-black dark:text-white font-semibold">
                Remarks
              </label>
              <p className="w-full  text-gray-700 dark:text-gray-200 py-2 rounded">
                {tickets.closed_remarks}
              </p>
            </div>
          )
          }
        </div>

      </div>

      {/* First approval */}
      {((tickets.ticket_status == CONSTANTS.OPEN || tickets.ticket_status == CONSTANTS.REOPEN) && hasAdminRole) && (
        <form onSubmit={handleSubmit(onAcknowledgement)}>
          <input type="hidden" {...register('id')} />
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 shadow-sm">
            <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
              Approval
            </h6>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ms-2">
              <div className="mb-3 mt-2">
                <label className="block mb-1 text-black dark:text-white font-semibold">
                  Name
                </label>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  {username}
                </div>
              </div>
              <div className="mb-3 mt-2">
                <label className="block mb-1 text-black dark:text-white font-semibold">
                  Date
                </label>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  {todayDateandTime()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label htmlFor="">Ticket Status</label>
                <div className="flex items-center mb-3 mt-3">
                  <input
                    id="acknowledgment"
                    type="radio"
                    value={CONSTANTS.INPROCESS}
                    {
                    ...register('ticket_status', {
                      required: 'Ticket Status is Required'
                    })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                   focus:ring-blue-500 dark:focus:ring-blue-600 
                   dark:ring-offset-gray-800 focus:ring-2 
                   dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="acknowledgment"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Acknowledgement
                  </label>
                </div>
                {tickets.ticket_status == CONSTANTS.OPEN && (
                  <div className="flex items-center mb-4">
                    <input
                      id="no_issues_solved"
                      type="radio"
                      value={CONSTANTS.NO_ISSUES_SOLVED}
                      {
                      ...register('ticket_status', {
                        required: 'Ticket Status is Required'
                      })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                   focus:ring-blue-500 dark:focus:ring-blue-600 
                   dark:ring-offset-gray-800 focus:ring-2 
                   dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="no_issues_solved"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      No Issues - Solved
                    </label>
                  </div>
                )
                }
                <div className="flex items-center mb-4">
                  <input
                    id="issues_solved"
                    type="radio"
                    value={CONSTANTS.CLOSED}
                    {
                    ...register('ticket_status', {
                      required: 'Ticket Status is Required'
                    })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                   focus:ring-blue-500 dark:focus:ring-blue-600 
                   dark:ring-offset-gray-800 focus:ring-2 
                   dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="issues_solved"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Issues - Solved
                  </label>
                </div>
                {
                  errors.ticket_status && (
                    <p className="text-red-500 text-sm mt-1 font-bold">{errors.ticket_status.message}</p>
                  )
                }
              </div>

              <div className="col-span-2 mb-4 p-2">
                <label
                  htmlFor="remarks"
                  className="block mb-2 text-black dark:text-white font-semibold"
                >
                  Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="remarks"
                  {...register("remarks", {
                    required: "Remarks is required",
                    minLength: {
                      value: 5,
                      message: "Remark must be at least 5 characters",
                    },
                  })}
                  rows="4"
                  placeholder="Enter your Remarks"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 
                 rounded 
                 text-gray-700 dark:text-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.remarks && (
                  <p className="text-red-500 text-sm mt-1 font-bold">
                    {errors.remarks.message}
                  </p>
                )}
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
            </div>
          </div>
        </form>
      )
      }

      {/* second approval */}
      {(tickets.ticket_status == CONSTANTS.INPROCESS && hasAdminRole) && (
        <form onSubmit={handleSubmit(onClose)}>
          <input type="hidden" {...register('id')} />
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 shadow-sm">
            <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
              Ticket Close
            </h6>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ms-2">
              <div className="mb-3 mt-2">
                <label className="block mb-1 text-black dark:text-white font-semibold">
                  Name
                </label>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  {username}
                </div>
              </div>
              <div className="mb-3 mt-2">
                <label className="block mb-1 text-black dark:text-white font-semibold">
                  Date
                </label>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  {todayDateandTime()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-3 mb-4 p-2">
                <label
                  htmlFor="remarks"
                  className="block mb-2 text-black dark:text-white font-semibold"
                >
                  Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="remarks"
                  {...register("remarks", {
                    required: "Remarks is required",
                    minLength: {
                      value: 5,
                      message: "Remark must be at least 5 characters",
                    },
                  })}
                  rows="4"
                  placeholder="Enter your Remarks"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 
                 rounded 
                 text-gray-700 dark:text-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.remarks && (
                  <p className="text-red-500 text-sm mt-1 font-bold">
                    {errors.remarks.message}
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
          </div>
        </form>
      )
      }

      {/* third approval */}
      {(tickets.ticket_status == CONSTANTS.CLOSED && hasUserRole) && (
        <form onSubmit={handleSubmit(onUserClose)}>
          <input type="hidden" {...register('id')} />
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 shadow-sm">
            <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
              Ticket Close
            </h6>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ms-2">
              <div className="mb-3 mt-2">
                <label className="block mb-1 text-black dark:text-white font-semibold">
                  Name
                </label>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  {username}
                </div>
              </div>
              <div className="mb-3 mt-2">
                <label className="block mb-1 text-black dark:text-white font-semibold">
                  Date
                </label>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  {todayDateandTime()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label htmlFor="">Ticket Status</label>
                <div className="flex items-center mb-3 mt-3">
                  <input
                    id="closed"
                    type="radio"
                    value={CONSTANTS.USER_CLOSED}
                    {
                    ...register('ticket_status', {
                      required: 'Ticket Status is Required'
                    })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                   focus:ring-blue-500 dark:focus:ring-blue-600 
                   dark:ring-offset-gray-800 focus:ring-2 
                   dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="closed"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Closed
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="reopen"
                    type="radio"
                    value={CONSTANTS.REOPEN}
                    {
                    ...register('ticket_status', {
                      required: 'Ticket Status is Required'
                    })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                   focus:ring-blue-500 dark:focus:ring-blue-600 
                   dark:ring-offset-gray-800 focus:ring-2 
                   dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="reopen"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    REOPEN
                  </label>
                </div>
                {
                  errors.ticket_status && (
                    <p className="text-red-500 text-sm mt-1 font-bold">{errors.ticket_status.message}</p>
                  )
                }
              </div>
              <div className="col-span-2 mb-4 p-2">
                <label
                  htmlFor="remarks"
                  className="block mb-2 text-black dark:text-white font-semibold"
                >
                  Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="remarks"
                  {...register("remarks", {
                    required: "Remarks is required",
                    minLength: {
                      value: 5,
                      message: "Remark must be at least 5 characters",
                    },
                  })}
                  rows="4"
                  placeholder="Enter your Remarks"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 
                 rounded 
                 text-gray-700 dark:text-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.remarks && (
                  <p className="text-red-500 text-sm mt-1 font-bold">
                    {errors.remarks.message}
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
          </div>
        </form>
      )
      }
    </div>
  );
};

export default View;
