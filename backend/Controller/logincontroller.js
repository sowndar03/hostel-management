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
            return res.status(400).json({ message: "User not Found!" });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
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

const storefcmtoken = async (req, res) => {
    try {
        const { id, fcmToken } = req.body;
        const fcm_token = await User.findByIdAndUpdate(
            id,
            { fcm_token: fcmToken },
            { new: true },
        );
        return res.status(201).json({ message: "FCM Token Updated Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
            notifications.viewed_user = viewed_user.join(",");
            await notifications.save();

            const log = new NotificationLog({ notification_id, user_id });
            await log.save();
        }

        const allNotifications = await Notification.find({
            assigned_user: new RegExp(`(^|,)${user_id}(,|$)`)
        });

        const logs = await Promise.all(
            allNotifications.map(notification =>
                NotificationLog.findOne({
                    notification_id: notification._id,
                    user_id: user_id
                })
            )
        );
        const unread_count = logs.filter(log => !log).length;

        res.send({
            message: "Updated Successfully",
            notifications,
            unread_count
        });
    } catch (err) {
        res.json({ message: err.message });
    }
}

const passWordCheck = async (req, res) => {
    try {
        const { password } = req.body;
        const logged_user = req.user.id;

        const user = await User.findById(logged_user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        let msg = "";
        let isPasswordCorrect = false;
        if (!isMatch) {
            isPasswordCorrect = false;
            msg = "Old password is incorrect";
        } else {
            isPasswordCorrect = true;
            msg = "Password verified successfully";
        }
        return res.status(200).json({ message: msg, data: isPasswordCorrect });
    } catch (err) {
        console.log(err.message);
        return res.json('error', err.message);
    }
}

const passwordChange = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        const hashedPassword = await bcrypt.hash(new_password, 10);
        const logged_user = req.user.id;

        const user = await User.findByIdAndUpdate(
            logged_user,
            { password: hashedPassword },
            { new: true }
        );
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.log(err.message);
        return res.json('error', err.message);
    }
}

const coverImageUpload = async (req, res) => {
    try {
        const { cover_image } = req.importedFiles;
        const loggedUser = req.user.id;
        const user = await User.findByIdAndUpdate(
            loggedUser,
            {
                cover_image: cover_image.path
            },
            {
                new: true,
            }
        );
        return res.status(200).json({ data: user, messge: "Cover Image Updated Successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}

const profileImageUpload = async (req, res) => {
    try {
        const { profile_picture } = req.importedFiles;
        const loggedUser = req.user.id;
        const user = await User.findByIdAndUpdate(
            loggedUser,
            {
                profile_picture: profile_picture.path
            },
            {
                new: true,
            }
        );
        return res.status(200).json({ data: user, messge: "Cover Image Updated Successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    store,
    setTheme,
    getTheme,
    loggedUser,
    notification,
    markasread,
    storefcmtoken,
    passWordCheck,
    passwordChange,
    coverImageUpload,
    profileImageUpload
}