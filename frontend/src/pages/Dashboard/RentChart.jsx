import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';

const STATUS_COLORS = {
    "Rent Paid": "#34D399",
    "Total Rent": "#45cdf7ff",
    "Pending": "#F87171",
};

const AdvanceChart = () => {
    const [data, setData] = useState([]);
    const api_url = import.meta.env.VITE_API_URL;

    const fetchData = async () => {
        try {
            const res = await api.get(`${api_url}/dashboard/currentMonthRentStatus`);
            setData(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getColor = (status) => STATUS_COLORS[status] || "#E5E7EB";


    return (
        <div className="w-full h-64 md:h-80 flex items-center justify-center">
            {data.length === 0 ? (<span className="text-red-500 dark:text-gray-400 font-semibold"> No data found </span>) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={getColor(entry.name)} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default AdvanceChart;
