const express = require('express');
const Constant = require('../utils/constant');
const Ticketing = require('../Model/Ticketing/Ticketing');
const Hosteller = require('../Model/Administration/Hosteller');
const Hostel = require('../Model/Master/Hostel');
const mongoose = require('mongoose');

const ticketOpenClose = async (req, res) => {
    try {
        const data = await Ticketing.aggregate([
            {
                $match: {
                    ticket_status: {
                        $in: [
                            Constant.TICKETS.OPEN,
                            Constant.TICKETS.INPROCESS,
                            Constant.TICKETS.REOPEN,
                            Constant.TICKETS.CLOSED,
                            Constant.TICKETS.NO_ISSUES_SOLVED,
                            Constant.TICKETS.USER_CLOSED
                        ]
                    }
                }
            },
            {
                $group: { _id: "$ticket_status", count: { $sum: 1 } }
            }
        ]);

        const mapped = data.map(item => ({
            name: [Constant.TICKETS.NO_ISSUES_SOLVED, Constant.TICKETS.USER_CLOSED].includes(item._id)
                ? "CLOSED"
                : "OPEN",
            value: item.count
        }));

        const merged = mapped.reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.name);
            if (existing) {
                existing.value += curr.value;
            } else {
                acc.push({ ...curr });
            }
            return acc;
        }, []);

        return res.status(200).json({ message: "Data Fetched Successfully", data: merged });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const tickeStatusWise = async (req, res) => {
    const TICKET_STATUS_MAP = {
        [Constant.TICKETS.OPEN]: "OPEN",
        [Constant.TICKETS.INPROCESS]: "IN PROCESS",
        [Constant.TICKETS.REOPEN]: "REOPEN",
        [Constant.TICKETS.CLOSED]: "WAITING FOR USER CONFIRMATION",
        [Constant.TICKETS.NO_ISSUES_SOLVED]: "NO ISSUES SOLVED",
        [Constant.TICKETS.USER_CLOSED]: "CLOSED",
    };

    try {
        const data = await Ticketing.aggregate([
            { $group: { _id: "$ticket_status", count: { $sum: 1 } } }
        ]);

        const mapped = data.map(item => ({
            name: TICKET_STATUS_MAP[item._id] || "UNKNOWN",
            value: item.count
        }));

        return res.status(200).json({ message: "Data Fetched Successfully", data: mapped });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const hostelWiseStudent = async (req, res) => {
    try {
        const result = await Hostel.aggregate([
            // Lookup hostellers to count them
            {
                $lookup: {
                    from: "hostellers",
                    localField: "_id",
                    foreignField: "hostel_id",
                    as: "hostellers"
                }
            },
            {
                $lookup: {
                    from: "locations",
                    localField: "location_id",
                    foreignField: "_id",
                    as: "locationInfo"
                }
            },
            { $unwind: { path: "$locationInfo" } },
            {
                $project: {
                    _id: 0,
                    hostel_name: 1,
                    location_name: "$locationInfo.location_name",
                    "Total Hosteller": { $size: "$hostellers" }
                }
            }
        ]);


        return res.status(200).json({ message: 'Fetched Successfully', data: result })
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const monthWiseHostellerCount = async (req, res) => {
    try {
        const result = await Hosteller.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalHostellers: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    totalHostellers: 1
                }
            }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthData = monthNames.map((name, index) => {
            const monthNum = index + 1;
            const monthRecord = result.find(res => res.month === monthNum);
            return {
                month: name,
                totalHostellers: monthRecord ? monthRecord.totalHostellers : 0
            };
        });

        return res.status(200).json({ message: "Fetched Successfully", data: monthData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const advanceAmount = async (req, res) => {
    try {
        const result = await Hosteller.aggregate([
            {
                $group: {
                    _id: null,
                    totalAdvanceAmount: { $sum: "$total_advance_amount" },
                    paidAdvance: { $sum: "$advance_amount" },
                },
            },
        ]);

        if (!result || result.length === 0) {
            return res.status(200).json({ data: [] });
        }

        const pending_amount = result[0].totalAdvanceAmount - result[0].paidAdvance;

        const formattedData = [
            { name: "Total Advance", value: result[0].totalAdvanceAmount || 0 },
            { name: "Advance Paid", value: result[0].paidAdvance || 0 },
            { name: "Pending", value: pending_amount },
        ];

        return res.status(200).json({ data: formattedData });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

const currentMonthRentStatus = async (req, res) => {
    try {
        const result = await Hosteller.aggregate([
            {
                $group: {
                    _id: null,
                    total_rent: { $sum: "$rent" },
                    rent_paid: { $sum: "$rent_paid" },
                },
            },
        ]);

        if (!result || result.length === 0) {
            return res.status(200).json({ data: [] });
        }

        const pending_amount = result[0].total_rent - result[0].rent_paid;

        const formattedData = [
            { name: "Total Rent", value: result[0].total_rent || 0 },
            { name: "Rent Paid", value: result[0].rent_paid || 0 },
            { name: "Pending", value: pending_amount },
        ];

        return res.status(200).json({ data: formattedData });
    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
}

const ticketStatusCard = async (req, res) => {
    try {
        const TICKET_STATUS_MAP = {
            [Constant.TICKETS.OPEN]: "Open",
            [Constant.TICKETS.INPROCESS]: "Inprocess",
            [Constant.TICKETS.REOPEN]: "Reopen",
            [Constant.TICKETS.CLOSED]: "Waiting For User Confirmation",
            [Constant.TICKETS.NO_ISSUES_SOLVED]: "No Issues Solved",
            [Constant.TICKETS.USER_CLOSED]: "Closed",
        };

        const user_id = new mongoose.Types.ObjectId(req.user.id); 
        const results = await Ticketing.aggregate([
            { $match: { user_id } },
            {
                $group: {
                    _id: "$ticket_status",
                    count: { $sum: 1 },
                }
            }
        ]);

        const resultMap = results.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const mappedResult = Object.keys(TICKET_STATUS_MAP).map(key => ({
            name: TICKET_STATUS_MAP[key],
            value: resultMap[key] || 0
        }));

        return res.status(200).json({ data: mappedResult });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    ticketOpenClose,
    tickeStatusWise,
    hostelWiseStudent,
    monthWiseHostellerCount,
    advanceAmount,
    currentMonthRentStatus,
    ticketStatusCard
}