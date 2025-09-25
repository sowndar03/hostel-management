const express = require('express');
const User = require('../Model/User');
const Location = require('../Model/Master/Location');

const string_to_array = (string, separator = ",") => {
    if (typeof string !== "string" || !string.trim()) {
        return [];
    }
    return string
        .split(separator)
        .map((str) => str.trim())
        .filter(Boolean);
};


const getUsername = async (id) => {
    try {

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }
        return user.name;
    } catch (err) {
        return false;
    }
};

const getLocationName = async (id) => {
    try {
        const location = await Location.findById(id).lean();
        return location ? location.location_name : "N/A";
    } catch (err) {
        console.error("Error fetching location:", err.message);
        return "eror";
    }
};

const generatePassword = (name, dob) => {
    const namePart = name.replace(/\s+/g, '').substring(0, 5).toUpperCase();
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${namePart}${day}${month}`;
}

module.exports = {
    string_to_array,
    getUsername,
    getLocationName,
    generatePassword
}