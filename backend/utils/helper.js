const express = require('express');

const string_to_array = (string, seperator = ",") => {
    if (typeof string !== 'string') {
        return [];
    } else {
        return string.split(seperator).map((str) => str.trim());
    }
}


module.exports = {
    string_to_array,
}