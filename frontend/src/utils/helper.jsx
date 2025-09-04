import React from "react";
import api from "../api";
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

