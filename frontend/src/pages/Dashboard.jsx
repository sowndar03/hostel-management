import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// Map ticket statuses to colors
const STATUS_COLORS = {
    "OPEN": "#F87171",           // red
    "REOPEN": "#F87171",         // red
    "IN PROCESS": "#FACC15",     // yellow
    "CLOSED": "#34D399",         // green
    "NO ISSUES SOLVED": "#9CA3AF", // gray
    "USER CLOSED": "#3B82F6"     // blue
};

const Dashboard = () => {
    const [ticketopenClose, setticketopenClose] = useState([]);
    const [ticketStatusWise, setTicketStatusWise] = useState([]);
    const api_url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Fetch Open vs Close tickets
    const ticketOpenClose = async () => {
        try {
            const result = await api.get(`${api_url}/dashboard/ticketOpenClose`);
            setticketopenClose(result.data.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    // Fetch ticket status wise
    const loadticketStatusWise = async () => {
        try {
            const result = await api.get(`${api_url}/dashboard/tickeStatusWise`);
            setTicketStatusWise(result.data.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        ticketOpenClose();
        loadticketStatusWise();
    }, []);

    // Helper to get color based on status
    const getColor = (statusName) => STATUS_COLORS[statusName] || "#E5E7EB"; // fallback gray

    return (
        <div className="m-5">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-bold text-black dark:text-white">Dashboard</h2>
                <button
                    type="button"
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    onClick={() => navigate("/ticketing/list")}
                >
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Open vs Close Chart */}
                <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                    <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-1 rounded-lg mb-3">
                        Open Vs Close - Ticket Status
                    </h6>
                    <div className="w-full h-64 md:h-80">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={ticketopenClose}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    dataKey="value"
                                    nameKey="name"
                                    label
                                >
                                    {ticketopenClose.map((entry, index) => (
                                        <Cell key={index} fill={getColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                    <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-1 rounded-lg mb-3">
                        Ticket Status Wise
                    </h6>
                    <div className="w-full h-64 md:h-80">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={ticketStatusWise}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    dataKey="value"
                                    nameKey="name"
                                    label
                                >
                                    {ticketStatusWise.map((entry, index) => (
                                        <Cell key={index} fill={getColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
