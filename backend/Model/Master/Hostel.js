const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    location_id: { type: String },
    hostel_name: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("Master_hostel", hostelSchema);
