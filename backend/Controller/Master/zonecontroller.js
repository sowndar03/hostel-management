const express = require('express');


const Zone = require('../../Model/Master/Zone');
const { body, validationResult } = require('express-validator');
const helper = require('../../utils/helper');


const list = async (req, res) => {
    try {
        const zones = await Zone.find({ trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("created_by", "name").sort({ createdAt: -1 });

        res.status(200).json({ data: zones });
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
    ]);
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { location_id, hostel_id, zone_lng, zone_lat } = req.body;
        const result = new Zone({
            location_id,
            hostel_id,
            zone_lng,
            zone_lat,
            created_by: req.user.id,
        });

        await result.save();
        res.status(201).json({
            message: 'Zone Added Successfully',
            data: result,
        });

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        })
    }
}

const uniqueCheck = async (req, res) => {
    try {
        const { location_id, hostel_id, id } = req.body;
        console.log(req.body);

        const result = await Zone.findOne({ location_id, hostel_id, trash: 'NO' });

        if (result) {
            if (id && result._id.toString() === id) {
                return res.json({ message: "Available" });
            }
            return res.json({ message: "Zone Already Exists" });
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
            const result = await Zone.findByIdAndUpdate(
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
            const result = await Zone.findByIdAndUpdate(
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

        const zones = await Zone.findOne({ _id: id, trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("created_by", "name");

        if (!zones) {
            return res.status(404).json({
                success: false,
                message: "Zone not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            data: zones,
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
        console.log(req.body);
        const { building, hostel_id, location_id, id } = req.body;

        // const result = await Zone.findByIdAndUpdate(
        //     id,
        //     {
        //         location_id,
        //         hostel_id: hostel_id,
        //         building_name: building,
        //     },
        //     { new: true }
        // );

        if (!result) {
            return res.status(404).json({ message: "Zone not found" });
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
        const zones = await Zone.find(query).populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("created_by", "name");;

        res.json({ success: true, data: zones });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }

}

const getBuilding = async (req, res) => {
    try {
        const location_id = req.params.location_id;
        const hostel_id = req.params.hostel_id;

        const zones = await Zone.find({
            location_id,
            hostel_id,
            trash: "NO"
        });

        res.status(200).json({
            message: "Data Fetched Successfully",
            data: zones,
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
    getBuilding,
}