const express = require('express');
const Location = require('../../Model/Master/Location');
const { body, validationResult } = require('express-validator');
const helper = require('../../utils/helper');


const list = async (req, res) => {
    try {
        const locations = await Location.find({
            trash: 'NO'
        })
        const locationlist = await Promise.all(
            locations.map(async (location) => ({
                id: location._id,
                name: location.location_name,
                created_by: await helper.getUsername(location.created_by),
                status: location.status,
            }))
        );

        res.status(200).json({ data: locationlist });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


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
            created_by: req.user.id,
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
        const { location, id } = req.body;

        const result = await Location.findOne({ location_name: location });

        if (result) {
            if (id && result._id.toString === id) {
                return res.json({ message: "Available" });
            }
            return res.json({ message: "Location Already Exists" });
        }
        return res.json({ message: "Available" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const statusChange = async (req, res) => {
    try {
        const { id, status } = req.body;
        const changedStatus = status == 0 ? 1 : 0;

        try {
            const result = await Location.findByIdAndUpdate(
                id,
                { status: changedStatus },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Status updated successfully",
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const deleteLocation = async (req, res) => {
    try {
        const { id } = req.body;

        try {
            const result = await Location.findByIdAndUpdate(
                id,
                { trash: 'YES', status: '0' },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Deleted successfully",
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const selectOne = async (req, res) => {
    try {
        const { id } = req.params;

        try {
            const result = await Location.findById(
                id,
            );

            res.status(200).json({
                success: true,
                message: "Fetched successfully",
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updates = async (req, res) => {
    try {
        const { location, id } = req.body;

        const result = await Location.findByIdAndUpdate(
            id,
            { location_name: location },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Location not found" });
        }

        return res.json({ message: "Updated successfully", data: result });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports = {
    list,
    store,
    uniqueCheck,
    statusChange,
    deleteLocation,
    selectOne,
    updates
}