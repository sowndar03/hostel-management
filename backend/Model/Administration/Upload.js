const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    file_name: { type: String },
    errors_reason: { type: String },
    status: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Template_Upload_logs", uploadSchema);