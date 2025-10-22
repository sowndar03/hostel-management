import React, { useContext } from "react";
import moment from 'moment';
import { CONSTANTS } from "./CONSTANTS";
import { AuthContext } from "../context/AuthContext";
const api_url = import.meta.env.VITE_API_URL;
const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getStatus = (status) => {
    switch (status) {
        case 1:
            return <p style={{ color: "green", fontWeight: "bold" }}>ACTIVE</p>;
        case 0:
            return <p style={{ color: "red", fontWeight: "bold" }}>IN - ACTIVE</p>;
        default:
            return <p style={{ color: "gray" }}>UNKNOWN</p>;
    }
};

export const getWorkingProfessional = (status) => {
    switch (status) {
        case "1":
            return "Job Seeker";
        case "2":
            return "Job";
        case "3":
            return "College";
        default:
            return "UNKNOWN";
    }
};


export const getImageUrl = (filePath) => {
    if (!filePath) return undefined;
    return `${backend_url}/${filePath}`;
};

export const getAvailableCount = (seats) => {
    if (!seats || seats === 0) {
        return (
            <p className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                No Seats Available
            </p>
        );
    }

    return (
        <p className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
            {seats} {seats === 1 ? "seat available" : "seats available"}
        </p>
    );
};

export const displayDateformat = (date) => {
    return moment(date).format("DD-MM-YYYY");
}

export const getUploadStatus = (id) => {
    switch (id) {
        case "1":
            return <p className="text-red-500 font-bold">FAILED</p>;
        case "2":
            return <p className="text-red-500 font-bold">INPROGRESS</p>;
        case "3":
            return <p className="text-green-500 font-bold">SUCCESS</p>;
    }
}

export const getTicketStatus = (status) => {

    switch (status) {
        case CONSTANTS.OPEN:
            return <p className="text-red-500 font-bold">OPEN</p>;
        case CONSTANTS.INPROCESS:
            return <p className="text-yellow-500 font-bold">ACKNOWLEDGED</p>;
        case CONSTANTS.REOPEN:
            return <p className="text-red-500 font-bold">REOPEN</p>;
        case CONSTANTS.CLOSED:
            return <p className="text-yellow-500 font-bold">Waiting For User Confirmation</p>;
        case CONSTANTS.NO_ISSUES_SOLVED:
            return <p className="text-green-500 font-bold">NO Issues - Closed</p>;
        case CONSTANTS.USER_CLOSED:
            return <p className="text-green-500 font-bold">CLOSED</p>;
        default:
            return <p className="text-gray-500 font-bold">{status}</p>;
    }
};


export const todayDate = () => {
    return moment().format("DD-MM-YYYY");
};

export const todayDateandTime = () => {
    return moment().format("DD-MM-YYYY HH:mm:ss");
};

export const checkUserRole = (role) => {
    const { user } = useContext(AuthContext);
    const current_user_role = string_to_array(user.role_id);
    return current_user_role.includes(role);
}

// explode - string to array - PHP
// split - string to array - JS
export const string_to_array = (str, separator = ",") => {
    return str.split(separator);
};

// implode  - array to string
// join - array to string
export const array_to_string = (arr, separator = ",") => {
    return arr.join(separator);
}

export const getEntryStatus = (status) => {
    switch (status) {
        case CONSTANTS.CHECK_IN:
            return <p style={{ color: "green", fontWeight: "bold" }}>CHECK IN</p>;
        case CONSTANTS.CHECK_OUT:
            return <p style={{ color: "red", fontWeight: "bold" }}>CHECK OUT</p>;
        default:
            return <p style={{ color: "gray" }}>UNKNOWN</p>;
    }
};
