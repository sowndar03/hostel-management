import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { displayDateformat, getImageUrl, getTicketStatus } from "../../utils/helper";

const api_url = import.meta.env.VITE_API_URL;

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const [issues, setIssus] = useState([]);

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await api.get(`${api_url}/ticketing/view/${id}`);
      const ticket_id = res.data.data._id;
      setTickets(res.data.data);
      const issues_files = await api.get(`${api_url}/ticketing/issueFiles/${id}`);
      setIssus(issues_files.data.data);
    } catch (err) {
      console.error("Error fetching hostel:", err);
    }
  };
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
    </div>
  );
};

export default View;
