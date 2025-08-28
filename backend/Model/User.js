const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    theme: { type: String, default:"light" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true });

module.exports = mongoose.model("users", UserSchema);