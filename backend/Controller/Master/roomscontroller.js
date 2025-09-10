const express = require('express');
const Rooms = require('../../Model/Master/Rooms');
const { body, validationResult } = require('express-validator');
const helper = require('../../utils/helper');


const list = async (req, res) => {
    try {
        const rooms = await Rooms.find({ trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("building_id", "building_name")
            .populate("created_by", "name");

        res.status(200).json({ data: rooms });
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
        body("building_id")
            .trim()
            .notEmpty().withMessage("Building is Required")
            .run(req),
        body("room_no")
            .trim()
            .notEmpty().withMessage("Room Number is Required")
            .run(req),
        body("room_count")
            .trim()
            .notEmpty().withMessage("Room Count is Required")
            .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { location_id, hostel_id, building_id, room_no, room_count } = req.body;
        const result = new Rooms({
            location_id,
            hostel_id,
            building_id,
            room_count,
            room_no,
            created_by: req.user.id,
        });

        await result.save();
        res.status(201).json({
            message: 'Rooms Added Successfully',
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
        const { location_id, hostel_id, building_id, room_no, id } = req.body;

        const result = await Rooms.findOne({ location_id, hostel_id, building_id, room_no });

        if (result) {
            if (id && result._id.toString() === id) {
                return res.json({ message: "Available" });
            }
            return res.json({ message: "Rooms Already Exists" });
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
            const result = await Rooms.findByIdAndUpdate(
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
            const result = await Rooms.findByIdAndUpdate(
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

        const buildings = await Rooms.findOne({ _id: id, trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("building_id", "building_name")
            .populate("created_by", "name");

        if (!buildings) {
            return res.status(404).json({
                success: false,
                message: "Rooms not found",
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
        const { building_id, hostel_id, location_id, room_no, room_count, id } = req.body;

        const result = await Rooms.findByIdAndUpdate(
            id,
            {
                location_id,
                hostel_id,
                building_id,
                room_count,
                room_no,
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Rooms not found" });
        }

        return res.json({ message: "Updated successfully", data: result });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const searchValues = async (req, res) => {

    const { location_id, hostel_id, building_id, room_no, room_count, status } = req.body;
    let query = {};

    if (location_id && location_id !== "") {
        query.location_id = location_id;
    }

    if (hostel_id && hostel_id !== "") {
        query.hostel_id = hostel_id;
    }

    if (building_id && building_id !== "") {
        query.building_id = building_id;
    }
    if (room_no && room_no !== "") {
        query.room_no = room_no;
    }
    if (room_count && room_count !== "") {
        query.room_count = room_count;
    }

    if (status && status !== "") {
        query.status = status;
    }
    query.trash = 'NO';

    try {
        const buildings = await Rooms.find(query).
            populate("location_id", "location_name")
            .populate("hostel_id", "hostel_id")
            .populate("building_id", "building_name")
            .populate("created_by", "name");

        res.json({ success: true, data: buildings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }

}

const getBuilding = async (req, res) => {
    try {
        const location_id = req.params.location_id;
        const hostel_id = req.params.hostel_id;

        const buildings = await Rooms.find({
            location_id,
            hostel_id,
            trash: "NO"
        });

        res.status(200).json({
            message: "Data Fetched Successfully",
            data: buildings,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const importSubmit = async (req, res) => {
   
}

module.exports = {
    list,
    store,
    uniqueCheck,
    statusChange,
    deleteHostel,
    selectOne,
    updates,
    searchValues,
    getBuilding,
    importSubmit
}