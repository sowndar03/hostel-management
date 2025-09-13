import React from "react";
import api from "../api";
import moment from 'moment';
const api_url = import.meta.env.VITE_API_URL;

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
