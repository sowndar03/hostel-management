const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    location_name: { type: String },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);
