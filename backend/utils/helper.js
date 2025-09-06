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



module.exports = {
    string_to_array,
    getUsername,
    getLocationName
}