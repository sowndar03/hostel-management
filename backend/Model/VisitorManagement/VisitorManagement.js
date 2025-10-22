const mongoose = require('mongoose');

const visitorManagementSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    out_at: {
        type: String,
    },
    in_at: {
        type: String,
    },
    hosteller_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "Hosteller"
    },
    purpose_of_visit: {
        type: String
    },
    check_in_out_status: {
        type: Number,
        default: 1
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("visitor_management", visitorManagementSchema);