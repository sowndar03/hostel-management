const express = require('express');
const User = require('../Model/User');

const string_to_array = (string, seperator = ",") => {
    if (typeof string !== 'string') {
        return [];
    } else {
        return string.split(seperator).map((str) => str.trim());
    }
}

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


module.exports = {
    string_to_array,
    getUsername
}