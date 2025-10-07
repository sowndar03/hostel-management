import React from 'react';
import { useNavigate } from 'react-router-dom';
import HostelWiseStudentChart from './HostelwiseStudentChart';
import TicketOpenCloseChart from './TicketOpenCloseChart';
import TicketStatusWiseChart from './TicketStatusWiseChart';
import MonthWiseHostellerChart from './MonthWiseHostellerChart';
import AdvanceChart from './AdvanceChart';
import RentChart from './RentChart';

const Dashboard = () => {
    const navigate = useNavigate();

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

            <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
                    Hostel Wise Count
                </h6>
                <HostelWiseStudentChart />
            </div>

            <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
                    Month Wise Count - Hosteller
                </h6>
                <MonthWiseHostellerChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                    <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
                       Advance - Paid Vs Pending
                    </h6>
                    <AdvanceChart />
                </div>
                <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                    <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
                       Current Month Rent - Paid Vs Pending
                    </h6>
                    <RentChart />
                </div>
                <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                    <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
                        Open Vs Close - Ticket Status
                    </h6>
                    <TicketOpenCloseChart />
                </div>

                <div className="bg-white dark:bg-gray-800 m-2 p-2 shadow-md col-span-1 rounded-lg">
                    <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
                        Ticket Status Wise
                    </h6>
                    <TicketStatusWiseChart />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
