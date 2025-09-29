const express = require('express');
const Ticketing = require('../../Model/Ticketing/Ticketing');
const IssueFiles = require('../../Model/Ticketing/IssueFiles');
const { TICKETS } = require('../../utils/constant');
const { onlineAdmins, getIo } = require('../../utils/socket');
const User = require('../../Model/User');
const Notification = require('../../Model/Notification');
const io = getIo();

const list = async () => {

}

const store = async (req, res) => {
    try {
        if (req.user.id == req.body.id) {
            const ticketing = await Ticketing.create({
                user_id: req.body.id,
                hosteller_id: req.body.hosteller_id,
                concern: req.body.concern,
                created_by: req.user.id,
                ticket_status: TICKETS.OPEN,
            });

            const issues = req.importedFiles.issue;

            for (const issue of issues) {
                await IssueFiles.create({
                    ticketing_id: ticketing._id,
                    file_name: issue.file_name,
                    file_path: issue.path,
                });
            }

            const adminUser = await User.find({ role_id: 1 });
            for (const admin of adminUser) {

                const notificationData = {
                    notification_type: "Ticket",
                    module_type: "Ticketing",
                    module_sub_type: "New Ticket",
                    title: "New Ticket Raised",
                    message: `Ticket ID ${ticketing._id} created by User ${ticketing.user_id}`,
                    web_link: `/ticketing/view/${ticketing._id}`,
                    assigned_user: `${admin._id}`,
                    viewed_user: "",
                };
                const notification = await Notification.create(notificationData);

                const socketId = onlineAdmins[admin._id.toString()];
                if (socketId) {
                    console.log(socketId);
                    io.to(socketId).emit('new-ticket', {
                        ticket_id: ticketing._id,
                        concern: ticketing.concern,
                        user_id: ticketing.user_id,
                        created_by: ticketing.created_by,
                    });
                }
            }

            // return res.status(201).json({ message: "Ticket Raised Successfully" });
        } else {
            return res.status(403).json({ message: "Invalid User" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    list,
    store
}