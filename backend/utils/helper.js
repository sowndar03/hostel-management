const express = require('express');
const User = require('../Model/User');
const Location = require('../Model/Master/Location');
const Rooms = require('../Model/Master/Rooms');
const Hostel = require('../Model/Master/Hostel');

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

const getRoomName = async (id) => {
    try {
        const result = await Rooms.findById(id);
        if (result) {
            return result.room_no;
        } else {
            return "-";
        }
    } catch (err) {
        console.log(err);
    }
}

const getHostelName = async (id) => {
    try {
        const result = await Hostel.findById(id);
        if (result) {
            return result.hostel_name;
        } else {
            return "-"
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    string_to_array,
    getUsername,
    getLocationName,
    generatePassword,
    getRoomName,
    getHostelName
}