const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    hostel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Master_hostel",
    },
    zone_lat: {
        type: String
    },
    zone_lng: {
        type: String
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("Zone", ZoneSchema);