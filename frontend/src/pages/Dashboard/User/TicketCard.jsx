import React, { useEffect, useState } from 'react'
import api from '../../../api';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaHourglassHalf } from 'react-icons/fa';

const STATUS_ICONS = {
    "Open": <FaExclamationCircle className="text-yellow-500 w-8 h-8" />,
    "Inprocess": <FaHourglassHalf className="text-blue-500 w-8 h-8" />,
    "Reopen": <FaExclamationCircle className="text-orange-500 w-8 h-8" />,
    "Waiting For User Confirmation": <FaHourglassHalf className="text-purple-500 w-8 h-8" />,
    "No Issues Solved": <FaCheckCircle className="text-green-400 w-8 h-8" />,
    "Closed": <FaCheckCircle className="text-green-500 w-8 h-8" />,
};

const TicketCard = () => {
    const api_url = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const result = await api.get(`${api_url}/dashboard/user/card/tickets`);
            setData(result.data.data);
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((status, index) => (
                <div
                    key={index}
                    className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <div className="mr-4">
                        {STATUS_ICONS[status.name] || <FaExclamationCircle className="w-8 h-8 text-gray-500" />}
                    </div>
                    <div>
                        <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {status.name}
                        </p>
                        <h3 className="font-normal text-xl text-gray-700 dark:text-gray-400">
                            {status.value}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TicketCard;
