const express = require('express');
const Building = require('../../Model/Master/Building');
const { body, validationResult } = require('express-validator');
const helper = require('../../utils/helper');


const list = async (req, res) => {
    try {
        const buildings = await Building.find({ trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("created_by", "name");

        res.status(200).json({ data: buildings });
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
        body("hostel_id")
            .trim()
            .notEmpty().withMessage("Hostel is Required")
            .run(req),
        body("building")
            .trim()
            .notEmpty().withMessage("Building is Required")
            .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { location_id, hostel_id, building } = req.body;
        const result = new Building({
            location_id,
            hostel_id,
            building_name: building,
            created_by: req.user.id,
        });

        await result.save();
        res.status(201).json({
            message: 'Building Added Successfully',
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
        const { location_id, hostel_id, building, id } = req.body;

        const result = await Building.findOne({ location_id, hostel_id, building_name: building });

        if (result) {
            if (id && result._id.toString() === id) {
                return res.json({ message: "Available" });
            }
            return res.json({ message: "Building Already Exists" });
        }
        return res.json({ message: "Available" });

    } catch (err) {
        return res.json({ message: err.message });
    }
};

const statusChange = async (req, res) => {
    try {
        const { id, status } = req.body;
        const changedStatus = status == 0 ? 1 : 0;

        try {
            const result = await Building.findByIdAndUpdate(
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

        try {
            const result = await Building.findByIdAndUpdate(
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

        const buildings = await Building.findOne({ _id: id, trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("created_by", "name");

        if (!buildings) {
            return res.status(404).json({
                success: false,
                message: "Building not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            data: buildings,
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
        const { building, hostel_id, location_id, id } = req.body;

        const result = await Building.findByIdAndUpdate(
            id,
            {
                location_id,
                hostel_id: hostel_id,
                building_name: building,
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Building not found" });
        }

        return res.json({ message: "Updated successfully", data: result });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const searchValues = async (req, res) => {

    const { location_id, hostel_id, building, status } = req.body;
    let query = {};

    if (location_id && location_id !== "") {
        query.location_id = location_id;
    }

    if (hostel_id && hostel_id !== "") {
        query.hostel_id = hostel_id;
    }

    if (building && building !== "") {
        query.building_name = building;
    }
    if (status && status !== "") {
        query.status = status;
    }
    query.trash = 'NO';

    try {
        const buildings = await Building.find(query).populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("created_by", "name");;

        res.json({ success: true, data: buildings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }

}

const getHostel = async (req, res) => {
    try {
        const location_id = req.params.id;

        const hostels = await Building.find({ location_id: location_id });

        const hostelList = await Promise.all(
            hostels.map(async (hostel) => ({
                id: hostel._id,
                location_name: await helper.getLocationName(hostel.location_id),
                hostel_name: hostel.hostel_name,
                created_by: await helper.getUsername(hostel.created_by),
                status: hostel.status,
            }))
        );

        res.status(200).json({
            message: "Data Fetched Successfully",
            data: hostelList,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    list,
    store,
    uniqueCheck,
    statusChange,
    deleteHostel,
    selectOne,
    updates,
    searchValues,
    getHostel,
}