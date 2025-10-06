const express = require('express');
const Constant = require('../utils/constant');
const Ticketing = require('../Model/Ticketing/Ticketing');

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
            name: item._id === Constant.TICKETS.USER_CLOSED ? "CLOSED" : "OPEN",
            value: item.count
        }));

        return res.status(200).json({ message: "Data Fetched Successfully", data: mapped });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const tickeStatusWise = async (req, res) => {
    const TICKET_STATUS_MAP = {
        [Constant.TICKETS.OPEN]: "OPEN",
        [Constant.TICKETS.INPROCESS]: "IN PROCESS",
        [Constant.TICKETS.REOPEN]: "REOPEN",
        [Constant.TICKETS.CLOSED]: "CLOSED",
        [Constant.TICKETS.NO_ISSUES_SOLVED]: "NO ISSUES SOLVED",
        [Constant.TICKETS.USER_CLOSED]: "USER CLOSED",
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

module.exports = {
    ticketOpenClose,
    tickeStatusWise,
}