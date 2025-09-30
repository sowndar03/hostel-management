const express = require('express');
const Ticketing = require('../../Model/Ticketing/Ticketing');
const IssueFiles = require('../../Model/Ticketing/IssueFiles');
const { TICKETS } = require('../../utils/constant');
const User = require('../../Model/User');
const { sendTicketNotification } = require('../../utils/helper');

const list = async (req, res) => {
    try {
        const result = await Ticketing.find()
            .populate({
                path: 'hosteller_id',
                populate: [
                    { path: 'hostel_id' },
                    { path: 'room_id' }
                ]
            }).populate({
                path: 'created_by',
            });


        return res.status(200).json({
            message: "Data Fetched Successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const store = async (req, res) => {
    try {
        if (req.user.id != req.body.id) {
            return res.status(403).json({ message: "Invalid User" });
        }

        var ticketing = await Ticketing.create({
            user_id: req.body.id,
            hosteller_id: req.body.hosteller_id,
            concern: req.body.concern,
            created_by: req.user.id,
            ticket_status: TICKETS.OPEN,
        });

        const issues = req.importedFiles.issue || [];
        for (const issue of issues) {
            await IssueFiles.create({
                ticketing_id: ticketing._id,
                file_name: issue.file_name,
                file_path: issue.path,
            });
        }

        ticketing = await Ticketing.findById(ticketing._id).populate('hosteller_id');

        const adminUsers = await User.find({ role_id: 1 });
        await sendTicketNotification(ticketing, adminUsers);

        return res.status(201).json({ message: "Ticket Raised Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


const selectOne = async (req, res) => {
    const { id } = req.params;

    try {

        const buildings = await Ticketing.findOne({ _id: id, trash: "NO" })
            .populate({
                path: 'hosteller_id',
                populate: [
                    { path: 'hostel_id' },
                    { path: 'room_id' }
                ]
            }).populate({
                path: 'created_by',
            });

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

const selectIssuesFiles = async () => {
    try {
        const { id } = req.params;
        // const issues = await 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    list,
    store,
    selectOne,
    selectIssuesFiles
}