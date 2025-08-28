const express = require('express');
const user = require('../Model/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

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

module.exports = {
    store,
    setTheme,
    getTheme,
    loggedUser
}