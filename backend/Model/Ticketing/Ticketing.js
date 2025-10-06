const mongoose = require('mongoose');

const ticketingSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    hosteller_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "Hosteller"
    },
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
    concern: { type: String },
    ticket_status: { type: String },
    acknowledgment_remarks: { type: String },
    closed_remarks: { type: String },
    user_remarks: { type: String },
    user_updated_at: { type: Date },
    acknowledged_at: { type: Date },
    closed_at: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acknowledged_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    closed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketingSchema);