const express = require('express');
const User = require('../Model/User');
const Location = require('../Model/Master/Location');
const Rooms = require('../Model/Master/Rooms');
const Hostel = require('../Model/Master/Hostel');
const Notification = require('../Model/Notification');
const admin = require('../utils/firebaseadmin');
const { onlineAdmins, getIo } = require('../utils/socket');
const io = getIo();
require('dotenv').config();

const allowed_origins = process.env.ALLOWED_ORIGINS;

const string_to_array = (string, separator = ",") => {
    if (typeof string !== "string" || !string.trim()) {
        return [];
    }
    return string
        .split(separator)
        .map((str) => str.trim())
        .filter(Boolean);
};


const getUsername = async (id) => {
    try {

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }
        return user.name;
    } catch (err) {
        return false;
    }
};

const getLocationName = async (id) => {
    try {
        const location = await Location.findById(id).lean();
        return location ? location.location_name : "N/A";
    } catch (err) {
        console.error("Error fetching location:", err.message);
        return "eror";
    }
};

const generatePassword = (name, dob) => {
    const namePart = name.replace(/\s+/g, '').substring(0, 5).toUpperCase();
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${namePart}${day}${month}`;
}

const getRoomName = async (id) => {
    try {
        const result = await Rooms.findById(id);
        if (result) {
            return result.room_no;
        } else {
            return "-";
        }
    } catch (err) {
        console.log(err);
    }
}

const getHostelName = async (id) => {
    try {
        const result = await Hostel.findById(id);
        if (result) {
            return result.hostel_name;
        } else {
            return "-"
        }
    } catch (err) {
        console.log(err);
    }
}

const sendTicketNotification = async (ticketing, admins) => {
    try {
        const hostelName = await getHostelName(ticketing.hosteller_id.hostel_id);

        const notifications = admins.map(adminUser => ({
            notification_type: "Ticket",
            module_type: "Ticketing",
            module_sub_type: "New Ticket",
            title: "New Ticket Raised",
            message: `New Ticketing has been Created By the ${ticketing.hosteller_id.name} from ${hostelName}`,
            web_link: `ticketing/view/${ticketing._id}`,
            assigned_user: `${adminUser._id}`,
            viewed_user: "",
            created_by: ticketing.hosteller_id,
        }));

        await Notification.insertMany(notifications);

        const io = getIo();
        admins.forEach(adminUser => {
            const socketId = onlineAdmins[adminUser._id.toString()];
            if (socketId) {
                io.to(socketId).emit('new-ticket', {
                    ticket_id: ticketing._id,
                    hostelName: hostelName,
                    user_name: ticketing.hosteller_id.name,
                    created_by: ticketing.hosteller_id.name,
                    web_link: `ticketing/view/${ticketing._id}`
                });
            }
        });

        const fcmTokens = admins.map(a => a.fcm_token).filter(Boolean);
        if (fcmTokens.length > 0) {
            const message = {
                notification: {
                    title: "New Ticket Raised",
                    body: `New Ticketing has been Created By the ${ticketing.hosteller_id.name} from ${hostelName}`,
                },
                data: {
                    ticketId: ticketing._id.toString(),
                    userId: ticketing.user_id.toString(),
                },
                tokens: fcmTokens,
            };

            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(
                `FCM Notification sent: ${response.successCount} successes, ${response.failureCount} failures`
            );
        }
    } catch (err) {
        console.error("Error sending ticket notifications:", err);
    }
};

module.exports = {
    string_to_array,
    getUsername,
    getLocationName,
    generatePassword,
    getRoomName,
    getHostelName,
    sendTicketNotification
}