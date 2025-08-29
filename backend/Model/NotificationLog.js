const mongoose = require('mongoose');

const notificaitonLogSchema = new mongoose.Schema({
    notification_id: { type: String },
    user_id: { type: String },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("Notification_log", notificaitonLogSchema);