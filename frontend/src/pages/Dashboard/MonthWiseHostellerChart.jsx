import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const MonthWiseHostellerChart = () => {
    const HOSTEL_COLORS = ["#4f46e5", "#f87171", "#34d399", "#facc15", "#60a5fa", "#a78bfa"];

    const [data, setData] = useState([]);
    const api_url = import.meta.env.VITE_API_URL;

    const fetchData = async () => {
        try {
            const res = await api.get(`${api_url}/dashboard/monthWiseHostellerCount`);
            setData(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-full h-64 md:h-80 flex items-center justify-center">
            {data.length === 0 ? (<span className="text-red-500 dark:text-gray-400 font-semibold"> No data found </span>) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, "Total Hosteller"]} />
                        <Bar dataKey="totalHostellers" label={{ position: 'top' }}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={HOSTEL_COLORS[index % HOSTEL_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default MonthWiseHostellerChart
