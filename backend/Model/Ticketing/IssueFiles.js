const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    ticketing_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "Ticket"
    },
    file_path: {
        type: String
    },
    file_name: {
        type: String
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("issue_file", fileSchema);