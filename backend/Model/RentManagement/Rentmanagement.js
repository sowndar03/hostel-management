const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
    hosteller_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hosteller" },
    month: { type: Number },
    year: { type: Number },
    total_rent: { type: Number },
    rent_paid: { type: Number },
    rent_status: { type: String, default: 1 },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });


module.exports = mongoose.model("Hosteller_rent_management", rentSchema);
