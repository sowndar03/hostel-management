const mongoose = require('mongoose');

const ticketingSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    hosteller_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "Hosteller"
    },
    concern: { type: String },
    ticket_status: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    closed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketingSchema);