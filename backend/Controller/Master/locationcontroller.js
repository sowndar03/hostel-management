const express = require('express');
const Location = require('../../Model/Master/Location');
const { body, validationResult } = require('express-validator');

const store = async (req, res) => {
    await Promise.all([
        body("location")
            .trim()
            .notEmpty().withMessage("Location is Required")
            .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { location } = req.body;

        const result = new Location({
            location_name: location,
        });

        await result.save();
        res.status(201).json({
            message: 'Location Added Successfully',
            data: result,
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        })
    }
}

const uniqueCheck = async (req, res) => {
    try {
        const { location } = req.body;

        const result = await Location.findOne({ location_name: location });

        if (result) {
            return res.json({ message: "Location Already Exists" }); 
        }
        return res.json({ message: "Available" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports = {
    store,
    uniqueCheck
}