const express = require('express');
const user = require('../Model/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const Notification = require('../Model/Notification');
const helper = require('../utils/helper');
const NotificationLog = require('../Model/NotificationLog');

//LoginDetails
const store = async (req, res) => {
    await Promise.all([
        body("email")
            .trim()
            .notEmpty().withMessage("Email is Required")
            .run(req),

        body("password")
            .trim()
            .notEmpty()
            .run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            res.status(400).json({ message: "User not Found!" });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: foundUser._id }, "SECRET_KEY", { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

//Theme
const setTheme = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.user.id);
        if (!loggedUser) {
            res.status(401).json({ message: "User not Found" });
        }

        loggedUser.theme = loggedUser.theme === "light" ? "dark" : "light";
        await loggedUser.save();
        res.json({ message: "Theme updated successfully", theme: loggedUser.theme });
    } catch (Err) {
        res.status(500).json({ message: "Server Error" });
    }
}

const getTheme = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.user.id);
        if (!loggedUser) {
            res.status(401).json({ message: "User not Found" });
        }
        res.json({ message: "Theme updated successfully", theme: loggedUser.theme });
    } catch (Err) {
        res.status(500).json({ message: "Server Error" });
    }
}

//LoggedUserDetails
const loggedUser = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.user.id);
        if (!loggedUser) {
            res.status(401).json({ message: "User not Found" });
        }
        res.json({ message: "User Fetched successfully", user: loggedUser });
    } catch (Err) {
        res.status(500).json({ message: "Server Error" });
    }
}


//Notification
const notification = async (req, res) => {
    try {
        const notifications = await Notification.find({
            assigned_user: new RegExp(`(^|,)${req.user.id}(,|$)`)
        });

        const logs = await Promise.all(
            notifications.map(notification =>
                NotificationLog.findOne({
                    notification_id: notification._id,
                    user_id: req.user.id
                })
            )
        );
        const unread_count = logs.filter(log => !log).length;
        res.json({ notifications, unread_count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}
const markasread = async (req, res) => {
    try {
        const user_id = req.user.id;
        const notification_id = req.body.id;
        const notifications = await Notification.findById(notification_id);
        const viewed_user = helper.string_to_array(notifications.viewed_user);

        if (!viewed_user.includes(user_id.toString())) {
            viewed_user.push(user_id.toString());
            notifications.viewed_user = viewed_user.join(',');
            await notifications.save();
            const log = new NotificationLog({ notification_id, user_id });
            await log.save();
        }
        res.send({ message: "Updated Successfully", notifications });
    } catch (err) {
        res.json({ message: err.message });
    }
}

module.exports = {
    store,
    setTheme,
    getTheme,
    loggedUser,
    notification,
    markasread
}