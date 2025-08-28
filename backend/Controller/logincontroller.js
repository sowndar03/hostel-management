const express = require('express');
const user = require('../Model/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    
}

module.exports = {
    store,
}