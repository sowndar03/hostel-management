const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    hostel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Master_hostel"
    },
    building_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Master_building"
    },
    room_no: {type: String},
    room_count: {type: String},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model('Master_rooms', roomSchema);