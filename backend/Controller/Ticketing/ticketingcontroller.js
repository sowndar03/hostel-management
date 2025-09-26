const express = require('express');
const ticketing = require('../../Model/Ticketing/Ticketing');

const list = async () => {

}

const store = async (req, res) => {
    try {
        if (req.user.id == req.body.id) {
            
        } else {
            return res.status(403).json({ message: "Invalid User" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    list,
    store
}