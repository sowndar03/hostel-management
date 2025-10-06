const express = require('express');
const Ticketing = require('../../Model/Ticketing/Ticketing');
const IssueFiles = require('../../Model/Ticketing/IssueFiles');
const { TICKETS } = require('../../utils/constant');
const User = require('../../Model/User');
const { sendTicketNotification } = require('../../utils/helper');
const { messaging } = require('firebase-admin');
const Constant = require('../../utils/constant');
const Hosteller = require('../../Model/Administration/Hosteller');

const list = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);
        const role = user.role_id;

        let filter = {};
        if (role == Constant.ROLES.USER) {
            filter.user_id = req.user.id;
        }

        const result = await Ticketing.find(filter)
            .populate({
                path: 'hosteller_id',
                populate: [
                    { path: 'hostel_id' },
                    { path: 'room_id' }
                ]
            }).populate(['created_by', 'acknowledged_by', 'closed_by']).sort({ createdAt: -1 });

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

        var hosteller = await Hosteller.findById(req.body.hosteller_id);

        var ticketing = await Ticketing.create({
            user_id: req.body.id,
            hosteller_id: req.body.hosteller_id,
            building_id: hosteller.building_id,
            hostel_id: hosteller.hostel_id,
            location_id: hosteller.location_id,
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

        const tickets = await Ticketing.findOne({ _id: id, trash: "NO" })
            .populate({
                path: 'hosteller_id',
                populate: [{ path: 'hostel_id' }, { path: 'room_id' }]
            })
            .populate(['created_by', 'acknowledged_by', 'closed_by']);


        if (!tickets) {
            return res.status(404).json({
                success: false,
                message: "Rooms not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            data: tickets,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}

const selectIssuesFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const issues = await IssueFiles.find({
            ticketing_id: id
        });
        res.status(200).json({ messaging: "Fetched Successfully", data: issues });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const first_approvals = async (req, res) => {
    try {
        const { id, ticket_status, remarks } = req.body;
        const login_id = req.user.id;

        let updateFields = { ticket_status };

        if (ticket_status == Constant.TICKETS.NO_ISSUES_SOLVED || ticket_status == Constant.TICKETS.CLOSED) {
            updateFields.closed_remarks = remarks;
            updateFields.closed_at = new Date();
            updateFields.closed_by = login_id;
        } else if (ticket_status == Constant.TICKETS.INPROCESS) {
            updateFields.acknowledgment_remarks = remarks;
            updateFields.acknowledged_at = new Date();
            updateFields.acknowledged_by = login_id;
        }

        const result = await Ticketing.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        return res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const close_approval = async (req, res) => {
    try {
        const { id, remarks } = req.body;
        const login_id = req.user.id;

        const ticket_status = Constant.TICKETS.CLOSED;
        let updateFields = { ticket_status };

        updateFields.closed_remarks = remarks;
        updateFields.closed_at = new Date();
        updateFields.closed_by = login_id;

        const result = await Ticketing.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        return res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const final_approval = async (req, res) => {
    try {
        const { id, ticket_status, remarks } = req.body;

        let updateFields = { ticket_status };

        updateFields.user_remarks = remarks;
        updateFields.user_updated_at = new Date();

        const result = await Ticketing.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        return res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const searchValues = async (req, res) => {

    const { location_id, hostel_id, building_id, status } = req.body;
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

    if (status && status !== "") {
        query.ticket_status = status;
    }
    query.trash = 'NO';

    try {
        const tickets = await Ticketing.find(query)
            .populate({
                path: 'hosteller_id',
                populate: [
                    { path: 'hostel_id' },
                    { path: 'room_id' }
                ]
            }).populate(['created_by', 'acknowledged_by', 'closed_by']);

        res.json({ success: true, data: tickets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }

}



module.exports = {
    list,
    store,
    selectOne,
    selectIssuesFiles,
    first_approvals,
    close_approval,
    final_approval,
    searchValues
}