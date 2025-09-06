const express = require('express');

const string_to_array = (string, separator = ",") => {
    if (typeof string !== "string" || !string.trim()) {
        return [];
    }
    return string
        .split(separator)
        .map((str) => str.trim())
        .filter(Boolean);
};



module.exports = {
    string_to_array,
}