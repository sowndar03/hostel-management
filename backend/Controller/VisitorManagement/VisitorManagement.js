const express = require('express');
const { database } = require('firebase-admin');
const VisitorManagement = require('../../Model/VisitorManagement/VisitorManagement');
const { model } = require('mongoose');
const Hosteller = require('../../Model/Administration/Hosteller');
const Constant = require('../../utils/constant');
const { currentTime } = require('../../utils/helper');

const list = async (req, res) => {
    try {
        const { hasAdmin } = req.query;

        if (hasAdmin == "true") {
            const result = await VisitorManagement.find()
                .populate({
                    path: 'hosteller_id',
                    populate: [
                        {
                            path: 'hostel_id',
                            model: 'Master_hostel'
                        }, {
                            path: 'location_id',
                            model: 'Location',
                        }
                    ]
                })
                .populate('created_by').sort({ createdAt: -1 });
            res.status(200).json({ data: result });
        } else {
            const user_id = req.user.id;
            const result = await VisitorManagement.find({
                $or: [
                    {
                        hosteller_id: user_id
                    },
                    {
                        created_by: user_id
                    }
                ]
            })
                .populate({
                    path: 'hosteller_id',
                    populate: [
                        {
                            path: 'hostel_id',
                            model: 'Master_hostel'
                        }, {
                            path: 'location_id',
                            model: 'Location',
                        }
                    ]
                })
                .populate('created_by').sort({ createdAt: -1 });
            res.status(200).json({ data: result });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const store = async (req, res) => {
    const { date, hosteller_id, purpose_of_visit } = req.body;
    try {
        const createPromises = hosteller_id.map(id => {
            return VisitorManagement.create({
                date,
                hosteller_id: id,
                purpose_of_visit,
                created_by: req.user.id,
                out_at: currentTime(),
            });
        });

        await Promise.all(createPromises);
        return res.status(201).json({ message: "Visitor entries created successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const hosteller_list = async (req, res) => {
    try {
        const { hasAdmin } = req.query;
        if (hasAdmin === 'true') {
            const result = await Hosteller.find({ trash: "NO" })
                .populate("location_id", "location_name")
                .populate("hostel_id", "hostel_name")
                .populate("building_id", "building_name")
                .populate("room_id", "room_no")
                .populate("seat_no", "seat_no")
                .populate("created_by", "name");

            res.status(200).json({ data: result });
        } else {
            const user_id = req.user.id;
            const hosteller = await Hosteller.findOne({ user_id: user_id });

            const result = await Hosteller.find({
                trash: "NO",
                location_id: hosteller.location_id,
                hostel_id: hosteller.hostel_id,
                building_id: hosteller.building_id,
            })
                .populate("location_id", "location_name")
                .populate("hostel_id", "hostel_name")
                .populate("building_id", "building_name")
                .populate("room_id", "room_no")
                .populate("seat_no", "seat_no")
                .populate("created_by", "name");

            res.status(200).json({ data: result });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const changeStatus = async (req, res) => {
    try {
        const {  _id  } = req.body;
        const result = await VisitorManagement.findByIdAndUpdate(
            _id,
            {
                check_in_out_status: Constant.CHECK.IN,
                in_at: currentTime()
            },
            { new: true }
        );
        return res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    list,
    store,
    hosteller_list,
    changeStatus
}