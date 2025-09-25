const mongoose = require('mongoose');

const hostellerSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    phone_no: { type: String },
    email: { type: String },
    dob: { type: Date },
    parent_name: { type: String },
    emergency_contact_no: { type: String },
    working_professional: { type: String },
    working_place: { type: String },
    address: { type: String },
    advance_amount: { type: Number },
    total_advance_amount: { type: Number },
    rent_status: { type: Number },
    rent: { type: Number },
    rent_paid: { type: Number },
    photo: { type: String },
    id_proof: { type: String },
    role_id: { type: String },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    hostel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Master_hostel" },
    building_id: { type: mongoose.Schema.Types.ObjectId, ref: "Master_building" },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Master_rooms" },
    seat_no: { type: mongoose.Schema.Types.ObjectId, ref: "Master_rooms_status" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true, default: 1 },
    trash: { type: String, enum: ["YES", "NO"], default: "NO" },
}, { timestamps: true })


module.exports = mongoose.model("Hosteller", hostellerSchema);