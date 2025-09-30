const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notification_type: { type: String },
    module_type: { type: String },
    module_sub_type: { type: String },
    title: { type: String },
    message: { type: String },
    web_link: { type: String },
    assigned_user: { type: String },
    viewed_user: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
