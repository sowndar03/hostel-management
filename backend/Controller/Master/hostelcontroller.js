const express = require('express');
const Hostel = require('../../Model/Master/Hostel');
const { body, validationResult } = require('express-validator');
const helper = require('../../utils/helper');


const list = async (req, res) => {
    try {
        const hostels = await Hostel.find({ trash: "NO" });

        const hostelList = await Promise.all(
            hostels.map(async (hostel) => ({
                id: hostel._id,
                location_name: await helper.getLocationName(hostel.location_id),
                hostel_name: hostel.hostel_name,
                created_by: await helper.getUsername(hostel.created_by),
                status: hostel.status,
            }))
        );

        res.status(200).json({ data: hostelList });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const store = async (req, res) => {
    await Promise.all([
        body("location_id")
            .trim()
            .notEmpty().withMessage("Location is Required")
            .run(req),
        body("hostel")
            .trim()
            .notEmpty().withMessage("Hostel is Required")
            .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { location_id, hostel } = req.body;
        const result = new Hostel({
            location_id,
            hostel_name: hostel,
            created_by: req.user.id,
        });

        await result.save();
        res.status(201).json({
            message: 'Hostel Added Successfully',
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
        const { location_id, hostel_name, id } = req.body;

        const result = await Hostel.findOne({ hostel_name, location_id });

        if (result) {
            if (id && result._id.toString() === id) {
                return res.json({ message: "Available" });
            }
            return res.json({ message: "Hostel Already Exists" });
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
            const result = await Hostel.findByIdAndUpdate(
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

const deleteHostel = async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id);

        try {
            const result = await Hostel.findByIdAndUpdate(
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
    const { id } = req.params;

    try {
        const result = await Hostel.findById(id).lean();

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Hostel not found",
            });
        }

        const locationName = await helper.getLocationName(result.location_id);

        const hostelData = {
            location_name: locationName,
            location_id: result.location_id,
            hostel_name: result.hostel_name,
            status: result.status,
            id: result._id,
        };

        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            data: hostelData,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}

const updates = async (req, res) => {
    try {
        const { hostel, location_id, id } = req.body;

        const result = await Hostel.findByIdAndUpdate(
            id,
            {
                location_id,
                hostel_name: hostel
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Location not found" });
        }

        return res.json({ message: "Updated successfully", data: result });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const searchValues = async (req, res) => {

    const { location, hostel, status } = req.body;

    let query = {};

    if (location && location !== "") {
        query.location_id = location;
    }

    if (hostel && hostel !== "") {
        query.hostel_name = hostel;
    }

    if (status && status !== "") {
        query.status = status;
    }
    query.trash = 'NO';

    try {
        const hostels = await Hostel.find(query);

        const hostelList = await Promise.all(
            hostels.map(async (hostel) => ({
                id: hostel._id,
                location_name: await helper.getLocationName(hostel.location_id),
                hostel_name: hostel.hostel_name,
                created_by: await helper.getUsername(hostel.created_by),
                status: hostel.status,
            }))
        );


        res.json({ success: true, data: hostelList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }

}

module.exports = {
    list,
    store,
    uniqueCheck,
    statusChange,
    deleteHostel,
    selectOne,
    updates,
    searchValues
}